import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ChatSocketService {

  private socket!:WebSocket;

  public esConectado:boolean = false;

  public datos = {
    ocultar: true,
    datos: {
      nombre: "Recursos humanos",
      socket:"",
      numeromensajes:0,
      mensajeRecibido:false
    },
    body:{
      mensaje:"",
      idUsuario:0,
      nombre:"",
      fecha:""
    }
  }


  public mensajes:any = [];

  private nombreRecursos:string = "Recursos humaos";


  constructor(private http:HttpClient) { }

  public conectarSocket(cadenaSocket:string){
    this.socket = new WebSocket(`${direcciones.socket}${cadenaSocket}`);
    this.esConectado = true;


    this.socket.onclose = ()=>{
      console.log("Se cerro en automatico",this.esConectado);
      this.esConectado = false;
    }
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


  public reiniciarChat(mensaje:any){
      this.esConectado = false;
      this.mensajes = [mensaje];
  }


  public getMensajes(){
    return this.mensajes;
  }

  public setMensajes(mensajes:any){
      this.mensajes = mensajes;
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


  public isConnect(){
    return this.esConectado;
  }

  public disconnect(){
    this.mensajes = [];
      this.esConectado = false;  
  }


  public guardarMensajeGenerico(obj:any):Observable<any>{
      let json = JSON.stringify(obj);
      return this.http.put(`${direcciones.administrarMensajeChat}/guardar`,json);
  }

  public modificarMensajeGenerico(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.administrarMensajeChat}/modificar`,json);
}

  public getMensajeGenericoByEmpresa(idEmpresa:number):Observable<any>{
      return this.http.get(`${direcciones.administrarMensajeChat}/lista/empresa/${idEmpresa}`);
  }
  public getMensajeGenericoByEmpresaByEmpleado(idEmpresa:number,idUsuario:number):Observable<any>{
    return this.http.get(`${direcciones.administrarMensajeChat}/lista/empresa/usuario/${idEmpresa}/${idUsuario}`);
}


  public enviarMensajeGenerico(mensaje:string,canal:string){
    let socketInterno:WebSocket = new WebSocket(direcciones.socket+canal);
    socketInterno.onopen = ()=>{
      socketInterno.send(mensaje);
    }
  
  }


  public getNombreRecursosHumanos(){
      return this.nombreRecursos;
  }

  public setNombreRecursosHumanos(nombre:string){
      this.nombreRecursos = nombre;
  }

  


}



