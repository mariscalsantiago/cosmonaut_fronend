import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PuestosService } from '../services/puestos.service';

@Component({
  selector: 'app-listapuestos',
  templateUrl: './listapuestos.component.html',
  styleUrls: ['./listapuestos.component.scss']
})
export class ListapuestosComponent implements OnInit {

  public modal: boolean = false;
  public insertar: boolean = false;
  public iconType:string = "";
  public strTitulo: string = "";
  public strsubtitulo:string = "";
  public tamanio:number = 0;
  public cargando:Boolean = false;
  public id_empresa:number = 0;
  public id_area: number = 0;
  public changeIconDown: boolean = false;
  public objEnviar:any ;

  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandodetallearea:boolean = false;
  public nombreCorto : string = "";


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

 
  public arreglo:any = [];
  public arreglodetalle:any = [];

  constructor(private routerPrd:Router,private puestosProd:PuestosService,private CanRouterPrd:ActivatedRoute) { }

  ngOnInit(): void {
     
    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos =>{

      this.id_empresa = datos["id"]
      this.puestosProd.getAllArea(this.id_empresa).subscribe(datos => {
      this.arreglo = datos.datos;
      this.cargando = false;
      //this.paginar();
    });

    });

  }


  public verdetalle(obj:any){
     
    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'area', tipoinsert],{state:{datos:obj}});
    this.cargando = false;
  }
  public eliminar(obj:any){

      
     
     this.objEnviar = {
      areaId: obj.areaId,
      descripcion: obj.descripcion,
      nombreCorto: obj.nombreCorto,
      fechaAlta: obj.fechaAlta,
      esActivo: obj.esActivo,
      centrocClienteId: obj.nclCentrocCliente.centrocClienteId
    }

    this.modal = true;
    this.strTitulo = "¿Deseas eliminar el área?";
    this.strsubtitulo = "Estas a punto de borrar un área";
    this.iconType = "warning";
            
  }
  
  public traerModal(indice: any) {

     
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


    let areapuestoitem = this.arreglo[indice];
    
    this.cargandodetallearea = true;
    this.puestosProd.getdetalleArea(this.id_empresa,areapuestoitem.areaId).subscribe(datos =>{

      this.cargandodetallearea = false;


      this.arreglodetalle = datos.datos == undefined ? []:datos.datos;

     

    });

  }

  public filtrar() {
     

    this.cargando = true;

    let peticion = {

      nombreCorto: this.nombreCorto,
      nclCentrocCliente: {
        nombre: ""
      }
    } 
 
    this.puestosProd.filtrar(peticion).subscribe(datos => {
      this.arreglo = datos.datos;
      this.cargando = false;
    });
  }

  public recibir($evento: any) {
     
    this.modal = false;
    if (this.iconType == "warning") {

      if ($evento) {

        this.puestosProd.eliminar(this.objEnviar).subscribe(datos => {
          let mensaje = datos.mensaje;
          let resultado = datos.resultado;
          this.iconType = resultado ? "success" : "error";
          this.strTitulo = mensaje;
          this.strsubtitulo = 'Registro eliminado correctamente!'
          this.modal = true;
          if(resultado){

            this.puestosProd.getAllArea(this.id_empresa).subscribe(datos => {
              this.arreglo = datos.datos;

            });
        }

        });
        
      }
    }

   }

} 



