import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, Subject, } from 'rxjs';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpresasService } from '../services/empresas.service';


@Injectable({
  providedIn: 'root'
})
export class MultiempresaResolver implements Resolve<boolean> {
  constructor(private usuarioSistemaPrd: UsuarioSistemaService, private empresasProd: EmpresasService, private modalPrd: ModalService, private routerPrd: Router) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {



  debugger;


    let sujeto: Subject<boolean> = new Subject<boolean>();

    if (route.params["tipoinsert"] == 'nuevo') {
      if (!this.usuarioSistemaPrd.usuario.multiempresa) {
        if (this.usuarioSistemaPrd.esCliente()) {
          this.empresasProd.getAllEmp(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => {
            if (datos.datos) {
              this.modalPrd.showMessageDialog(this.modalPrd.error, "Este cliente no es multiempresa, no podrás agregar más empresas.").then(() => {
                this.routerPrd.navigateByUrl("/");
                sujeto.next(false);
                sujeto.complete();
              });
            } else {
              sujeto.next(true);
              sujeto.complete();
            }
          });
        }
      }else{
       setTimeout(() => {
        sujeto.next(true);
        sujeto.complete();
       }, 20);
      }
    } else {
      setTimeout(() => {
        sujeto.next(true);
        sujeto.complete();
      }, 20);
    }

    return sujeto;
  }
}
