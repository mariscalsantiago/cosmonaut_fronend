import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {

  private socket!:WebSocket;

  public datos = {
    ocultar: true,
    datos: {
      nombre: "Mariscal",
      socket:"",
      rrh:false
    }
  }


  constructor(private http:HttpClient) { }

  public conectarSocket(cadenaSocket:string){
    this.socket = new WebSocket(`${direcciones.socket}${cadenaSocket}`);
  }

  public enviarMensaje(mensaje:string){
    
      this.socket.send(mensaje);
  }

  public recibiendoMensajeServer():Subject<any>{

    let subject:Subject<any> = new Subject();
    this.socket.onmessage = (recibir)=>{
          subject.next(recibir);
    }
    
    return subject;
  }


  public modificarMensaje(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.chat}/modificar`,json);
  }




  public setChatDatos(obj:any){
      this.datos = obj;
  }


  public getChatDatos(){
    return this.datos;
  }


  public guardarMensajeGenerico(obj:any):Observable<any>{
      let json = JSON.stringify(obj);
      return this.http.put(`${direcciones.administrarMensajeChat}/guardar`,json);
  }

  public getMensajeGenericoByEmpresa(idEmpresa:number):Observable<any>{
      return this.http.get(`${direcciones.administrarMensajeChat}/lista/empresa/${idEmpresa}`);
  }


  public enviarMensajeGenerico(mensaje:string,canal:string){
    let socketInterno:WebSocket = new WebSocket(direcciones.socket+canal);
    socketInterno.onopen = ()=>{
      socketInterno.send(mensaje);
    }
  
  }

  


}
