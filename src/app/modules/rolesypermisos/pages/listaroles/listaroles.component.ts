import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
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
  public arregloFinal:any = [];

  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;
  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandodetallearea: boolean = false;
  public modulo: string = "";
  public subModulo: string = "";
  public tamanio: number = 0;


  public arreglodetalle: any = [];

  constructor(private routerPrd:Router,private rolesPrd:RolesService,private modalPrd:ModalService,
    private usuariosSistemaPrd:UsuarioSistemaService,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    this.establecerPermisos();

    this.cargando = true;
    
    this.rolesPrd.getRolesByEmpresa(this.usuariosSistemaPrd.getIdEmpresa(), this.usuariosSistemaPrd.getVersionSistema(), true).subscribe(datos =>{
      this.arregloFinal = datos.datos;

          this.rolesPrd.getRolesByEmpresa(this.usuariosSistemaPrd.getIdEmpresa(), this.usuariosSistemaPrd.getVersionSistema(), false).subscribe(datosFa => {
            if(datosFa.datos != undefined){
              this.arreglo = datosFa.datos
              } 
            for(let item of this.arregloFinal){
              if(item.rolId == 1 || item.rolId == 2 || item.rolId == 3)
              continue;
              this.arreglo.push(item);
            }  


      let columnas:Array<tabla> = [new tabla("nombreRol","Rol"),
      new tabla("noUsuarios","Número de usuarios",true,true,true),
      new tabla("activo","Estatus Rol")]

      this.arreglotabla = {
        columnas: columnas,
        filas: this.arreglo
      };

      for (let item of this.arreglo) {

        if (item.esActivo) {
          item.activo = 'Activo';
        }
        if (!item.esActivo) {
          item.activo = 'Inactivo';
        }
      }

      this.cargando = false;
      });

    });

  }


  public inicio(){
    this.routerPrd.navigate(['/inicio']);
  }

  public verRolesModal(obj : any){
    let elemento: any = document.getElementById("vetanaprincipaltabla")
    this.aparecemodalito = true;

    if (elemento.getBoundingClientRect().y < -40) {
      let numero = elemento.getBoundingClientRect().y;
      numero = Math.abs(numero);
      this.scrolly = numero + 100 + "px";

    } else {

      this.scrolly = "5%";
    }

    if (this.tamanio < 600) {
      this.modalWidth = "90%";
    } else {
      this.modalWidth = "55%";
    }

    let idRoles = obj.datos;
    this.cargandodetallearea = true;
    this.rolesPrd.getdetalleRoles(632, idRoles.rolId).subscribe(datos => {

      this.cargandodetallearea = false;

      this.arreglodetalle = datos.datos == undefined ? [] : datos.datos;
      if (this.arreglodetalle !== undefined){
        for (let item of this.arreglodetalle){
          item.nombrecompleto = `${item.nombre == undefined ? '':item.nombre} ${item.apellidoPat == undefined ? '':item.apellidoPat} ${item.apellidoMat == undefined ? '':item.apellidoMat}`;
          
        }
      }
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
                    new tabla("esActivo","Estatus Rol")]
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
    console.log(obj.type);
      switch(obj.type){
        case "editar":
          this.detalle(obj.datos);
          break;
        case "eliminar":
          this.eliminar(obj.datos,obj.indice);
          break;
        case "columna":
            this.verRolesModal(obj);
            break;
        }
        
  }


  public establecerPermisos(){
    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionPrd.getPermisos("Consultar");
    this.esEditar = this.configuracionPrd.getPermisos("Editar");
    this.esEliminar = this.configuracionPrd.getPermisos("Eliminar");
  }

}
