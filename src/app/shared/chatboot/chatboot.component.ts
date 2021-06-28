import { Component, HostListener, OnInit,EventEmitter, Output, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import { ChatSocketService } from '../services/chat/ChatSocket.service';
import { UsuarioSistemaService } from '../services/usuariosistema/usuario-sistema.service';


@Component({
  selector: 'app-chatboot',
  templateUrl: './chatboot.component.html',
  styleUrls: ['./chatboot.component.scss']
})
export class ChatbootComponent implements OnInit,AfterViewInit {
  @ViewChild("ventanaprincipal") ventana!:ElementRef;
  public scrolly: string = '250px';
  public tamanio: number = 0;
  public modalWidth: string = "350px";

  public arreglomensajes:any = [];


  public fecha:Date = new Date();

  public mensaje:string = "";


 @Input() 
  public datos={
    nombre: "",
    socket:"",
    rrh:false
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

  constructor(private chatPrd:ChatSocketService,private usuarioSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {
    this.datos.nombre = this.datos.nombre.replace('undefined', '');
    let documento: any = document.defaultView;
    this.tamanio = documento.innerWidth;


    
    this.arreglomensajes = this.chatPrd.getMensajes();

    

    if(!this.chatPrd.isConnect()){
      this.chatPrd.conectarSocket(this.chatPrd.getChatDatos().datos.socket);
      this.chatPrd.recibiendoMensajeServer().subscribe(datos =>{        

        let mensajeCompuesto = datos.data.split('|')

        if((mensajeCompuesto[0] !== this.usuarioSistemaPrd.getUsuario().usuarioId.toString())){
          let objEnviado = {
            enviado:false,
            mensaje: mensajeCompuesto[1] || mensajeCompuesto[0],
            fecha:new Date()
          };
  

          if(this.chatPrd.getChatDatos().datos.rrh && !Boolean(mensajeCompuesto[1])) return;
  
  
  
          this.chatPrd.getChatDatos().datos.mensajeRecibido = Boolean(mensajeCompuesto[1]);
          this.chatPrd.getChatDatos().datos.numeromensajes += Boolean(mensajeCompuesto[1])?1:0;
    
          this.arreglomensajes.push(objEnviado);
  
          this.chatPrd.setMensajes(this.arreglomensajes);
          this.acomodandoVentanaChat();
        }
      });
    }
    
  }





  ngAfterViewInit(){
    this.acomodandoVentanaChat();  
  }


  public salir(){
    this.salida.emit({type:"exit"});
  }

  public enviarMensaje(){
    let objEnviado = {
      enviado:true,
      mensaje:this.mensaje,
      fecha:new Date()
    };

    this.arreglomensajes.push(objEnviado);
    this.mensaje = `${this.usuarioSistemaPrd.usuario.usuarioId}|${this.mensaje}`;
    this.chatPrd.enviarMensaje(this.mensaje);
    this.mensaje = "";

    

    this.acomodandoVentanaChat();
  }

  public acomodandoVentanaChat(){

    this.ventana.nativeElement.scroll({top:6000,behavior:'smooth'});


    
  }

}
