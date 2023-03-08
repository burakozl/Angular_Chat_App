import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { LocalStorageUtil } from 'src/app/local-storage.util';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userName!:string;

  constructor(private router:Router,private chatService:ChatService) {}

  ngOnInit(){
  }

  async joinTheRoom(){
    LocalStorageUtil.set("user",this.userName);
    this.chatService.connectSocket();
    const response = await this.chatService.joinTheRoom(this.userName);
    if(response) this.router.navigateByUrl('/room');
    else console.log("Can not join the room");
  }

}
