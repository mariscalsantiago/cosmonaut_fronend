import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { tabla } from 'src/app/core/data/tabla';
import { ChatSocketService } from 'src/app/shared/services/chat/ChatSocket.service';
import { NotificacionesService } from 'src/app/shared/services/chat/notificaciones.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { environment } from 'src/environments/environment';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-listachats-activos',
  templateUrl: './listachats-activos.component.html',
  styleUrls: ['./listachats-activos.component.scss']
})
export class ListachatsActivosComponent implements OnInit {

  public arreglotabla: any = {
    columnas: [],
    filas: []
  }



  



  public mensajes:any = [];
  public suscripcion!:Subscription;

  public cargando: boolean = false;
  constructor(private ventanaPrd: VentanaemergenteService, private chatPrd: ChatService,
    private usuariossistemaPrd: UsuarioSistemaService, private socket: ChatSocketService,
    private modalPrd:ModalService,public configuracionPrd:ConfiguracionesService,
    private notificacionesPrd:NotificacionesService) { }

  ngOnInit(): void {
    this.notificacionesPrd.notificacionesMenu = 0;
    this.cargando = true;
    
  
    this.obtieneListaChat();

    this.socket.getMensajeGenericoByEmpresaByEmpleado(this.usuariossistemaPrd.getIdEmpresa(),this.usuariossistemaPrd.usuario.usuarioId).subscribe(datos => {
      this.mensajes = datos.datos
    });


    this.notificacionesPrd.recibirNotificacion().subscribe(valor =>{
      if (valor.data != "CONNECT" && valor.data != "CLOSE") {
          this.obtieneListaChat();
      }
    });




   this.suscripcion =  this.chatPrd.getListaChatActivos(this.usuariossistemaPrd.getIdEmpresa(),this.usuariossistemaPrd.usuario.usuarioId).subscribe(datos =>{
      if(Boolean(datos.datos)){
        this.construirTabla(datos.datos);
      }else{
        this.arreglotabla = {
          filas:undefined
        }
      }


      
      this.cargando = false;  
    });

  }

  public obtieneListaChat(){
    
    this.chatPrd.getListaChat(this.usuariossistemaPrd.getIdEmpresa(),this.usuariossistemaPrd.usuario.usuarioId).subscribe(datos => {
      if(Boolean(datos.datos)){
        this.construirTabla(datos.datos);
      }else{
        this.arreglotabla = {
          filas:undefined
        }
      }


      
      this.cargando = false;
    });  
  }


 


  public construirTabla(obj: any) {

    

    let columnas: Array<tabla> = [
      new tabla("nombreempleado", "Empleado"),
      new tabla("mensajeultimo", "Mensaje"),
      new tabla("fecha", "Fecha", false, false, true)   
    ]

    if (obj) {
      for (let item of obj) {
        let arreglomensajes = item.mensajes;
        arreglomensajes = JSON.parse(arreglomensajes);
        item["nombreempleado"] = item.usuarioId?.nombre + " " + item.usuarioId.apellidoPat + " ";
        item["nombreempleado"] += item.personaId?.apellidoMat ? "" : item.usuarioId?.apellidoMat || ""
        item["mensajeultimo"]=arreglomensajes[arreglomensajes.length-1]?.mensaje;
        var datePipe = new DatePipe("es-MX");
        item["fecha"] = (new Date(item.fechaUltimoMensaje).toUTCString()).replace(" 00:00:00 GMT", "");
        item["fecha"] = datePipe.transform(item["fecha"], 'dd-MMM-y')?.replace(".", "");

      }
    }


    this.arreglotabla = {
      columnas: columnas,
      filas: obj
    };

    
  }


  public recibirTabla(obj: any) {


    
    switch (obj.type) {
      case "responder":
         this.responderEmpleado(obj.datos);
        break;
      case "default":
        
      
        this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas enviar el mensaje generico?").then(valor =>{
          if(valor){
            
              if(this.mensajes == undefined){
                  this.modalPrd.showMessageDialog(this.modalPrd.error,"No hay mensajes genericos que enviar");
              }else{
                  this.responderMensajeGenerico(obj.datos);
              }
          }
        });
        break;
    }
  }

  public editarMensaje() {

    this.ventanaPrd.showVentana(this.ventanaPrd.mensajechat,{datos:this.mensajes || []})
          .then(datos =>{
             this.mensajes = [datos.datos]
          });

  }

  public responderEmpleado(valorConversacion:any){
    
    if(!valorConversacion.atendido){
    valorConversacion.nombreRrh = `${this.usuariossistemaPrd.usuario.nombre} ${this.usuariossistemaPrd.usuario.apellidoPat}`;
    valorConversacion.atendido = true;
    valorConversacion.idUsuarioRrh = this.usuariossistemaPrd.usuario.usuarioId;
      this.notificacionesPrd.modificar(valorConversacion).subscribe(valor =>{
        if(valor.resultado){
            this.atiendeChat(valorConversacion);
        }
      }); 
    }else{
      this.atiendeChat(valorConversacion);
    }
  }

  public atiendeChat(valorConversacion:any){
    const mensaje = `ACCEPTMESSAGEFROM${valorConversacion.usuarioId.usuarioId}`;
    this.notificacionesPrd.enviarMensaje(mensaje);
    this.notificacionesPrd.mensajes = JSON.parse(valorConversacion.mensajes);
    this.notificacionesPrd.nombreEmpleado = valorConversacion.nombreempleado;
    
    this.notificacionesPrd.closeEspecifico();
    this.notificacionesPrd.conectarEspecifico(`${environment.rutaSocket}${valorConversacion.conversacionId}`);
    this.notificacionesPrd.notificacionEspecifica();
    this.socket.datos.ocultar = false;  
    this.configuracionPrd.ocultarChat = false;
  }



  public ngOnDestroy(){
    if(this.suscripcion){
        this.suscripcion.unsubscribe();
    }
  }

  public responderMensajeGenerico(valorConversacion:any){
    if(!valorConversacion.atendido){
      valorConversacion.nombreRrh = `${this.usuariossistemaPrd.usuario.nombre} ${this.usuariossistemaPrd.usuario.apellidoPat}`;
      valorConversacion.atendido = true;
      valorConversacion.idUsuarioRrh = this.usuariossistemaPrd.usuario.usuarioId;
        this.notificacionesPrd.modificar(valorConversacion).subscribe(valor =>{
          if(valor.resultado){
              this.atiendeChat(valorConversacion);
          }
        }); 
      }else{
        this.atiendeChat(valorConversacion);
      }
  }

}
