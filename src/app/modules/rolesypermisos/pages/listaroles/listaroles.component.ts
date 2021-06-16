import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-listaroles',
  templateUrl: './listaroles.component.html',
  styleUrls: ['./listaroles.component.scss']
})
export class ListarolesComponent implements OnInit {

  public arreglotabla:any ={
    columnas:[],
    filas:[]
  };

  public cargando:boolean = false;

  public arreglo:any = [];

  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;

  constructor(private routerPrd:Router,private rolesPrd:RolesService,private modalPrd:ModalService,
    private usuariosSistemaPrd:UsuarioSistemaService,private configuracionesPrd:ConfiguracionesService) { }

  ngOnInit(): void {


    this.establecerPermisos();

    this.cargando = true;
    this.rolesPrd.getRolesByEmpresa(this.usuariosSistemaPrd.getIdEmpresa(), this.usuariosSistemaPrd.getVersionSistema(), true).subscribe(datos =>{
      this.arreglo = datos.datos;
      let columnas:Array<tabla> = [new tabla("nombreRol","Rol"),
      new tabla("","Número de usuarios"),
      new tabla("esActivo","Estatus")]
      this.arreglotabla = {
        columnas: columnas,
        filas: this.arreglo
      };
      this.cargando = false;
    });
  }



  public detalle(obj:any){
    this.routerPrd.navigate(['rolesypermisos', 'lista', 'rol'], { state: { datos: obj } });
  }

  public eliminar(obj:any,indice:number){
      this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas eliminar el rol?").then((valor)=>{
        if(valor){
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.rolesPrd.eliminarRol(obj.rolId).subscribe(datos =>{
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                    this.arreglo.splice(indice,1);

                    let columnas:Array<tabla> = [new tabla("nombreRol","Rol"),
                    new tabla("","Número de usuarios"),
                    new tabla("esActivo","Estatus")]
                    this.arreglotabla = {
                      columnas: columnas,
                      filas: this.arreglo
                    };
                }
              });  
          });
        }  
      });
  }

  public recibirTabla(obj:any){
      switch(obj.type){
        case "editar":
          this.detalle(obj.datos);
          break;
        case "eliminar":
          this.eliminar(obj.datos,obj.indice);
          break;
        }
  }


  public establecerPermisos(){
    this.esRegistrar = this.configuracionesPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionesPrd.getPermisos("Consultar");
    this.esEditar = this.configuracionesPrd.getPermisos("Editar");
    this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
  }

}
