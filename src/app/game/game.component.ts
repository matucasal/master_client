import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {
  title = 'front';
  user = {'user': 'marcos'};
  room;
  game;
  level;
  username;
  question;
  pairing = false;
  bet;
  round;
  userID;
  auth;
  id = Math.random().toString(36).substr(2, 9);
  roomID = "";
  constructor(
    private socketService: SocketService
    ,private router: Router
  ) { }
  
  ngOnInit() {
    console.log("etoy en game")
    if (!localStorage.getItem('token')){
      this.router.navigate(['']);
    }
    
    //cargo el token, el userID y el lvl
    this.auth = localStorage.getItem('token')
    this.userID = localStorage.getItem('userID')
    this.level = localStorage.getItem('level')
    this.username = localStorage.getItem('username')

    this.socketService.onNewMessage().subscribe(msg => {
      console.log("Estoy en new message")
      this.room = JSON.parse(msg);
      this.room = this.room[0];
      this.roomID = this.room.id;
      console.log(this.room);
    });

    this.socketService.onNewPlayerJoined().subscribe(msg => {
      console.log("New Player Joinned");
      console.log(msg);
    });

    this.socketService.onNewBet().subscribe(msg => {
      console.log("Llego apuesta");
      console.log(msg);
    });

    this.socketService.playerJoinned().subscribe(room => {
      this.room = room;
      console.log(room);
    })

    this.socketService.onNewQuestion().subscribe(question => {
      this.question = question;
      console.log(question);
    })

    this.socketService.onNewRound().subscribe(round => {
      this.round = round;
    })

  }

  doAuth(auth){
    //let tokenLocal = localStorage.getItem('token');
    let tokenLocal = auth
    
    console.log('tokenLocal', tokenLocal)
    this.socketService.auth(tokenLocal)
  }

  newUser(username) {
    let newid = (this.userID) ? this.userID : this.id;
    var msg = {'roomId': this.room.id, 'user': {'name': username, 'level': 'Virtuoso', 'userID': newid }};
    this.socketService.join(msg);

  }

  searchGame(level) {
    console.log(level);
    this.socketService.searchGame(level);
  }


  userBet(bet){
    let newid = (this.userID) ? this.userID : this.id;
    let msg = {"roomID": this.roomID, "value": bet, 'userID': newid, 'pairing': this.pairing};
    this.socketService.userBet(msg);
  }

  enviarRespuesta(pregunta, time){
    let newid = (this.userID) ? this.userID : this.id;
    let msg = {"roomID" : this.roomID, "answer" : pregunta, 'userID': newid, "timeResponse": time}
    this.socketService.enviarRespuesta(msg);
  }

  onChange(isChecked: boolean){
    if(isChecked){
      this.pairing = true;
    }else{
      this.pairing = false;
    }
  }

}

