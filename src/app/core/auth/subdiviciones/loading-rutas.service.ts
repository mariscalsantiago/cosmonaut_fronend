import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingRutasService implements CanLoad {
  
  constructor(private configuracionesPrd:ConfiguracionesService,private routerPrd:Router,private authPrd:AuthService) { }
  
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
      this.configuracionesPrd.cargandomodulo = true;
      if(!this.configuracionesPrd.accesoRuta && this.authPrd.isAuthenticated()){
          this.routerPrd.navigateByUrl("/inicio");
      }
      return this.configuracionesPrd.accesoRuta;
  }
}
