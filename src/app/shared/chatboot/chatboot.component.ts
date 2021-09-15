import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit, EventEmitter, Output, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NotificacionesService } from '../services/chat/notificaciones.service';
import { UsuarioSistemaService } from '../services/usuariosistema/usuario-sistema.service';


@Component({
  selector: 'app-chatboot',
  templateUrl: './chatboot.component.html',
  styleUrls: ['./chatboot.component.scss']
})
export class ChatbootComponent implements OnInit, AfterViewInit {
  @ViewChild("ventanaprincipal") ventana!: ElementRef;
  public scrolly: string = '250px';
  public tamanio: number = 0;
  public modalWidth: string = "350px";

  public arreglomensajes:any = [];


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

  constructor(private notificacionesPrd:NotificacionesService,private usuarioSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {
    this.arreglomensajes = this.notificacionesPrd.mensajes || [];
    this.usuarioId = this.usuarioSistemaPrd.getUsuario().usuarioId;
    if(this.usuarioSistemaPrd.getUsuario().esRecursosHumanos){
      this.notificacionesPrd.recibirNotificacionEspecifico().subscribe(datos =>{
        if (datos.data != "CONNECT" && datos.data != "CLOSE") {
          this.arreglomensajes = (JSON.parse(datos.data));
          console.log("Esto son los datos de la notificacion",(JSON.parse(datos.data)));
        }
    
      });
    }else{
      this.notificacionesPrd.recibirNotificacion().subscribe(datos =>{
        if(datos.data.includes(`ACCEPTMESSAGEFROM${this.usuarioSistemaPrd.getUsuario().usuarioId}`)){
             this.arreglomensajes.push({mensaje:"El usuario RRH ha aceptado su mensaje...",fecha:new DatePipe("es-MX").transform(new Date(),"yyyy-MM-dd"),usuarioId:-1,nombre:this.usuarioSistemaPrd.getUsuario().nombre});
             const rutaSocket:string = `${environment.rutaSocket}/notificaciones/${this.usuarioSistemaPrd.getIdEmpresa()}${this.usuarioSistemaPrd.getUsuario().usuarioId}/usuario/${this.usuarioSistemaPrd.getUsuario().usuarioId}`;
             this.notificacionesPrd.close();
             this.notificacionesPrd.conectar(rutaSocket);
             this.notificacionesPrd.recibirNotificacion().subscribe(datos =>{
               this.arreglomensajes = JSON.parse(datos.data);
             })
        }
      });
    }
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
      let mensaje = {mensaje:this.mensaje,fecha:new DatePipe("es-MX").transform(new Date(),"yyyy-MM-dd"),usuarioId:this.usuarioId,nombre:this.usuarioSistemaPrd.getUsuario().nombre};
      this.arreglomensajes.push(mensaje);
      let json = JSON.stringify(this.arreglomensajes);
      if(this.usuarioSistemaPrd.usuario.esRecursosHumanos){
        this.notificacionesPrd.enviarMensajeEspecifico(json);
      }else{
        this.notificacionesPrd.enviarMensaje(json);
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

}
