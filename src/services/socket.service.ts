import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: SocketIOClient.Socket;

  constructor() {
    this.socket = io('http://35.247.214.58:8000');
  }

  // EMITTER
  newUser(msg: any) {
    this.socket.emit('newUser', msg)
  }

  auth(msg: any){
    console.log("estoy en auth", msg)
    this.socket.emit('authenticate', { "token": msg }, function(data) {
      console.log(data);
    });
  }

  searchGame(msg: any) {
    console.log(msg);
    this.socket.emit('searchGame', msg);
  }

  getAllRooms(msg: any) {
    this.socket.emit('getAllRoms', 'get');
  }

  join(msg: any) {
    this.socket.emit('join', msg);
  }

  userBet(msg: any) {
    console.log("Se emite el bet");
    this.socket.emit('userBet', msg);
  }

  enviarRespuesta(msg: any) {
    console.log("Se emite la respuesta");
    this.socket.emit('userAnswer', msg);
  }

  // HANDLER
  onNewMessage() {
    return Observable.create(observer => {
      this.socket.on('Welcome', msg => {
        observer.next(msg);
      });
      this.socket.on('usersInGame', msg => {
        observer.next(msg);
      })
    });
  }

  onNewPlayerJoined() {
    return Observable.create(observer => {
      this.socket.on('newPlayerJoinned', msg => {
        observer.next(msg);
      });
    });
  }

  onNewBet() {
    return Observable.create(observer => {
      this.socket.on('newBet', msg => {
        observer.next(msg);
      });
    });
  }

  playerJoinned(){
    return Observable.create(observer => {
      this.socket.on('playerJoinned', game => {
        observer.next(game);
      });
    });
  }



  onNewQuestion() {
    return Observable.create(observer => {
      this.socket.on('question', question => {
        observer.next(question);
        console.log(question);
      });
    });
  }

  onNewRound() {
    return Observable.create(observer => {
      this.socket.on('newRound', round => {
        observer.next(round);
        console.log(round);
      });
    });
  }



}
