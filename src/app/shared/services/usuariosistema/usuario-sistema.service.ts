import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class UsuarioSistemaService {

  public usuario!: usuarioClass;

  constructor(private http: HttpClient) {

    this.usuario = new usuarioClass(112, 1);
    console.log("Se inicializa mi usuario de sistema");

  }


  public login(obj: any): Observable<any> {
    return this.http.get(`${direcciones.centroCostosCliente}/login/${obj.email}`);
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
    console.log("Esto son los datos del usuari rol",this.usuario.getUsuario());
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

    console.log("Este es el rol",rol);


    return rol;
  }

  public getDatosUsuario(){
    return this.usuario.getUsuario();
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
