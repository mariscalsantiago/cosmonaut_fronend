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
    socket:""
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

        let body;
        let mensajedefecto:boolean = true;
        try{
          body = JSON.parse(datos.data);
          mensajedefecto = false;
        }catch{
          mensajedefecto = true;
          body = datos.data;

        }

        if(!mensajedefecto){

          if((Number(body.idUsuario) !== this.usuarioSistemaPrd.getUsuario().usuarioId)){
             
            let objEnviado = {
              enviado:false,
              mensaje: body.mensaje,
              fecha:new Date()
            };

            this.arreglomensajes = this.chatPrd.getMensajes();
            this.arreglomensajes.push(objEnviado);
    
            this.chatPrd.setMensajes(this.arreglomensajes);
            this.acomodandoVentanaChat();


            this.chatPrd.datos.datos.numeromensajes += 1;
            this.chatPrd.datos.datos.mensajeRecibido = true;

            if(!this.usuarioSistemaPrd.usuario.esRecursosHumanos){
                this.chatPrd.setNombreRecursosHumanos("Lo atiende "+body.nombre);
            }
          }

        }else{
         
          let objEnviado = {
            enviado:false,
            mensaje: body,
            fecha:new Date()
          };

          this.arreglomensajes = this.chatPrd.getMensajes();
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


    let body = {
      mensaje:this.mensaje,
      idUsuario:this.usuarioSistemaPrd.getUsuario().usuarioId,
      nombre:`${this.usuarioSistemaPrd.getUsuario().nombre} ${this.usuarioSistemaPrd.getUsuario().apellidoPat}`,
      fecha:new Date()
    }
    
    this.chatPrd.enviarMensaje(JSON.stringify(body));
    this.mensaje = "";

    

    this.acomodandoVentanaChat();
  }

  public acomodandoVentanaChat(){

    this.ventana.nativeElement.scroll({top:6000,behavior:'smooth'});


    
  }

}
