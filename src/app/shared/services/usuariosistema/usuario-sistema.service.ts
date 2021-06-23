import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { direcciones } from 'src/assets/direcciones';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioSistemaService {

  public usuario!: usuarioClass;
  public introActivado:boolean = true;

  constructor(private http: HttpClient,private httpBack:HttpBackend) {
    this.usuario = new usuarioClass();
  }


  

  public getUsuario() {
    this.usuario = this.usuario.usuarioId == undefined ? JSON.parse(localStorage["usuario"]):this.usuario;
    return this.usuario;
  }

  public setUsuario(usuario: usuarioClass) {
    this.usuario = usuario;
    localStorage["usuario"]=JSON.stringify(usuario);
  }

  public getIdEmpresa() {
    if(localStorage["usuario"] !== undefined){
    this.usuario = this.usuario.centrocClienteId == undefined  ? JSON.parse(localStorage["usuario"]):this.usuario;}
    return this.usuario.centrocClienteId;
  }

  public esCliente() {
    if(localStorage["usuario"] !== undefined){
    this.usuario = this.usuario.esCliente == undefined  ? JSON.parse(localStorage["usuario"]):this.usuario;}
    return Boolean(this.usuario.esCliente);
  }

  public getRol(): string {
    let idTipoPersona = 3234;
    let rol:string = "";
    
    switch (idTipoPersona) {
      case 3:
        rol = "ADMINCOMPANIA";
        break;
      case 1:
        rol = "ADMINEMPRESA"
        break;
      case 2:
        rol = "ADMINEMPRESA"
        break;
      case 4:
        rol = "ADMINEMPRESA"
        break;
      case 5:
        rol = "ADMINEMPRESA"
        break;
      default:
        rol = "ALL"
        break;
    }

    


    return rol;
  }

  public getDatosUsuario(){
    return this.usuario;
  }

  public getInformacionAdicionalUser(userName:string):Observable<any>{
    return this.http.get(`${direcciones.usuariosAuth}/obtener/username/${userName}`);
  } 

  public resetPasword(obj:any):Observable<any>{
    const httpOptions = {
      headers:new HttpHeaders({
        "Content-Type":"application/json"
      })
    };

    let json = JSON.stringify(obj);

    return this.http.post(`${direcciones.usuariosAuth}/cambiarPwd`,json,httpOptions);
  }


  public enviarCorreorecuperacion(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    const httpOptions = {
      headers:new HttpHeaders({
        "Content-Type":"application/json"
      })
    };

    return this.http.post(`${direcciones.usuariosAuth}/reestablecerPwd`,json,httpOptions);
  }



  public obtenerInfo( correo: any): Observable<any> {


    return this.http.get(`${direcciones.centroCostosCliente}/login/${correo}`);
  }

  public logout():Observable<any>{
    return this.http.get(`${environment.rutaAdmin}/auth/logout`);
  }

  public getVersionSistema(){
      return Number(localStorage.getItem("version"))
  }

  public setVersionSistema(idNumber:string){
      localStorage.setItem("version",idNumber);
  }

  
}




export class usuarioClass {
  public usuarioId!:number;
  public nombre!:string;
  public apellidoPat!:string;
  public email!:string;
  public fechaAlta!:Date;
  public passwordProvisional!:boolean;
  public rolId!:number;
  public submodulosXpermisos!:any;
  public centrocClienteId!:number;
  public rfc!:string;
  public razonSocial!:string;
  public nombreEmpresa!:string;
  public multiempresa!:boolean;
  public esCliente!:boolean;
  public centrocClienteIdPadre!:number;

}


export class datosTemporales{
  public static configuracionEmpresaNombreEmpresa:string = "";
}
