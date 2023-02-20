import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from 'src/app/services/chat.service';
import { LocalstrorageService } from 'src/app/services/localstrorage.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
  standalone: true,
  imports:[CommonModule,FormsModule]
})
export class RoomComponent {

  newMessage!: string;
  messageList: any[] = [];
  userName!:string;
  constructor(private chatService: ChatService,private localStrorageService:LocalstrorageService){
    this.userName = JSON.parse(this.localStrorageService.get("user") || "Guest");
  }

  ngOnInit(){
    this.chatService.joinTheRoom(this.userName);
    this.chatService.initEvents();
    this.chatService.userLeft$.subscribe((user: string) => {
      this.messageList.push({user:'system', message: `${user} has left the room`});
    });
    this.chatService.userJoined$.subscribe((user: string) => {
      this.messageList.push({user:'system', message: `${user} joined`});
    });
    this.chatService.message$.subscribe((data: any) => {
        this.messageList.push(data);

    })
  }

  sendMessage() {
    if(this.newMessage != null){
      this.chatService.sendMessage(this.newMessage);
      this.messageList.push({user:this.userName,message: this.newMessage});
      this.newMessage = '';
    }else{
      alert('Enter the text area something...')
    }
    console.log(this.messageList);

  }
}
