import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';
import { environment } from 'src/environments/environment';
import { usuarioClass } from '../usuariosistema/usuario-sistema.service';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  public webSocket!: WebSocket;
  public webSocketEspecifico!: WebSocket;
  public mensajes: any = [];
  public nombreEmpleado: string = "";

  public dentroListaChat:boolean = false;


  public notificacionesglobito: number = 0;
  public notificacionesMenu: number = 0;
  conectarEspecificoBool:boolean = false;

  public scrnotificacion:Subject<any> = new Subject();









  constructor(private http: HttpClient) {

    console.log("INICA EL CONSTRUCTOR NOTIFICACIONES");
  }


  public conectar(conexion: string, usuario: usuarioClass, idEmpresa: number) {

    this.webSocket = new WebSocket(conexion);
    this.webSocket.onopen = () => {
      console.log("Se abre el socker");
    }
    this.webSocket.onclose = () => {
      console.log("Se cierra la comunicación");
      //this.conectar(conexion);
    }
    this.webSocket.onmessage = (mensaje) => {
      this.notificacionNormal(usuario, idEmpresa, mensaje);
      this.scrnotificacion.next(mensaje);
    }

  }

  public conectarEspecifico(conexion: string, usuario: usuarioClass, idEmpresa: number,generico:boolean = false) {
    this.conectarEspecificoBool = true;
    this.webSocketEspecifico = new WebSocket(conexion);
    this.webSocketEspecifico.onopen = () => {
      console.log("Se abre el socker especifica SAMV");
    }
    this.webSocketEspecifico.onclose = () => {
      console.log("Se cierra la comunicación  especifico");
      // this.conectarEspecifico(conexion);
    }


    this.webSocketEspecifico.onmessage = (mensaje: any) => {
      this.notificacionEspecifica(usuario, idEmpresa, mensaje);
    }

  }





  public enviarMensaje(mensaje: string) {
    this.webSocket.send(mensaje);
  }
  public enviarMensajeEspecifico(mensaje: string) {
    this.webSocketEspecifico.send(mensaje);
  }

  public close() {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }

  public closeEspecifico() {
    if (this.webSocketEspecifico) {
      this.webSocketEspecifico.close();
    }
  }


  public verificarMensajes(usuario: number): Observable<any> {
    return this.http.get(`${direcciones.chat}/empleado/mensajes/${usuario}`);
  }


  public modificar(obj: any): Observable<any> {
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.chat}/modificar`, json);
  }


  public notificacionEspecifica(usuario: usuarioClass, idEmpresa: number, datos: any) {

    if (datos.data != "CONNECT" && datos.data != "CLOSE") {

      if (datos.data.includes(`ACCEPTMESSAGEFROM${usuario.usuarioId}`)) {

        if (!usuario.esRecursosHumanos) {
          this.mensajes.push({ mensaje: "El usuario RRH ha finalizado el chat...", fecha: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd"), usuarioId: -1, nombre: usuario.nombre });
          this.nombreEmpleado = "Recursos humanos";
          this.close();
          this.closeEspecifico();
          let rutaSocket: string = `${environment.rutaSocket}/notificaciones/${idEmpresa}/usuario/${usuario.usuarioId}`;
          this.conectar(rutaSocket, usuario, idEmpresa);
          this.conectarEspecificoBool = false;
        }

      }


      this.mensajes = (JSON.parse(datos.data));
      this.notificacionesglobito += 1;
    }
  }


  public notificacionNormal(usuario: usuarioClass, idEmpresa: number, datos: any) {
    if (datos.data != "CONNECT" && datos.data != "CLOSE") {


      if (datos.data.includes(`ACCEPTMESSAGEFROM${usuario.usuarioId}`)) {

        if (!usuario.esRecursosHumanos) {
          this.mensajes.push({ mensaje: "El usuario RRH ha aceptado su mensaje...", fecha: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd"), usuarioId: -1, nombre: usuario.nombre });
          const rutaSocket: string = `${environment.rutaSocket}/notificaciones/${idEmpresa}${usuario.usuarioId}/usuario/${usuario.usuarioId}`;
          this.verificarMensajes(usuario.usuarioId).subscribe(vv => {
            this.nombreEmpleado = vv.datos.nombreRrh;
          });
          this.notificacionesglobito += 1;
          this.conectarEspecifico(rutaSocket, usuario, idEmpresa,datos.data.includes("ACCEPTMESSAGEFROMGENERIC"));
        }

      }else {
        if (usuario.esRecursosHumanos) {
          this.notificacionesMenu += 1;
        }
      }
    }
  }

  public terminar(conversacionid: number): Observable<any> {
    return this.http.delete(`${direcciones.chat}/terminar/${conversacionid}`);
  }


  public recibirNotificacion():Observable<any>{
      return this.scrnotificacion;
  }
}
