import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { permiso } from 'src/app/core/modelos/permiso';



const CryptoJS = require("crypto-js");



@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService {

  public scrollCompany: number = 1;

  public readonly MODULOS: string = "modulos";
  public readonly MONEDAS: string = "monedas";
  public readonly MENUUSUARIO: string = "menuusuario";
  public readonly PERMISOSXVERSIONES: string = "permisosxversiones";
  public readonly JWT: string = "jwt";


  public accesoRuta: boolean = false;

  public cantidad: number = 0;

  public cargandomodulo:boolean = false;


  public permisosActuales!: Array<clasepermiso>;


  public ocultarChat: any = true;

  public notificaciones: number = 0;

  public menu: boolean = false;
  public MENUPRINCIPAL = undefined;
  public modulosCargados!:Array<Number>;

  public static referencia:ConfiguracionesService;
  



  private secretKey: string = "llavesecreta@por@santiagoantoniomariscal";



  constructor() { 
    ConfiguracionesService.referencia = this;
  }

  public getScrollCompany(scroll: number) {

    if (scroll !== 0) {
      this.scrollCompany = scroll;
    }
    return this.scrollCompany;
  }


  public isSession(llave: string): boolean {
    let isSession = false;
    let sesionStr:string = sessionStorage["sesion"];
    if(Boolean(sesionStr)){
      let bytes = CryptoJS.AES.decrypt(sesionStr, this.secretKey);
      let textodesencriptado = bytes.toString(CryptoJS.enc.Utf8);
      let sesion = textodesencriptado;
      if (Boolean(sesion)) {
        sesion = JSON.parse(sesion);
        let datos = sesion[llave];
        isSession = Boolean(datos);
      } else {
        isSession = false;
      }
    }


    return isSession;
  }

  public getElementosSesion(llave: string): Observable<any> {
    let bytes = CryptoJS.AES.decrypt(sessionStorage["sesion"], this.secretKey);
    let textodesencriptado = bytes.toString(CryptoJS.enc.Utf8);
    return new BehaviorSubject<any>(JSON.parse(textodesencriptado)[llave]);
  }

  public getElementosSesionDirecto(llave: string): any {
    let bytes = CryptoJS.AES.decrypt(sessionStorage["sesion"], this.secretKey);
    let textodesencriptado = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(textodesencriptado)[llave];
  }

  public setElementosSesion(llave: string, datos: any) {

    let sesion = sessionStorage["sesion"];
   
    if (Boolean(sesion)) {
      let bytes = CryptoJS.AES.decrypt(sesion, this.secretKey);
      let textodesencriptado = bytes.toString(CryptoJS.enc.Utf8);
      sesion = JSON.parse(textodesencriptado);
      sesion[llave] = datos;
    }
    else {
      sesion = {};
      sesion[llave] = datos;
    }


    sessionStorage["sesion"] = CryptoJS.AES.encrypt(JSON.stringify(sesion), this.secretKey).toString();
  }



  public traerDatosMenu(permisos: any, menu: any, version: number, esCliente?: boolean) {
    let arreglo: [any] = menu;


    arreglo.forEach((valor: any[any]) => {

      valor.seleccionado = false;
      valor.checked = false;
      valor.previo = false;
      if (valor.submodulos) {
        valor.submodulos.forEach((valor2: any[any]) => {
          let primerAuxSubmodulo = true;
          valor2.checked = false;
          valor2.previo = false;
          valor2.seleccionadosubmenu = false;



          let filtrar: any = Object.values(permisos).filter((x: any) => x.submoduloId == valor2.submoduloId);


          if ((!esCliente && valor2.submoduloId !== 6) || (esCliente && (valor2.submoduloId === 6 || valor2.submoduloId === 7) || valor2.submoduloId === 8 || valor2.submoduloId === 9) || version === 1) {
            valor2.permisos?.forEach((valor3: any[any]) => {

              valor3.checked = this.encontrarConcidencias(filtrar, valor3);
              valor3.previo = valor3.checked;
              if (valor3.checked) {
                if (primerAuxSubmodulo) {
                  valor.checked = true;
                  valor.previo = true;
                  valor2.checked = true;
                  valor2.previo = true;
                  primerAuxSubmodulo = false;

                  if (valor.nombreModulo.includes("Chat") && valor2.checked) {

                    let bytes = CryptoJS.AES.decrypt(sessionStorage["usuario"], this.secretKey);
                    let textodesencriptado = bytes.toString(CryptoJS.enc.Utf8);
                    let usuario = JSON.parse(textodesencriptado);
                    
                    usuario.esRecursosHumanos = true;
                    sessionStorage["usuario"] = CryptoJS.AES.encrypt(JSON.stringify(usuario), this.secretKey).toString();

                  }
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


  public setPermisos(obj: Array<clasepermiso>) {

    this.permisosActuales = obj;
  }

  public getPermisos(cadena: string): boolean {

    let mostrar: boolean = false;
    for (let item of this.permisosActuales) {
      if (cadena == item.descripcion && item.checked) {
        mostrar = true;
        break;
      }
    }
    return mostrar;
  }


  public getCantidadDispersion() {

    return this.cantidad;

  }

  public setCantidad(cantidad: number) {
    this.cantidad = cantidad;
  }


  public static establecerMenu(m:any){
    setTimeout(() => {
      ConfiguracionesService.referencia.accesoRuta = false;
      ConfiguracionesService.referencia.cargandomodulo = false;
    }, 20);
    return m;
  }
}

interface clasepermiso {
  permisoId: number,
  descripcion: string,
  checked: boolean
}