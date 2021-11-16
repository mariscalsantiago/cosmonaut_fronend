import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
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







  public mensajes: any = [];

  public modulo: string = "";
  public subModulo: string = "";

  public cargando: boolean = false;
  public suscripcion!: Subscription;
  constructor(private ventanaPrd: VentanaemergenteService, private chatPrd: ChatService,
    private usuariossistemaPrd: UsuarioSistemaService, private socket: ChatSocketService,
    private modalPrd: ModalService, public configuracionPrd: ConfiguracionesService,
    private notificacionesPrd: NotificacionesService, private router: Router) { }

  ngOnInit(): void {

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();
    
    this.notificacionesPrd.notificacionesMenu = 0;
    this.cargando = true;

    this.notificacionesPrd.dentroListaChat = true;


    this.obtieneListaChat();

    this.socket.getMensajeGenericoByEmpresaByEmpleado(this.usuariossistemaPrd.getIdEmpresa(), this.usuariossistemaPrd.usuario.usuarioId).subscribe(datos => {
      this.mensajes = datos.datos
    });


    this.suscripcion = this.notificacionesPrd.recibirNotificacion().subscribe(valor => {
      if (valor.data != "CONNECT" && valor.data != "CLOSE") {
        setTimeout(() => {
          this.obtieneListaChat();
        }, 2000);
      }
    });

  }

  public obtieneListaChat() {

    this.chatPrd.getListaChat(this.usuariossistemaPrd.getIdEmpresa(), this.usuariossistemaPrd.usuario.usuarioId).subscribe(datos => {
      if (Boolean(datos.datos)) {
        this.construirTabla(datos.datos);
      } else {
        this.arreglotabla = {
          filas: undefined
        }
      }



      this.cargando = false;
    });
  }


  public inicio(){
    this.router.navigate(['/inicio']);
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
        item["mensajeultimo"] = arreglomensajes[arreglomensajes.length - 1]?.mensaje;
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


        this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas enviar el mensaje generico?").then(valor => {
          if (valor) {

            if (this.mensajes == undefined) {
              this.modalPrd.showMessageDialog(this.modalPrd.error, "No hay mensajes genericos que enviar");
            } else {
              let mensajeEnviar = this.mensajes[0].mensajeGenerico;
              this.responderMensajeGenerico(obj.datos, mensajeEnviar);
            }
          }
        });
        break;

      case "concluir":
        this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas terminar la conversación con el empleado?").then(valor => {
          if (valor) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.notificacionesPrd.terminar(obj.datos.chatColaboradorId).subscribe(datos => {
              this.modalPrd.showMessageDialog(datos.resultado, datos.datos);
              this.obtieneListaChat();
              this.atiendeChat(obj.datos, true);

              setTimeout(() => {
                const mensaje = `ACCEPTMESSAGEFROM${obj.datos.usuarioId.usuarioId}`;
                this.notificacionesPrd.enviarMensajeEspecifico(mensaje);
              }, 2000);

            });
          }
        });
        break;
    }
  }

  public editarMensaje() {

    this.ventanaPrd.showVentana(this.ventanaPrd.mensajechat, { datos: this.mensajes || [] })
      .then(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.socket.getMensajeGenericoByEmpresaByEmpleado(this.usuariossistemaPrd.getIdEmpresa(), this.usuariossistemaPrd.usuario.usuarioId).subscribe(datos => {
          this.mensajes = datos.datos
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        });
      });

  }

  public responderEmpleado(valorConversacion: any) {

    if (!valorConversacion.atendido) {
      valorConversacion.nombreRrh = `${this.usuariossistemaPrd.usuario.nombre} ${this.usuariossistemaPrd.usuario.apellidoPat}`;
      valorConversacion.atendido = true;
      valorConversacion.idUsuarioRrh = this.usuariossistemaPrd.usuario.usuarioId;
      this.notificacionesPrd.modificar(valorConversacion).subscribe(valor => {
        if (valor.resultado) {
          const mensaje = `ACCEPTMESSAGEFROM${valorConversacion.usuarioId.usuarioId}`;
          this.notificacionesPrd.enviarMensaje(mensaje);
          this.atiendeChat(valorConversacion, false);
        }
      });
    } else {
      this.atiendeChat(valorConversacion, false);
    }
  }

  public atiendeChat(valorConversacion: any, ocultarchar: boolean) {
    this.notificacionesPrd.mensajes = JSON.parse(valorConversacion.mensajes);
    this.notificacionesPrd.nombreEmpleado = valorConversacion.nombreempleado;
    this.notificacionesPrd.closeEspecifico();
    this.notificacionesPrd.conectarEspecifico(`${environment.rutaSocket}${valorConversacion.conversacionId}`,this.usuariossistemaPrd.getUsuario(),this.usuariossistemaPrd.getIdEmpresa());
    this.socket.datos.ocultar = ocultarchar;
    this.configuracionPrd.ocultarChat = ocultarchar;

    }



  public ngOnDestroy() {
    if (this.suscripcion) {
      this.suscripcion.unsubscribe();
    }

    this.notificacionesPrd.dentroListaChat = false;
  }

  public responderMensajeGenerico(valorConversacion: any, mensajegenerico: any) {
    if (!Boolean(mensajegenerico)) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "No hay mensaje generico que enviar");

      return;
    }
    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    if (!valorConversacion.atendido) {
      valorConversacion.nombreRrh = `${this.usuariossistemaPrd.usuario.nombre} ${this.usuariossistemaPrd.usuario.apellidoPat}`;
      valorConversacion.atendido = true;
      valorConversacion.idUsuarioRrh = this.usuariossistemaPrd.usuario.usuarioId;
      this.notificacionesPrd.modificar(valorConversacion).subscribe(valor => {
        if (valor.resultado) {
          const mensaje = `ACCEPTMESSAGEFROM${valorConversacion.usuarioId.usuarioId}`;
          this.notificacionesPrd.enviarMensaje(mensaje);
          this.atiendeChat(valorConversacion, true);
          setTimeout(() => {
            let mensaje = { mensaje: mensajegenerico, usuarioId: this.usuariossistemaPrd.usuario.usuarioId, nombre: this.usuariossistemaPrd.getUsuario().nombre };
            let arreglo = JSON.parse(valorConversacion.mensajes)
            arreglo.push(mensaje);
            this.notificacionesPrd.enviarMensajeEspecifico(JSON.stringify(arreglo));
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            setTimeout(() => {
              this.obtieneListaChat();
            }, 500);
          }, 2000);
        }
      });
    } else {
      this.atiendeChat(valorConversacion, true);
      setTimeout(() => {
        let mensaje = { mensaje: mensajegenerico, usuarioId: this.usuariossistemaPrd.usuario.usuarioId, nombre: this.usuariossistemaPrd.getUsuario().nombre };
        let arreglo = JSON.parse(valorConversacion.mensajes)
        arreglo.push(mensaje);
        this.notificacionesPrd.enviarMensajeEspecifico(JSON.stringify(arreglo));
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        setTimeout(() => {
          this.obtieneListaChat();
        }, 500);
      }, 2000);
    }
  }

}
