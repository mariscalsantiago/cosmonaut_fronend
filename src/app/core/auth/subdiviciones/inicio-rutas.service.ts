import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class InicioRutasService implements CanActivate {

  constructor(private routerPrd:Router,private autPrd:AuthService,private configuracionPrd:ConfiguracionesService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(this.autPrd.isAuthenticated()){
      return  true;
    }else{
      return this.routerPrd.parseUrl("/auth/login");
    }
    
  }
}
