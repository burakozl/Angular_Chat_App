import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, ViewChild, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BROADCAST_SERVICE } from 'src/app/app.tokens';
import { FilterPipe } from 'src/app/customPipe/filter.pipe';
import { LocalStorageUtil } from 'src/app/local-storage.util';
import { BroadcastService } from 'src/app/services/broadcast.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe]
})
export class RoomComponent implements OnInit, OnDestroy {

  @ViewChild('scroll', { static: true }) scroll: any;

  newMessage!: string;
  messageList: any[] = [];
  users: any;
  userName!: string;
  searchUser!: string;
  showNewMessage: number = 0;
  showScrollDownIcon: boolean = false;
  isNearBottom: boolean = false;
  scrollContainer: any;
  subscription = new Subscription();

  constructor(private chatService: ChatService, private router: Router, @Inject(BROADCAST_SERVICE) public broadCastService: BroadcastService) {
    this.userName = LocalStorageUtil.get("user", "");
    this.subscription.add(this.broadCastService.mustConnectSocket$.subscribe(() => {
      this.chatService.connectSocket();
    }));
   this.broadCastService.sendPing();
  }

  ngOnInit() {

    if (!this.userName) {
      this.router.navigateByUrl('/join');
      return;
    }

    if (!this.chatService.isJoined) {
      this.joinRoom();
    } else {
      this.users = this.chatService.initialUsers;
    }

    this.chatService.initEvents();

    this.chatService.userLeft$.subscribe((user: string) => {
      if (!user) return;
      this.broadCastService.pushChatMessage({ user: 'system', message: `${user} has left the room` });
      this.users = this.users.filter((u: any) => u != user);
      this.broadCastService.pushUsers(this.users);
      this.scrollIconControl();
    });

    this.chatService.userJoined$.subscribe((user: string) => {
      this.broadCastService.pushChatMessage({ user: 'system', message: `${user} joined` });
      this.broadCastService.pushUsers(user);
      this.users = this.users.filter((u: any) => u != user);
      this.users.push(user);
      this.scrollIconControl();
    });

    this.chatService.message$.subscribe((data: any) => {
      this.broadCastService.pushChatMessage(data.message);
      this.scrollIconControl();
    });

    this.scrollContainer = this.scroll.nativeElement;
    this.broadCastChannel();
    this.broadCastService.channelList


  }

  async joinRoom() {
    this.users = await this.chatService.joinTheRoom(this.userName);
  }


  sendMessage() {
    if (this.newMessage == null || this.newMessage == '') {
      alert('Enter the text area something...')
      return;
    }

    this.broadCastService.pushChatMessage({ user: this.userName, message: this.newMessage });
     //this.chatService.sendMessage(this.newMessage);
    // this.messageList.push({ user: this.userName, message: this.newMessage });
    this.newMessage = '';
  }

  scrollIconControl() {
    if (this.showScrollDownIcon) {
      this.showNewMessage++;
    }
    if (!this.showScrollDownIcon) {
      this.scrollToBottom();
    };
  }

  scrollToBottom() {
    setTimeout(() => {
      this.scroll.nativeElement.scrollTo({
        top: (this.scroll.nativeElement.scrollHeight - this.scroll.nativeElement.clientHeight),
        behavior: 'smooth'
      });
    }, 0);
    this.showNewMessage = 0;
  }

  isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  scrollEvent(event: any) {
    this.isNearBottom = this.isUserNearBottom();
    if (!this.isNearBottom) {
      if (event.target.scrollTop > (this.scroll.nativeElement.scrollHeight - this.scroll.nativeElement.clientHeight - 5)) {
        this.showScrollDownIcon = false;
      } else {
        this.showScrollDownIcon = true;
      }
    }
    else {
      this.showScrollDownIcon = false;
    }
  }

  broadCastChannel() {
    this.subscription.add(this.broadCastService.chatList$.subscribe(message => {
      this.messageList.push(message);

      if(message.user == this.userName){
        this.chatService.sendMessage(message);
        //console.log(message);
      }

      this.scrollContainer = this.scroll.nativeElement;
      if (!this.showScrollDownIcon) {
        this.scrollToBottom();
      };
    }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
