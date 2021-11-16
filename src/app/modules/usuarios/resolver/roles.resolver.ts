import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { RolesService } from '../../rolesypermisos/services/roles.service';

@Injectable({
  providedIn: 'root'
})
export class RolesResolver implements Resolve<any> {
  constructor(private usuariosSistemaPrd:UsuarioSistemaService,private rolesPrd:RolesService){}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.rolesPrd.getRolesByEmpresa(this.usuariosSistemaPrd.getIdEmpresa(), this.usuariosSistemaPrd.getVersionSistema(), true).pipe(map(o => o.datos));
  }
}
