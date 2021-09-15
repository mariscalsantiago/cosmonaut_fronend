import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private webSocket!:WebSocket;
  private webSocketEspecifico!:WebSocket;
  public socketGeneral!:string;
  public socketEspecifico!:string;
  public mensajes:any;

  constructor() { }


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
}
