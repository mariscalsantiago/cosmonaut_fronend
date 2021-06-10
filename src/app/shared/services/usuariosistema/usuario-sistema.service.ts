import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { direcciones } from 'src/assets/direcciones';
import { AuthService } from 'src/app/core/auth/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioSistemaService {

  public usuario!: usuarioClass;
  public introActivado:boolean = true;

  constructor(private http: HttpClient) {
    this.usuario = new usuarioClass(470, 852);
  }


  

  public getUsuario() {
    return this.usuario;
  }

  public setUsuario(usuario: usuarioClass) {
    this.usuario = usuario;
  }

  public getIdEmpresa() {
    return this.usuario.idEmpresa;
  }

  public getRol(): string {
    let rol: string = "ADMIN|EMPRESA|COMPANIA|OTRO";
    let idTipoPersona = this.usuario.getUsuario()?.tipoPersonaId?.tipoPersonaId;
    
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
    return this.usuario.getUsuario();
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
    const httpOptions = {
      headers:new HttpHeaders({
        "Content-Type":"application/json"
      })
    };

    let json = JSON.stringify(obj);

    return this.http.post(`${direcciones.usuariosAuth}/reestablecerPwd`,json,httpOptions);
  }



  public obtenerInfo( correo: any): Observable<any> {
    return this.http.get(`${direcciones.centroCostosCliente}/login/${correo}`);
  }

  public logout():Observable<any>{
    return this.http.get(`${environment.rutaAdmin}/auth/logout`);
  }

  
}




export class usuarioClass {
  public idEmpresa!: number;
  public nombreEmpresa!: string;
  public idUsuario!: number;
  public usuario!: any;


  public constructor(idEmpresa: number, idUsuario: number) {

    this.idUsuario = idUsuario;
    this.idEmpresa = idEmpresa;
  }

  public setDatosEmpleado(obj: any) {
    this.usuario = obj;
  }


  public getUsuario() {
    return this.usuario;
  }




}


export class datosTemporales{
  public static configuracionEmpresaNombreEmpresa:string = "";
}
