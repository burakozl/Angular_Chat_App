import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalstrorageService } from 'src/app/services/localstrorage.service';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userName!:string;

  constructor(private localStorageService:LocalstrorageService,private router:Router,private chatService:ChatService) {}

  ngOnInit(){
  }

  async joinTheRoom(){
    this.localStorageService.set("user",JSON.stringify(this.userName));
    const response = await this.chatService.joinTheRoom(this.userName);

    if(response) this.router.navigateByUrl('/room');
    else console.log("Can not join the room");
  }

}
