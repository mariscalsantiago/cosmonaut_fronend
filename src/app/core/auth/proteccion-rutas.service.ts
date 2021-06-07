import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProteccionRutasService implements CanActivate {
  constructor(private autPrd:AuthService,private routerPrd:Router,
    private usuarioSistemaPrd:UsuarioSistemaService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this.autPrd.isAuthenticated()){
      return this.routerPrd.parseUrl('/auth/login');
    }else{
        this.usuarioSistemaPrd.introActivado = false;
      return  true;
    }
  }
}
