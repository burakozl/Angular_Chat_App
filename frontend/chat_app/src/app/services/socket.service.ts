import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io } from "socket.io-client";

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  isJoined:boolean = false;
  public message$: Subject<string> = new Subject();
  public userLeft$: Subject<string> = new Subject();
  public userJoined$: Subject<string> = new Subject();
  initialUsers: any = [];

  constructor() { }

  socket = io('http://localhost:3000',{autoConnect:false});

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
      this.socket.emit('join',userName,(res:any) => {
        if(res){
         this.isJoined = true;
         this.initialUsers = res;
        }
        resolve(res);
      });
    })
  }
}
