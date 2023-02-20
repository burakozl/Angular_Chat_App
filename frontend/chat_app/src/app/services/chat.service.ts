import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io } from "socket.io-client";


@Injectable({
  providedIn: 'root',
})
export class ChatService {

  public message$: Subject<string> = new Subject();
  public userLeft$: Subject<string> = new Subject();
  public userJoined$: Subject<string> = new Subject();

  constructor() { }

  socket = io('http://localhost:3000');

  public sendMessage(message: any) {
    this.socket.emit('message', message);
  }

  public initEvents(){
    this.socket.on('message', (message) => {
      this.message$.next(message);
    });

    this.socket.on('userleft', (user) => {
      this.userLeft$.next(user);
    });
    this.socket.on('userJoined', (user) => {
      this.userJoined$.next(user);
    });
  };

  public joinTheRoom(userName:string){
    return new Promise(resolve => {
      this.socket.emit('join',userName,(res:boolean) => {
        resolve(res);
      });
    })
  }

}
