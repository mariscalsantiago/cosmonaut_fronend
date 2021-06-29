import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { menuprincipal } from '../../../core/data/estructuramenu';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { usuarioClass, UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { Router } from '@angular/router';
import { ChatSocketService } from 'src/app/shared/services/chat/ChatSocket.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { RolesService } from 'src/app/modules/rolesypermisos/services/roles.service';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ChatService } from 'src/app/modules/chat/services/chat.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent implements OnInit {

  public arreglo!: Array<menuprincipal>;
  public mostrarmenu: boolean = false;
  public temporal: boolean = false;

  public ocultarchat: boolean = true;


  public PRINCIPAL_MENU: any;


  public suscripcion!:Subscription;



  public modal = {
    strTitulo: "",
    iconType: "",
    modal: false,
    strSubtitulo: ""
  }

  public mostrar = {
    nuevanomina: false,
    timbrado: false,
    timbrar: false,
    fotoperfil: false,
    percepciones: false,
    deducciones: false,
    ndispersion: false,
    ntimbrado: false,
    subirdocumento: false,
    nuevanominaextraordinaria: false,
    nuevanominaptu: false,
    tablaisr: false,
    subcidio: false,
    nuevanominafiniquitoliquidacion: false,
    mensajechat: false
  }

  public emergente = {
    modal: false,
    titulo: '',
    ventanaalerta: false,
    datos: undefined
  }

  public rol!: string;




  public chat:any = {
    ocultar: true,
    datos: {
      nombre: "",
      socket:"",
      numeromensajes:0,
      mensajeRecibido:false,
      arregloMensaje:[]
    },
    body:{
      mensaje:"",
      idUsuario:0,
      nombre:"",
      fecha:""
    }
  }


  constructor(private menuPrd: MenuService, private modalPrd: ModalService, private sistemaUsuarioPrd: UsuarioSistemaService,
    private ventana: VentanaemergenteService, private navigate: Router,
    private chatPrd: ChatSocketService, private authPrd: AuthService, public configuracionPrd: ConfiguracionesService,
    private rolesPrd: RolesService, private usuariosSistemaPrd: UsuarioSistemaService,
    private charComponentPrd:ChatService) {
    this.modalPrd.setModal(this.modal);
    this.ventana.setModal(this.emergente, this.mostrar);
  }

  ngOnInit(): void {

    this.chat = this.chatPrd.getChatDatos();

    this.rol = this.sistemaUsuarioPrd.getRol();

    this.arreglo = this.menuPrd.getMenu();


    this.chatPrd.setChatDatos(this.chat);


    if (this.authPrd.isAuthenticated()) {
      if (!this.configuracionPrd.isSession(this.configuracionPrd.MENUUSUARIO)) {
        this.rolesPrd.getListaModulos(true, this.usuariosSistemaPrd.getVersionSistema()).subscribe(datos => {
          this.PRINCIPAL_MENU = this.configuracionPrd.traerDatosMenu(this.usuariosSistemaPrd.getUsuario().submodulosXpermisos, datos, this.usuariosSistemaPrd.getVersionSistema(),this.usuariosSistemaPrd.esCliente());
          this.PRINCIPAL_MENU.unshift({ moduloId: 0, nombreModulo: "Inicio", seleccionado: true, checked: true, pathServicio: '/inicio', icono: 'icon_home' });
          this.configuracionPrd.setElementosSesion(this.configuracionPrd.MENUUSUARIO, this.PRINCIPAL_MENU);
          this.establecericons();

          this.usuariosSistemaPrd.setUsuario((JSON.parse(localStorage["usuario"])) as usuarioClass);
          
          if(!Boolean(this.configuracionPrd.ocultarChat)){
            this.configuracionPrd.ocultarChat = this.usuariosSistemaPrd.getUsuario().esRecursosHumanos;
           
            if(this.usuariosSistemaPrd.usuario.esRecursosHumanos){
              this.suscripcion = this.charComponentPrd.getListaChatActivos(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos =>{
                console.log("SANTIAGO ANTONIO",datos.datos);
              });
            }
        
          }


        });

      } else {
        this.configuracionPrd.getElementosSesion(this.configuracionPrd.MENUUSUARIO).subscribe(datos => {
          this.PRINCIPAL_MENU = datos;
          this.establecericons();
          if((this.configuracionPrd.ocultarChat) == undefined){
            this.configuracionPrd.ocultarChat = this.usuariosSistemaPrd.getUsuario().esRecursosHumanos;
            if(this.usuariosSistemaPrd.usuario.esRecursosHumanos){
              this.suscripcion = this.charComponentPrd.getListaChatActivos(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos =>{
                console.log("SANTIAGO ANTONIO",datos.datos);
              });
            }
          }



          

        });
      }
    }

  }

  public limpiando() {

    
      for (let item of this.PRINCIPAL_MENU)
      item.seleccionado = false;
    
    
  }

  public seleccionado(obj: any) {
    this.limpiando();

    obj.seleccionado = true;

    obj.seleccionadosubmenu = !obj.seleccionadosubmenu;
  }


  public seleccionarSubmenu(obj: any, obj2: any) {
    this.limpiando();
    obj.seleccionado = true;

    
    

    this.configuracionPrd.setPermisos(obj2.permisos);
  }


  public recibir(obj: any) {

    this.modalPrd.recibiendomensajes(obj);

  }

  public mostrarVentana() {
    this.modalPrd.showMessageDialog(this.modalPrd.success).then();
  }

  public recibirEmergente($event: any) {
    this.emergente.modal = false;
    this.ventana.recibiendomensajes($event);
  }


  public recibirchat(obj: any) {
    switch (obj.type) {
      case "exit":
        this.chat.ocultar = true;
        break;
    }
  }


  public cerrarSesion() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Estás seguro de cerrar la sesión?").then(valor => {
      if (valor) {

        this.chatPrd.disconnect();
        this.suscripcion.unsubscribe();
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.sistemaUsuarioPrd.logout().subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.authPrd.eliminarTokens();

          this.navigate.navigateByUrl('/auth/login');
        });
      }
    });
  }


  public establecericons() {
    for (let item of this.PRINCIPAL_MENU) {
      switch (item.moduloId) {
        case 1:
          item.icono = "icon_admoncos"
          break;
        case 2:
          item.icono = "icon_admon"
          break;
        case 8:
          item.icono = "icon_empleados"
          break;
        case 4://Eventos
          item.icono = "icon_eventos"
          break;
        case 7:
          item.icono = "icon_reportes"
          break;
        case 9://chat
          item.icono = "icon_chat"
          break;
        case 3://empleados
          item.icono = "icon_empleados"
          break;
        case 6://empleados
          item.icono = "icon_imss"
          break;
        case 5:
          item.icono = "icon_nominas"
          break;

      }
    }
  }


  public darClickChat(){
    if(!this.usuariosSistemaPrd.getUsuario().esRecursosHumanos){
      this.chatPrd.getChatDatos().datos.socket = `/websocket/chat/${this.usuariosSistemaPrd.getIdEmpresa()}${this.usuariosSistemaPrd.usuario.usuarioId}/${this.usuariosSistemaPrd.getIdEmpresa()}/${this.usuariosSistemaPrd.usuario.usuarioId}`;
      this.chat.ocultar = !this.chat.ocultar
      this.chat.datos.nombre = this.chatPrd.getNombreRecursosHumanos();
      this.chat.datos.numeromensajes = 0;
      this.chat.datos.mensajeRecibido = false;
  
    }else{
      this.chat.ocultar = !this.chat.ocultar;
      this.chat.datos.numeromensajes = 0;
      this.chat.datos.mensajeRecibido = false;
    }


    this.chatPrd.datos.datos.numeromensajes = 0;
    this.chatPrd.datos.datos.mensajeRecibido = false;
  }


  public irRuta(item:any){
    let intervalo = interval(300);
    intervalo.pipe(take(1));
    let valor = intervalo.subscribe(()=>{
      this.configuracionPrd.accesoRuta = false;
      valor.unsubscribe();
    });

    
    
    this.configuracionPrd.accesoRuta = true;
    this.navigate.navigate([item.pathServicio]);
  }







}



