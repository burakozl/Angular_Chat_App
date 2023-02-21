import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageUtil } from 'src/app/local-storage.util';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  standalone: true,
  imports:[CommonModule,FormsModule]
})
export class RoomComponent implements AfterViewInit {

  @ViewChild('scroll', { static: true }) scroll: any;

  newMessage!: string;
  messageList: any[] = [];
  users: any;
  userName!:string;

  constructor(private chatService: ChatService, private router:Router){
    this.userName = LocalStorageUtil.get("user","");
  }

  ngOnInit(){
    if(!this.userName) {
      this.router.navigateByUrl('/join');
      return;
    }
    if(!this.chatService.isJoined){
      this.joinRoom();
    }else{
      this.users = this.chatService.initialUsers;
    }
    this.chatService.initEvents();
    this.chatService.userLeft$.subscribe((user: string) => {
      this.messageList.push({user:'system', message: `${user} has left the room`});
      this.users = this.users.filter((u:any) => u != user);
    });
    this.chatService.userJoined$.subscribe((user: string) => {
      this.messageList.push({user:'system', message: `${user} joined`});
      this.users.push(user);
    });
    this.chatService.message$.subscribe((data: any) => {
        this.messageList.push(data);
    })
  }

  ngAfterViewInit(){
    this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
  }


  async joinRoom() {
     this.users = await this.chatService.joinTheRoom(this.userName);
  }

  sendMessage() {
    if(this.newMessage != null){
      this.chatService.sendMessage(this.newMessage);
      this.messageList.push({user:this.userName,message: this.newMessage});
      setTimeout(() => {
        this.scroll.nativeElement.scrollTo(0, this.scroll.nativeElement.scrollHeight);
      }, 0);
      this.newMessage = '';
    }else{
      alert('Enter the text area something...')
    }

  }
}
