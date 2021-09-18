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

  private webSocket!:WebSocket;
  private webSocketEspecifico!:WebSocket;
  public socketGeneral!:string;
  public socketEspecifico!:string;
  public mensajes:any = [];
  public nombreEmpleado:string = "";


  public notificacionesglobito:number = 0;
  public notificacionesMenu:number = 0;

  constructor(private http:HttpClient) { }


  public conectar(conexion:string){
      this.webSocket = new WebSocket(conexion);
      this.webSocket.onopen = ()=>{
        console.log("Se abre el socker");
      }
      this.webSocket.onclose = ()=>{
        console.log("Se cierra la comunicación");
      }
      
  }

  public conectarEspecifico(conexion:string){
    this.webSocketEspecifico = new WebSocket(conexion);
    this.webSocketEspecifico.onopen = ()=>{
      console.log("Se abre el socker");
    }
    this.webSocketEspecifico.onclose = ()=>{
      console.log("Se cierra la comunicación");
    }
    
}


  public recibirNotificacion():Observable<any>{
      let subject = new Subject();
      this.webSocket.onmessage = (mensaje)=>{
        subject.next(mensaje);
      }


      return subject;
  }

  public recibirNotificacionEspecifico():Observable<any>{
    let subject = new Subject();
    this.webSocketEspecifico.onmessage = (mensaje)=>{
      subject.next(mensaje);
    }


    return subject;
}


  public enviarMensaje(mensaje:string){
    this.webSocket.send(mensaje);
  }
  public enviarMensajeEspecifico(mensaje:string){
    this.webSocketEspecifico.send(mensaje);
  }

  public close(){
    if(this.webSocket){
      this.webSocket.close();
    }
  }

  public closeEspecifico(){
    if(this.webSocketEspecifico){
      this.webSocketEspecifico.close();
    }
  }


  public verificarMensajes(usuario:number):Observable<any>{
      return this.http.get(`${direcciones.chat}/empleado/mensajes/${usuario}`);
  }


  public modificar(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.chat}/modificar`,json);
  }


 public notificacionEspecifica(){
  this.recibirNotificacionEspecifico().subscribe(datos =>{
    if (datos.data != "CONNECT" && datos.data != "CLOSE") {
      this.mensajes = (JSON.parse(datos.data));
      this.notificacionesglobito += 1;
    }

  });
 }


  public notificacionNormal(usuario:usuarioClass,idEmpresa:number){
    this.recibirNotificacion().subscribe(datos =>{
      
      if(datos.data.includes(`ACCEPTMESSAGEFROM${usuario.usuarioId}`)){

           this.mensajes.push({mensaje:"El usuario RRH ha aceptado su mensaje...",fecha:new DatePipe("es-MX").transform(new Date(),"yyyy-MM-dd"),usuarioId:-1,nombre:usuario.nombre});
           const rutaSocket:string = `${environment.rutaSocket}/notificaciones/${idEmpresa}${usuario.usuarioId}/usuario/${usuario.usuarioId}`;
           this.verificarMensajes(usuario.usuarioId).subscribe(vv =>{
             this.nombreEmpleado = vv.datos.nombreRrh;
           });
           this.close();
           this.conectar(rutaSocket);
           this.notificacionesglobito += 1;
           this.recibirNotificacion().subscribe(datos =>{
             this.mensajes = JSON.parse(datos.data);
             this.notificacionesglobito += 1;
             console.log("DEPSUES DEL CANAL PRINCIPAL");
             
           })
      }else{
        if (datos.data != "CONNECT" && datos.data != "CLOSE") {
          if(!usuario.esRecursosHumanos){
            this.mensajes = JSON.parse(datos.data);
            this.notificacionesglobito += 1;
            console.log("En el canal principal");
          }else{
            this.notificacionesMenu += 1;
          }
        }
      }
    });
  }
}
