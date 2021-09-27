import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit,OnDestroy, EventEmitter, Output, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { NotificacionesService } from '../services/chat/notificaciones.service';
import { ConfiguracionesService } from '../services/configuraciones/configuraciones.service';
import { UsuarioSistemaService } from '../services/usuariosistema/usuario-sistema.service';


@Component({
  selector: 'app-chatboot',
  templateUrl: './chatboot.component.html',
  styleUrls: ['./chatboot.component.scss']
})
export class ChatbootComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild("ventanaprincipal") ventana!: ElementRef;
  public scrolly: string = '250px';
  public tamanio: number = 0;
  public modalWidth: string = "350px";



  public fecha: Date = new Date();

  public mensaje: string = "";

  public usuarioId: number = 0;


  @Input()
  public datos = {
    nombre: "",
    socket: ""
  }


  @Output() salida = new EventEmitter();

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;

    if (this.tamanio < 600) {

      this.modalWidth = "60%";

    } else {
      this.modalWidth = "350px";

    }
  }

  constructor(public notificacionesPrd:NotificacionesService,private usuarioSistemaPrd:UsuarioSistemaService,
    private configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    this.notificacionesPrd.notificacionesglobito = 0;
    this.notificacionesPrd.nombreEmpleado = this.notificacionesPrd.nombreEmpleado || "Recursos humanos";
    this.usuarioId = this.usuarioSistemaPrd.getUsuario().usuarioId;    

  }



  public procesandoMensajesRecibidos(datos: any) {

   
  }





  ngAfterViewInit() {
    this.acomodandoVentanaChat();
  }


  public salir() {
    this.salida.emit({ type: "exit" });
  }

  public enviarMensaje() {

    if(!Boolean(`${this.mensaje}`.trim())){
      return;
    }

    if(Boolean(this.notificacionesPrd.mensajes)){

      if(this.notificacionesPrd.mensajes.some((o:any)=>o.mensaje.includes("El usuario RRH ha finalizado el chat"))){
          this.notificacionesPrd.mensajes = [];
      }

    }

      let mensaje = {mensaje:this.mensaje,fecha:new DatePipe("es-MX").transform(new Date(),"yyyy-MM-dd hh:mm"),usuarioId:this.usuarioId,nombre:this.usuarioSistemaPrd.getUsuario().nombre};
      this.notificacionesPrd.mensajes.push(mensaje);
      let json = JSON.stringify(this.notificacionesPrd.mensajes);
      if(this.usuarioSistemaPrd.usuario.esRecursosHumanos){
        this.notificacionesPrd.enviarMensajeEspecifico(json);
        setTimeout(() => {
          this.notificacionesPrd.scrnotificacion.next(true);  
        }, 100);
      }else{
        if(this.notificacionesPrd.conectarEspecificoBool){
          this.notificacionesPrd.enviarMensaje("READONLY");
          this.notificacionesPrd.enviarMensajeEspecifico(json);
        }else{
          this.notificacionesPrd.enviarMensaje(json);
        }
      }
      this.mensaje = "";
  }

  public acomodandoVentanaChat() {
    this.ventana.nativeElement.scroll({ top: 6000, behavior: 'smooth' });
  }


  public enviarTeclado(evento: any) {
    if (evento.key == "Enter") {
      this.enviarMensaje();
    }
  }

 public ngOnDestroy(){
   this.notificacionesPrd.notificacionesglobito = 0;
 }

}
