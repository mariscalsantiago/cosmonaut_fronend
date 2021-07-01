import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { tabla } from 'src/app/core/data/tabla';
import { ChatSocketService } from 'src/app/shared/services/chat/ChatSocket.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-listachats-activos',
  templateUrl: './listachats-activos.component.html',
  styleUrls: ['./listachats-activos.component.scss']
})
export class ListachatsActivosComponent implements OnInit,OnDestroy {

  public arreglotabla: any = {
    columnas: [],
    filas: []
  }


  public suscripcion!:Subscription;


  public cantidad:number = 0;



  public mensajes:any = [];

  public cargando: boolean = false;
  constructor(private ventanaPrd: VentanaemergenteService, private chatPrd: ChatService,
    private usuariossistemaPrd: UsuarioSistemaService, private socket: ChatSocketService,
    private modalPrd:ModalService,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {

    this.configuracionPrd.notificaciones = 0;


    this.cargando = true;
    this.suscripcion = this.chatPrd.getListaChatActivos(this.usuariossistemaPrd.getIdEmpresa()).subscribe(datos => {
      console.log("No hay bronca de los datos");
      if(datos.datos !== undefined){
        if(this.cantidad !== datos.datos.length){
          this.cantidad = datos.datos.length;
          this.construirTabla(datos.datos);
        }
      }
      
    });

    this.socket.getMensajeGenericoByEmpresaByEmpleado(this.usuariossistemaPrd.getIdEmpresa(),this.usuariossistemaPrd.usuario.usuarioId).subscribe(datos => this.mensajes = datos.datos);




  }


  ngOnDestroy(){
    this.suscripcion.unsubscribe();
  }


  public construirTabla(obj: any) {

    let columnas: Array<tabla> = [
      new tabla("nombreempleado", "Empleado"),
      new tabla("mensaje", "Mensaje"),
      new tabla("fecha", "Fecha", false, false, true)   
    ]

    if (obj) {
      for (let item of obj) {
        item["nombreempleado"] = item.usuarioId?.nombre + " " + item.usuarioId.apellidoPat + " ";
        item["nombreempleado"] += item.personaId?.apellidoMat ? "" : item.usuarioId?.apellidoMat
        item["mensaje"]=JSON.parse(item.mensajeInicialEmpleado).mensaje
        var datePipe = new DatePipe("es-MX");
        item["fecha"] = (new Date(item.fechaMensajeIncialEmpleado).toUTCString()).replace(" 00:00:00 GMT", "");
        item["fecha"] = datePipe.transform(item["fecha"], 'dd-MMM-y')?.replace(".", "");

      }
    }


    this.arreglotabla = {
      columnas: columnas,
      filas: obj
    };

    this.cargando = false;
  }


  public recibirTabla(obj: any) {
    
    switch (obj.type) {
      case "responder":
        this.socket.getChatDatos().datos.nombre = obj.datos.nombreempleado;
        this.socket.getChatDatos().datos.socket = obj.datos.conversacion.substring(0,obj.datos.conversacion.lastIndexOf("/"))+"/"+this.usuariossistemaPrd.getUsuario().usuarioId;
        this.socket.getChatDatos().ocultar = false;

        this.configuracionPrd.ocultarChat = false;


        let objEnviado = {
          enviado:false,
          mensaje: JSON.parse(obj.datos.mensajeInicialEmpleado).mensaje,
          fecha:new Date()
        };

        if(this.socket.getMensajes().length === 0){
            this.socket.setMensajes([objEnviado])
        }

        let objEnviar = {
          chatColaboradorId: obj.datos.chatColaboradorId,
          atendido: true,
          fechaRespuesta: new Date().getTime()
        };
        this.socket.modificarMensaje(objEnviar).subscribe(datos => {
            
        });
        break;
      case "default":
        
        this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas enviar el mensaje generico?").then(valor =>{
          if(valor){
            
              if(this.mensajes == undefined){
                  this.modalPrd.showMessageDialog(this.modalPrd.error,"No hay mensajes genericos que enviar");
              }else{
                  this.socket.enviarMensajeGenerico(this.mensajes[0].mensajeGenerico,obj.datos.conversacion);
                  let objEnviar = {
                    chatColaboradorId: obj.datos.chatColaboradorId,
                    atendido: false,
                    rechazo: true,
                    fechaRechazo: new DatePipe("es-MX").transform(new Date(),"yyyy-MM-dd")
                  };
                  this.socket.modificarMensaje(objEnviar).subscribe(datos => {
                    
                });
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

}
