import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './component/user/user.component';
import { RoomComponent } from './component/room/room.component';

const routes: Routes = [
  {
    path: "",
    pathMatch: 'full',
    redirectTo : 'join'
  },
  {
    path:"join",component:UserComponent
  },
  {
    path:"room",component:RoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
