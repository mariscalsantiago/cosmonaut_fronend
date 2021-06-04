import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {

  private socket!:WebSocket;

  public datos:any = {
    nombre:""
  }


  constructor() { }

  public conectarSocket(idEmpresa:number,idusuario:number){
    this.socket = new WebSocket(`${direcciones.socket}/chat/${idEmpresa}/${idusuario}`);
  }

  public enviarMensaje(mensaje:string){
    console.log(mensaje,"senvia");
      this.socket.send(mensaje);
  }

  public recibiendoMensajeServer():Subject<any>{

    let subject:Subject<any> = new Subject();
    this.socket.onmessage = (recibir)=>{
          subject.next(recibir);
    }
    
    return subject;
  }




  public setChatDatos(obj:any){
      this.datos = obj;
  }


  public getChatDatos(){
    return this.datos;
  }


  


}
