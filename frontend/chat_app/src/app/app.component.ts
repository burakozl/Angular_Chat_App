import { Component } from '@angular/core';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  newMessage!: string;
  messageList: string[] = [];
  users:string[] = [];
  constructor(private chatService: ChatService){

  }

  ngOnInit(){
    // this.chatService.getNewMessage().subscribe((message: string) => {
    //   if(message != '' ){
    //     this.messageList.push(message);
    //     this.users.push(message.split("-")[0]);
    //     console.log(this.users);

    //   }
    // })
  }

  sendMessage() {
    // if(this.newMessage != null){
    //   this.chatService.sendMessage(this.newMessage);
    //   this.newMessage = '';
    // }else{
    //   alert('Enter the text area something...')
    // }

  }
}
