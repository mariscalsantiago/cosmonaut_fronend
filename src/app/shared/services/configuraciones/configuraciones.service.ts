import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { permiso } from 'src/app/core/modelos/permiso';


@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService {

  public scrollCompany: number = 1;

  public readonly MODULOS:string = "modulos";
  public readonly MONEDAS:string = "monedas";
  public readonly MENUUSUARIO:string = "menuusuario";
  public readonly PERMISOSXVERSIONES:string = "permisosxversiones";
  
  public accesoRuta:boolean = false;

  public cantidad:number = 0;


  public permisosActuales!:Array<clasepermiso>;


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


  
  public traerDatosMenu(permisos: any,menu:any,version:number,esCliente?:boolean) {
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

            debugger;
            if((!esCliente && valor2.submoduloId !== 6) || (esCliente && (valor2.submoduloId === 6 || valor2.submoduloId === 7) || valor2.submoduloId === 8 || valor2.submoduloId === 9)){
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
            }

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


  public setPermisos(obj:Array<clasepermiso>){
    
      this.permisosActuales = obj;
  }

  public getPermisos(cadena:string):boolean{
    let mostrar:boolean = false;
     for(let item of this.permisosActuales){
        if(cadena == item.descripcion && item.checked){
            mostrar = true;
            break;
        }
     }
    return mostrar;
  }


  public getCantidadDispersion(){
    
    return this.cantidad;

  }

  public setCantidad(cantidad:number){
      this.cantidad = cantidad;
  }


  
 


  
}

interface clasepermiso{
   permisoId:number,
   descripcion:string,
   checked:boolean
}