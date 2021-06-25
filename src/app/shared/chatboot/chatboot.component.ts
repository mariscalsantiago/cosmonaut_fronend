import { Component, HostListener, OnInit,EventEmitter, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { ChatService } from 'src/app/modules/chat/services/chat.service';
import { ChatSocketService } from '../services/chat/ChatSocket.service';
import { UsuarioSistemaService } from '../services/usuariosistema/usuario-sistema.service';


@Component({
  selector: 'app-chatboot',
  templateUrl: './chatboot.component.html',
  styleUrls: ['./chatboot.component.scss']
})
export class ChatbootComponent implements OnInit {
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
    this.chatPrd.conectarSocket(this.chatPrd.getChatDatos().datos.socket);
    this.chatPrd.recibiendoMensajeServer().subscribe(datos =>{
      
      let objEnviado = {
        enviado:false,
        mensaje:datos.data,
        fecha:new Date()
      };

      this.arreglomensajes.push(objEnviado);
      this.acomodandoVentanaChat();
    });
    
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
    this.chatPrd.enviarMensaje(this.mensaje);
    this.mensaje = "";

    

    this.acomodandoVentanaChat();
  }

  public acomodandoVentanaChat(){

    this.ventana.nativeElement.scroll({top:6000,behavior:'smooth'});
  }

}
