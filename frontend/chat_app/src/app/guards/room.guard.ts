import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageUtil } from '../local-storage.util';

@Injectable({
  providedIn: 'root'
})
export class RoomGuard implements CanActivate {

  constructor(private router:Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const user = LocalStorageUtil.get('user','');
      if(user){
        return true;
      }else{
        this.router.navigateByUrl('/join');
        return false;
      }
  }

}
