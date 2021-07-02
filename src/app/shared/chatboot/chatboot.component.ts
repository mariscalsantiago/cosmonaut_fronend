import { Component, HostListener, OnInit, EventEmitter, Output, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import { ChatSocketService } from '../services/chat/ChatSocket.service';
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

  public arreglomensajes: any = [];


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

  constructor(private chatPrd: ChatSocketService, private usuarioSistemaPrd: UsuarioSistemaService) { }

  ngOnInit(): void {

    this.usuarioId = this.usuarioSistemaPrd.getUsuario().usuarioId;


    this.datos.nombre = this.datos.nombre.replace('undefined', '');
    let documento: any = document.defaultView;
    this.tamanio = documento.innerWidth;



    this.arreglomensajes = this.chatPrd.getMensajes();



    if (!this.chatPrd.isConnect()) {

      this.chatPrd.conectarSocket(this.chatPrd.getChatDatos().datos.socket);
      this.chatPrd.recibiendoMensajeServer().subscribe(datos => {
        this.procesandoMensajesRecibidos(datos);

      });
    } else {
      if (!this.chatPrd.yaRecibeMensajes) {
        this.chatPrd.recibiendoMensajeServer(true).subscribe(datos => {

          this.procesandoMensajesRecibidos(datos);
        });
      }
    }

  }



  public procesandoMensajesRecibidos(datos: any) {

    let body;
    let mensajedefecto: boolean = true;
    try {
      let aux = JSON.parse(datos.data);
      let ultimoMensaje = aux[aux.length - 1];
      body = ultimoMensaje;
      mensajedefecto = false;
    } catch {
      mensajedefecto = true;
      body = datos.data;
      if (this.arreglomensajes.some((valor: any) => valor.mensaje.includes("Bienvenid@")) || this.usuarioSistemaPrd.getUsuario().esRecursosHumanos) {
        return;
      }

    }

    if (!mensajedefecto) {




      if ((Number(body.usuarioId) !== this.usuarioSistemaPrd.getUsuario().usuarioId)) {
        this.arreglomensajes.push(body);

        this.chatPrd.setMensajes(this.arreglomensajes);
        this.acomodandoVentanaChat();


        if (!this.usuarioSistemaPrd.getUsuario().esRecursosHumanos) {
          this.chatPrd.datos.datos.numeromensajes += 1;
          this.chatPrd.datos.datos.mensajeRecibido = true;
        }

        if (!this.usuarioSistemaPrd.usuario.esRecursosHumanos) {
          this.chatPrd.setNombreRecursosHumanos("Lo atiende " + body.nombre);
        }
      }

    } else {

      let objEnviado = {
        mensaje: body,
        fecha: new Date(),
        idUsuario: this.usuarioSistemaPrd.getUsuario().usuarioId
      };

      this.arreglomensajes = this.chatPrd.getMensajes();
      this.arreglomensajes.push(objEnviado);

      this.chatPrd.setMensajes(this.arreglomensajes);
      this.acomodandoVentanaChat();
    }
  }





  ngAfterViewInit() {
    this.acomodandoVentanaChat();
  }


  public salir() {
    this.salida.emit({ type: "exit" });
  }

  public enviarMensaje() {

    let objEnviado = {
      mensaje: this.mensaje,
      fecha: new Date(),
      usuarioId: this.usuarioSistemaPrd.getUsuario().usuarioId,
      nombre: `${this.usuarioSistemaPrd.getUsuario().nombre} ${this.usuarioSistemaPrd.getUsuario().apellidoPat}`
    };

    console.log("Usuario enviado", objEnviado);

    this.arreglomensajes.push(objEnviado);
    let body = JSON.stringify(this.arreglomensajes.slice(1));

    this.chatPrd.enviarMensaje(body);
    this.mensaje = "";



    this.acomodandoVentanaChat();
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
