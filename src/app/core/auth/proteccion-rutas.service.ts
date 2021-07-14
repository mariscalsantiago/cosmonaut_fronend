import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProteccionRutasService implements CanActivate {
  constructor(private autPrd:AuthService,private routerPrd:Router,
    private usuarioSistemaPrd:UsuarioSistemaService,private configuracionPrd:ConfiguracionesService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if(!this.autPrd.isAuthenticated()){
      
      return this.routerPrd.parseUrl('/auth/login');
    }else if(!this.configuracionPrd.accesoRuta){
      console.log("No tiene acceso");
      return this.routerPrd.parseUrl('/inicio');
    }else{
      
      console.log("HAY ACCESO");
        this.usuarioSistemaPrd.introActivado = false;
      return  this.configuracionPrd.accesoRuta;
    }
  }
}
