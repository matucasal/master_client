import { Component, OnInit, Inject } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { MatSliderModule } from '@angular/material/slider';
import { NgModule } from '@angular/core';
import {Router} from '@angular/router';
import {MatFormField}  from '@angular/material/form-field';


import {MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


export interface DialogData {
    roomId: string;
    userId: string;
}


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  
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
  pregunta;
  time;
  constructor(
    private socketService: SocketService
    ,private router: Router,
    public dialog: MatDialog
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

    this.socketService.onNewMessage().subscribe((msg:any) => {
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

    this.socketService.duelNotice().subscribe(msg => {
        console.log("suscribo al duelNotice", msg)
        this.roomID = msg;
        //abro el dialog con el room id una vez que llega el duel notice
        this.openDialog(msg,this.userID)
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


  openDialog(roomId, userId): void {
    const dialogRef = this.dialog.open(DuelDialogComponent, {
      width: '250px',
      data: {roomId: roomId, userId: userId}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Se cerro el dialog');
      //this.animal = result;
    });
  }


}

@Component({
    selector: 'duel.dialog',
    templateUrl: 'duel.dialog.html',
})
export class DuelDialogComponent implements OnInit{

    userID;
    roomID;
    question;
    id = Math.random().toString(36).substr(2, 9);
    pregunta;

    constructor(
        private socketService: SocketService,
        public dialogRef: MatDialogRef<DuelDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {
        this.roomID = data.roomId;
        this.userID = data.userId;
    }

    ngOnInit() {
        this.socketService.onDuelQuestion().subscribe(msg => {
            console.log("Llego la pregunta al duelo", msg)
            this.question = msg;

            //question;
            //abro el dialog con el room id una vez que llega el duel notice
            //this.openDialog(msg,this.userID)
        })

        this.socketService.onDuelQuestionWon().subscribe(msg => {
            console.log("Llego el resultado de la question", msg)
            //question;
            //abro el dialog con el room id una vez que llega el duel notice
            //this.openDialog(msg,this.userID)
        })


        this.socketService.onDuelResult().subscribe(msg => {
            console.log("Llego el resultador del duelo", msg)
            //question;
            //abro el dialog con el room id una vez que llega el duel notice
            //this.openDialog(msg,this.userID)
        })
    }
    
    duelAccept(): void {
        //Entro al duelo
        let msg = {"roomID" : this.roomID, 'userID': this.userID}
        console.log("acepto duelo con este msg")
        console.log(msg)
        this.socketService.aceptarDuelo(msg);
    
    }

    enviarRespuesta(pregunta, time){
        let newid = (this.userID) ? this.userID : this.id;
        let msg = {"roomID" : this.roomID, "answer" : pregunta, 'userID': newid, "timeResponse": time}
        this.socketService.enviarRespuestaDuelo(msg);
    }


    onNoClick(): void {
        //Cierro el dialog
        this.dialogRef.close();
    }
  
}

