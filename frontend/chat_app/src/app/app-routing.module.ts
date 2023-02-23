import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './component/user/user.component';
import { RoomComponent } from './component/room/room.component';
import { RoomGuard } from './guards/room.guard';
import { UserGuard } from './guards/user.guard';

const routes: Routes = [
  {
    path: "",
    pathMatch: 'full',
    redirectTo : 'join'
  },
  {
    path:"join",component:UserComponent,
    canActivate:[UserGuard]
  },
  {
    path:"room",component:RoomComponent,
    canActivate:[RoomGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
