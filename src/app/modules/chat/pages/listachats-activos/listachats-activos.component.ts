import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { ContenidoComponent } from 'src/app/layout/contenido/contenido/contenido.component';
import { ChatSocketService } from 'src/app/shared/services/chat/ChatSocket.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
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

  public cargando: boolean = false;
  constructor(private ventanaPrd: VentanaemergenteService, private chatPrd: ChatService,
    private usuariossistemaPrd: UsuarioSistemaService, private socket: ChatSocketService,
    private modalPrd:ModalService) { }

  ngOnInit(): void {


    this.cargando = true;
    this.chatPrd.getListaChatActivos(this.usuariossistemaPrd.getIdEmpresa()).subscribe(datos => {
      this.construirTabla(datos.datos);
    });

    this.socket.getMensajeGenericoByEmpresa(this.usuariossistemaPrd.getIdEmpresa()).subscribe(datos => this.mensajes = datos.datos);




  }


  public construirTabla(obj: any) {

    let columnas: Array<tabla> = [
      new tabla("nombreempleado", "Empleado"),
      new tabla("mensajeInicialEmpleado", "Mensaje"),
      new tabla("fecha", "Fecha", false, false, true),
    ]

    if (obj) {
      for (let item of obj) {
        item["nombreempleado"] = item.usuarioId?.nombre + " " + item.usuarioId.apellidoPat + " ";
        item["nombreempleado"] += item.personaId?.apellidoMat ? "" : item.usuarioId?.apellidoMat

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
        this.socket.getChatDatos().datos.socket = obj.datos.conversacion;
        this.socket.getChatDatos().ocultar = false;
        this.socket.getChatDatos().datos.rrh = true;
        let objEnviar = {
          chatColaboradorId: obj.datos.chatColaboradorId,
          atendido: true,
          fechaRespuesta: new Date().getTime()
        };
        this.socket.modificarMensaje(objEnviar).subscribe(datos => {
            console.log(datos.datos);
        });
        break;
      case "default":
        debugger;
        this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas enviar el mensaje generico?").then(valor =>{
          if(valor){
            console.log(this.mensajes);
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
                    console.log(datos.datos);
                });
              }
          }
        });
        break;
    }
  }

  public editarMensaje() {

    this.ventanaPrd.showVentana(this.ventanaPrd.mensajechat)

  }

}
