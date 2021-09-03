import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  private webSocket!:WebSocket;

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


  public recibirNotificacion():Observable<any>{
      let subject = new Subject();
      this.webSocket.onmessage = (mensaje)=>{
        subject.next(mensaje);
      }


      return subject;
  }

  public close(){
    if(this.webSocket){
      this.webSocket.close();
    }
  }
}
