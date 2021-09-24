import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
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


  public notificacionesglobito: number = 0;
  public notificacionesMenu: number = 0;
  public subject: Subject<any> = new Subject();
  public subjectEspecifico: Subject<any> = new Subject();



  constructor(private http: HttpClient) {

    console.log("INICA EL CONSTRUCTOR NOTIFICACIONES");
  }


  public conectar(conexion: string) {

    this.webSocket = new WebSocket(conexion);
    this.webSocket.onopen = () => {
      console.log("Se abre el socker");
    }
    this.webSocket.onclose = () => {
      console.log("Se cierra la comunicación");
      this.conectar(conexion);
    }
    this.webSocket.onmessage = (mensaje) => {
      this.subject.next(mensaje);
    }

  }

  public conectarEspecifico(conexion: string) {
    this.webSocketEspecifico = new WebSocket(conexion);
    this.webSocketEspecifico.onopen = () => {
      console.log("Se abre el socker");
    }
    this.webSocketEspecifico.onclose = () => {
      console.log("Se cierra la comunicación  especifico");
      this.conectarEspecifico(conexion);
    }



    this.webSocketEspecifico.onmessage = (mensaje) => {
      this.subjectEspecifico.next(mensaje);
    }

  }


  public recibirNotificacion(): Observable<any> {
    return this.subject;
  }

  public recibirNotificacionEspecifico(): Observable<any> {
    return this.subjectEspecifico;
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


  public notificacionEspecifica(usuario:usuarioClass) {
    this.recibirNotificacionEspecifico().subscribe(datos => {
      if (datos.data != "CONNECT" && datos.data != "CLOSE") {
        
        if (datos.data.includes(`ACCEPTMESSAGEFROM${usuario.usuarioId}`)) {

          if(!usuario.esRecursosHumanos){
            this.mensajes.push({ mensaje: "El usuario RRH ha finalizado el chat...", fecha: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd"), usuarioId: -1, nombre: usuario.nombre });
          }

        }


        this.mensajes = (JSON.parse(datos.data));
        this.notificacionesglobito += 1;
      }

    });
  }


  public notificacionNormal(usuario: usuarioClass, idEmpresa: number) {
    this.recibirNotificacion().subscribe(datos => {
      if (datos.data != "CONNECT" && datos.data != "CLOSE") {

        console.log("NOTIFICACION NORMAL");

        if (datos.data.includes(`ACCEPTMESSAGEFROM${usuario.usuarioId}`)) {

          if (!usuario.esRecursosHumanos) {
            this.mensajes.push({ mensaje: "El usuario RRH ha aceptado su mensaje...", fecha: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd"), usuarioId: -1, nombre: usuario.nombre });
            const rutaSocket: string = `${environment.rutaSocket}/notificaciones/${idEmpresa}${usuario.usuarioId}/usuario/${usuario.usuarioId}`;
            this.verificarMensajes(usuario.usuarioId).subscribe(vv => {
              this.nombreEmpleado = vv.datos.nombreRrh;
            });
            this.notificacionesglobito += 1;
            this.conectarEspecifico(rutaSocket);
            this.notificacionEspecifica(usuario);
          }

        } else {
          if (usuario.esRecursosHumanos) {
            this.notificacionesMenu += 1;
          }
        }
      }

    });
  }

  public terminar(conversacionid: number): Observable<any> {
    return this.http.delete(`${direcciones.chat}/terminar/${conversacionid}`);
  }
}
