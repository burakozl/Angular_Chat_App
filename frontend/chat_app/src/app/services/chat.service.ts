import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { Subject, Subscription } from 'rxjs';
import { io } from "socket.io-client";


@Injectable({
  providedIn: 'root',
})
export class ChatService {
  isJoined:boolean = false;
  public message$: Subject<string> = new Subject();
  public userLeft$: Subject<string> = new Subject();
  public userJoined$: Subject<string> = new Subject();
  initialUsers: any = [];

  constructor() { }

  socket = io('http://localhost:3000',{autoConnect:false});

  connectSocket(){
    if(!this.socket.connected){
      this.socket.connect();
    }
  }
  public sendMessage(message: any) {
    if(!this.socket.connected) return;
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
  // conType?: "socket" | "broadcast";
  // connection?: BroadcastService | SocketService;
  // connectionSub?: Subscription;
  // isJoined:boolean = false;
  // initialUsers: any = [];

  // public message$: Subject<string> = new Subject();
  // public userLeft$: Subject<string> = new Subject();
  // public userJoined$: Subject<string> = new Subject();

  // constructor(private broadcastService: BroadcastService, private socketService: SocketService) { }

  // async connect() {
  //   this.conType = await this.broadcastService.connect();
  //   if (this.conType == "broadcast") {
  //     this.connection = this.broadcastService;
  //   } else {
  //     this.connection = this.socketService;
  //   }
  //   this.destroyEvents();
  //   this.listenEvents();
  // }

  // public sendMessage(message: any) {
  //   this.connection.emit('message', message);
  // }

  // public joinTheRoom(userName: string) {
  //   return new Promise(resolve => {
  //     this.connection.emit('join', userName);
  //     this.isJoined = true;
  //     this.initialUsers = [];

  //     resolve([]);
  //   })
  // }

  // listenEvents() {
  //   this.connectionSub = this.connection.onEvent$.subscribe((res: any) => {
  //     switch (res.event) {
  //       case 'message':
  //         this.message$.next(res.data);
  //         break;
  //       case 'userleft':
  //         this.userLeft$.next(res.data);
  //         break;
  //       case 'userJoined':
  //         this.userJoined$.next(res.data);
  //         break;
  //       default:
  //         break;
  //     }
  //   })
  // }

  // destroyEvents() {
  //   if (this.connectionSub) this.connectionSub.unsubscribe();
  // }
}
