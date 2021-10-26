import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { GruponominasService } from '../../empresas/pages/submodulos/gruposNomina/services/gruponominas.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogoGruponominaResolver implements Resolve<any> {
  constructor(private gruponominaPrd: GruponominasService,private usuarioSistemPrd:UsuarioSistemaService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.gruponominaPrd.getAll(this.usuarioSistemPrd.getIdEmpresa()).pipe(map(datos => datos.datos));
  }
}
