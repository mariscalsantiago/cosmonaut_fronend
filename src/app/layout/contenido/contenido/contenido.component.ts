import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../../core/services/menu.service';
import { menuprincipal, submenu } from '../../../core/data/estructuramenu';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { Router } from '@angular/router';
import { ChatSocketService } from 'src/app/shared/services/chat/ChatSocket.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { RolesService } from 'src/app/modules/rolesypermisos/services/roles.service';

@Component({
  selector: 'app-contenido',
  templateUrl: './contenido.component.html',
  styleUrls: ['./contenido.component.scss']
})
export class ContenidoComponent implements OnInit {

  public arreglo!: Array<menuprincipal>;
  public mostrarmenu: boolean = false;
  public temporal: boolean = false;

  public ocultarchat:boolean = true;


  public PRINCIPAL_MENU:any;



  public modal = {
    strTitulo: "",
    iconType: "",
    modal: false,
    strSubtitulo:""
  }

  public mostrar = {
    nuevanomina:false,
    timbrado:false,
    timbrar:false,
    fotoperfil:false,
    percepciones: false,
    deducciones: false,
    ndispersion:false,
    ntimbrado:false,
    subirdocumento:false,
    nuevanominaextraordinaria:false,
    nuevanominaptu:false,
    tablaisr:false,
    subcidio: false,
    nuevanominafiniquitoliquidacion: false,
    mensajechat:false
  }

  public emergente = {
    modal: false,
    titulo:'',
    ventanaalerta:false,
    datos:undefined
  }

  public rol!: string;


  public chat:any = {
    ocultar:true,
    datos:{
      nombre:"Santiago antonio"
    }
  }


  constructor(private menuPrd: MenuService, private modalPrd: ModalService, private sistemaUsuarioPrd: UsuarioSistemaService,
    private ventana: VentanaemergenteService,private navigate:Router,
    private chatPrd:ChatSocketService,private authPrd:AuthService,private configuracionPrd:ConfiguracionesService,
    private rolesPrd:RolesService,private usuariosSistemaPrd:UsuarioSistemaService) {
    this.modalPrd.setModal(this.modal);
    this.ventana.setModal(this.emergente, this.mostrar);
  }

  ngOnInit(): void {

    this.rol = this.sistemaUsuarioPrd.getRol();

    this.arreglo = this.menuPrd.getMenu();


    this.chatPrd.setChatDatos(this.chat);


    if(this.authPrd.isAuthenticated()){
        if(!this.configuracionPrd.isSession(this.configuracionPrd.MENUUSUARIO)){
          this.rolesPrd.getListaModulos(true,this.usuariosSistemaPrd.getVersionSistema()).subscribe(datos => {
            this.PRINCIPAL_MENU=this.configuracionPrd.traerDatosMenu(this.usuariosSistemaPrd.getUsuario().submodulosXpermisos,datos,this.usuariosSistemaPrd.getVersionSistema());
            
            this.configuracionPrd.setElementosSesion(this.configuracionPrd.MENUUSUARIO,this.PRINCIPAL_MENU);
            this.establecericons();

          });
        }else{
           this.configuracionPrd.getElementosSesion(this.configuracionPrd.MENUUSUARIO).subscribe(datos =>{
             this.PRINCIPAL_MENU = datos;  
             this.establecericons();
           });
        }
    }

  }

  public limpiando() {
    for (let item of this.arreglo)
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


  public recibirchat(obj:any){
      switch(obj.type){
          case "exit":
            this.chat.ocultar = true;
            break;
      }
  }


  public cerrarSesion(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Estás seguro de cerrar la sesión?").then(valor=>{
      if(valor){
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.sistemaUsuarioPrd.logout().subscribe(datos =>{
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.authPrd.eliminarTokens();
            
            this.navigate.navigateByUrl('/auth/login');
          });
      }
    });
  }


  public establecericons(){
      for(let item of this.PRINCIPAL_MENU){
          switch(item.moduloId){
              case 1:
                  item.icono = "icon_admoncos"
                break;
                case 2:
                  item.icono = "icon_admon"
                break;
          }
      }
  }


 


}



