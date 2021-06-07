import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../auth.service";

@Injectable({
    providedIn: 'root'
  })
  export class ProteccionRutasLoginService implements CanActivate {
    constructor(private routerPrd:Router,private autPrd:AuthService) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if(this.autPrd.isAuthenticated()){
        return this.routerPrd.parseUrl('/inicio');
      }else{
        return  true;
      }
    }
  }