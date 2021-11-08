import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpresasService } from '../../empresas/services/empresas.service';

@Injectable({
  providedIn: 'root'
})
export class CompaniasResolver implements Resolve<boolean> {
  private constructor(private companiPrd: SharedCompaniaService, private usuarioSistemaPrd: UsuarioSistemaService,
    private empresasProd: EmpresasService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    console.log(route.routeConfig?.path?.includes("/cliente/usuarios"));
    const esClienteEmpresa = state.url.includes("/cliente/usuarios");
    if (esClienteEmpresa) {
      return this.companiPrd.getAllCompany().pipe(map(x => x.datos));
    } else if (this.usuarioSistemaPrd.esCliente()) {
      return this.empresasProd.getAllEmp(this.usuarioSistemaPrd.getIdEmpresa()).pipe(map(x => x.datos));
    } else {
      return this.empresasProd.getEmpresaById(this.usuarioSistemaPrd.getIdEmpresa()).pipe(map(x => [x.datos]));
    }
  }
}
