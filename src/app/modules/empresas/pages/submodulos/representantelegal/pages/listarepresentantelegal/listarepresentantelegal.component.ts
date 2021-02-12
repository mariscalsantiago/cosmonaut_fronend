import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { RepresentanteLegalService } from '../services/representantelegal.service';

@Component({
  selector: 'app-listarepresentantelegal',
  templateUrl: './listarepresentantelegal.component.html',
  styleUrls: ['./listarepresentantelegal.component.scss']
})
export class ListarepresentantelegalComponent implements OnInit {

  
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
  public emailCorporativo: string = "";
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  /*
  
    Resultados desplegados en un array

  */

  public arreglo:any = [];

  constructor(private routerPrd:Router,private representanteProd:RepresentanteLegalService,private CanRouterPrd:ActivatedRoute) { }

  ngOnInit(): void {
    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos =>{

      this.id_empresa = datos["id"]
      this.representanteProd.getAllUsersRep().subscribe(datos => {
      this.arreglo = datos.datos;

      let columnas:Array<tabla> = [
        new tabla("personaId","ID",true),
        new tabla("nombre","Nombre"),
        new tabla("apellidoPaterno","Apellido Paterno"),
        new tabla("apellidoMaterno","Apellido Materno"),
        new tabla("curp","CURP"),
        new tabla("emailCorporativo","Correo Empresarial"),
        new tabla("fechaAlta","Fecha de registro"),
        new tabla("activo","Estatus")
      ]
      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = this.arreglo;
      this.cargando = false;
    });

    });

  }


  public verdetalle(obj:any){
    this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'representantelegal', 'nuevo'],{state:{data:obj}});
  }

  public filtrar() {
    this.cargando = true;

    let peticion = {

      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      emailCorporativo: this.emailCorporativo,
      contactoInicialEmailPersonal: this.contactoInicialEmailPersonal,
      centrocClienteId: {
        centrocClienteId: (this.id_empresa) == 0 ? "" : this.id_empresa
      },
      tipoPersonaId: {
        tipoPersonaId: 1
      }
    }

 
    


    this.representanteProd.filtrar(peticion).subscribe(datos => {

      
      
      
      this.arreglo = datos.datos;
      let columnas:Array<tabla> = [
        new tabla("personaId","ID",true),
        new tabla("nombre","Nombre"),
        new tabla("apellidoPaterno","Apellido Paterno"),
        new tabla("apellidoMaterno","Apellido Materno"),
        new tabla("curp","CURP"),
        new tabla("emailCorporativo","Correo Empresarial"),
        new tabla("fechaAlta","Fecha de registro"),
        new tabla("activo","Estatus")
      ];

      this.arreglotabla = {
        columnas:columnas,
        filas:this.arreglo
      };
      this.cargando = false;
    });

  }

  public recibirTabla(obj:any){
    if(obj.type == "editar"){
      this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'representantelegal', 'modifica'],{state:{data:obj.datos}});
    }
  }
  

}


