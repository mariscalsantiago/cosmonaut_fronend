import { Component, HostListener, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ApoderadoLegalService } from '../services/apoderadoLegal.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-listaapoderadoLegal',
  templateUrl: './listaapoderadoLegal.component.html',
  styleUrls: ['./listaapoderadoLegal.component.scss']
})
export class ListaapoderadoLegalComponent implements OnInit {

  
  public tamanio:number = 0;
  public cargando:Boolean = false;
  public id_empresa:number = 0;
  public multiseleccion:Boolean = false;
  public multiseleccionloading:boolean = false;
  public changeIconDown: boolean = false;
  public numeroitems: number = 5;
  public arreglopaginas: Array<any> = [];

  public nombre: string = "";
  public apellidoPaterno: string = "";
  public apellidoMaterno: string = "";
  public contactoInicialEmailPersonal: string = "";
  public nacionalidadId: string= "";
  public emailCorporativo: string = "";
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };


  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  /*
  
    Resultados desplegados en un array

  */

  public arreglo:any = [];

  constructor(private routerPrd:Router,private apoderadoProd:ApoderadoLegalService,private CanRouterPrd:ActivatedRoute,
    private configuracionesPrd:ConfiguracionesService   ) { }




  ngOnInit(): void {
    this.establecerPermisos();
    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos =>{
      this.id_empresa = datos["id"];
      let peticion = {
        centrocClienteId: {
          centrocClienteId: this.id_empresa
        },
        tipoPersonaId: {
          tipoPersonaId: 6
        }
      }

      


      this.apoderadoProd.getAllUsersRep(peticion).subscribe(datos => {
          this.realizarTabla(datos);
      });

  

    });

  }



 



 public establecerPermisos(){
    this.esRegistrar = this.configuracionesPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionesPrd.getPermisos("Consultar");
    this.esEditar = this.configuracionesPrd.getPermisos("Editar");
    this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
  }

  public realizarTabla(datos:any){
    
    this.arreglo = datos.datos;

    
    let columnas:Array<tabla> = [
      new tabla("personaId","ID"),
      new tabla("nombre","Nombre"),
      new tabla("apellidoPaterno","Primer apellido"),
      new tabla("apellidoMaterno","Segundo apellido"),
      new tabla("curp","CURP"),
      new tabla("emailCorporativo","Correo empresarial"),
      new tabla("poderNotarial","Poder notarial"),
      new tabla("esActivo","Estatus de apoderado")
    ];
   

    if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        item.fechaAlta = (new Date(item.fechaAlta).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaAlta = datepipe.transform(item.fechaAlta , 'dd-MMM-y')?.replace(".","");;
        if(item.esActivo){
         item.esActivo = 'Activo'
        }
        if(!item.esActivo){
        item.esActivo = 'Inactivo'
        }
      
      }
    }
    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }

  public realizarTablaFiltro(datos:any){
    this.arreglo = datos.datos;

      let columnas:Array<tabla> = [
      new tabla("personaId","ID"),
      new tabla("nombre","Nombre"),
      new tabla("apellidoPaterno","Primer apellido"),
      new tabla("apellidoMaterno","Segundo apellido"),
      new tabla("curp","CURP"),
      new tabla("emailCorporativo","Correo empresarial"),
      new tabla("poderNotarial","Poder notarial"),
      new tabla("esActivo","Estatus de apoderado")
    ];
   

    if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        item.fechaAlta = (new Date(item.fechaAlta).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaAlta = datepipe.transform(item.fechaAlta , 'dd-MMM-y')?.replace(".","");
        item.esActivo = item.activo;
        if(item.esActivo){
         item.esActivo = 'Activo'
        }
        if(!item.esActivo){
        item.esActivo = 'Inactivo'
        }
      
      }
    }
    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }


  public verdetalle(obj:any){
    this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'apoderadoLegal', 'nuevo'],{state:{data:obj}});
  }

  public filtrar() {
    
    this.cargando = true;

    let peticion = {

      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      emailCorporativo: this.emailCorporativo?.toLowerCase(),
      contactoInicialEmailPersonal: this.contactoInicialEmailPersonal?.toLowerCase(),
      centrocClienteId: {
        centrocClienteId: (this.id_empresa) == 0 ? "" : this.id_empresa
      },
      tipoPersonaId: {
        tipoPersonaId: 6
      }
    }

    this.cargando = true;
    this.apoderadoProd.filtrar(peticion).subscribe(datos => {
      
      this.realizarTablaFiltro(datos);
    });

  }

  public recibirTabla(obj:any){
    
    if(obj.type == "editar"){
      this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'apoderadoLegal', 'modifica'],{state:{data:obj.datos}});
    }
  }
  

}


