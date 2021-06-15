import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { permiso } from 'src/app/core/modelos/permiso';
import { RolesService } from 'src/app/modules/rolesypermisos/services/roles.service';
import { UsuarioSistemaService } from '../usuariosistema/usuario-sistema.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService {

  public scrollCompany: number = 1;

  public readonly  MODULOS:string = "modulos";
  public readonly MENUUSUARIO:string = "menuusuario";


  constructor() { }

  public getScrollCompany(scroll: number) {

    if (scroll !== 0) {
      this.scrollCompany = scroll;
    }
    return this.scrollCompany;
  }


  public isSession(llave: string): boolean {   
    let sesion = localStorage["sesion"];
    let isSession = false;
    if (Boolean(sesion)) {
      sesion = JSON.parse(sesion);
      let datos = sesion[llave];
      isSession = Boolean(datos);
    } else {
      isSession = false;
    }


    return isSession;
  }

  public getElementosSesion(llave: string): Observable<any> {
    return new BehaviorSubject<any>(JSON.parse(localStorage["sesion"])[llave]);
  }

  public setElementosSesion(llave: string, datos: any) {
    let sesion = localStorage["sesion"];
    if (Boolean(sesion)) {
      sesion = JSON.parse(sesion);
      sesion[llave] = datos;
    }
    else {
      sesion = {};
      sesion[llave] = datos;
    }
    localStorage["sesion"] = JSON.stringify(sesion);;
  }


  
  public traerDatosMenu(permisos: any,menu:any,version:number) {
    let arreglo:[any] = menu;
      
      
    arreglo.forEach((valor:any[any]) => {
        valor.seleccionado = false;
        valor.checked = false;
        valor.previo = false;
        if (valor.submodulos) {
          valor.submodulos.forEach((valor2:any[any]) => {
            let primerAuxSubmodulo = true;
            valor2.checked = false;
            valor2.previo = false;
            valor2.seleccionadosubmenu = false;
            let filtrar: any = Object.values(permisos).filter((x: any) => x.submoduloId == valor2.submoduloId);

            valor2.permisos?.forEach((valor3:any[any]) => {

              valor3.checked = this.encontrarConcidencias(filtrar, valor3);
              valor3.previo = valor3.checked;
              if (valor3.checked) {
                if (primerAuxSubmodulo) {
                  valor.checked = true;
                  valor.previo = true;
                  valor2.checked = true;
                  valor2.previo = true;
                  primerAuxSubmodulo = false;
                }
              }
            });
          });
        }
      });

     return arreglo;
  }

  private encontrarConcidencias(obj: any, valor3: permiso): boolean {
    let tieneModulo = Boolean(obj);
    if (tieneModulo) {
      tieneModulo = Object.values(obj).filter((x: any) => x.permisoId == valor3.permisoId).length > 0
    }
    return tieneModulo;
  }
}
