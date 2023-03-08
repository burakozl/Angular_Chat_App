import { Observable, Subject, Subscribable, Subscription, fromEvent, interval, timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Injectable, NgZone } from '@angular/core';
import { runInZone } from '../run-in-zone';
import { ChatService } from './chat.service';

interface BroadcastMessage {
  type: string;
  payload: any;
}

export class BroadcastService {

  private firstPing = false;

  private broadcastChannel: BroadcastChannel;
  private onMessage$ = new Subject<any>();

  private onPingMessage$ = new Subject<any>();

  public chatList$ = new Subject<any>();
  public userList$ = new Subject<any>();

  public mustConnectSocket$ = new Subject<any>();

  private pingSubscription!: Subscription;

  public channelList = new Map<number, boolean>();
  public lastPingAt?: number;

  public id?: number;
  public hasSocketCon?: boolean;
  private timeOfPp: number = 500;

  constructor(broadcastChannelName: string, private ngZone: NgZone) {
    this.broadcastChannel = new BroadcastChannel(broadcastChannelName);
    this.broadcastChannel.onmessage = (message) => this.onMessage$.next(message.data);
  }
  pingPong() {
    const id = Date.now();
    //console.log('Broadcast service used in tab ' + id);
    this.id = id;
    this.messagesOfType('pingMessages').subscribe(message => {
      this.checkSocketControl();
      this.channelList.clear();
      this.channelList.set(message.payload.id, message.payload.hasSocketCon);
      this.lastPingAt = Date.now();
      let pongMessage = {
        type: 'pongMessages',
        payload: {
          id: this.id,
          hasSocketCon: this.hasSocketCon
        }
      }
      this.broadcastChannel.postMessage(pongMessage);
      //console.log("ping Geldi pong gonderdim", this.channelList);
      //console.log("pong message", pongMessage);

    });

    this.messagesOfType('pongMessages').subscribe(message => {
      this.channelList.set(message.payload.id, message.payload.hasSocketCon);
      //console.log("pong Geldi", this.channelList);
    });

    this.messagesOfType('chatChanged').subscribe(message => {
      this.chatList$.next(message.payload);
    });

    this.messagesOfType('userChanged').subscribe(user => {
      this.userList$.next(user.payload);
    })
  }

  checkSocketControl() {
    let hasConnection = false;
    let minId: number | undefined;
    for (let [key, value] of this.channelList) {
      if (value) {
        hasConnection = true;
      }

      if (!minId || key < minId) {
        minId = key;
      }
    }
    if (hasConnection) return;
    if (this.firstPing && (!minId || this.id! < minId!)) {
      this.mustConnectSocket$.next(true);
      this.hasSocketCon = true;
    }
  }

  sendPing() {
    this.pingPong();
    this.pingSubscription = timer(0, this.timeOfPp).subscribe(() => {
      const currentTime = Date.now();
      if (this.lastPingAt && (currentTime - this.lastPingAt) <= this.timeOfPp) {
        return;
      }
      this.checkSocketControl();
      this.channelList.clear();
      this.firstPing = true;
      let pingMessage = {
        type: 'pingMessages',
        payload: {
          id: this.id,
          hasSocketCon: this.hasSocketCon
        }
      }
      this.broadcastChannel.postMessage(pingMessage);
      //console.log("ping-", pingMessage.payload);
    });
  }

  get messages() {
    return this.onPingMessage$.asObservable();
  }

  publish(eventType: string, message: any): void {
    const data = {
      type: eventType,
      id: this.id,
      payload: message
    }
    this.broadcastChannel.postMessage(data);
  }

  pushChatMessage(messageItem: any) {
    this.publish('chatChanged', messageItem);
    this.chatList$.next(messageItem);
  }
  pushUsers(user: any) {
    this.publish('userChanged', user);
    this.userList$.next(user);
  }

  messagesOfType(type: string): Observable<BroadcastMessage> {
    return this.onMessage$.pipe(
      // It is important that we are running in the NgZone. This will make sure that Angular component changes are immediately visible in the browser when they are updated after receiving messages.
      runInZone(this.ngZone),
      filter(message => message.type === type)
    );
  }
}
