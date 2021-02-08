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
  public multiseleccion:Boolean = false;
  public multiseleccionloading:boolean = false;
  public changeIconDown: boolean = false;
  public objEnviar:any ;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

 
  public arreglo:any = [];

  constructor(private routerPrd:Router,private puestosProd:PuestosService,private CanRouterPrd:ActivatedRoute) { }

  ngOnInit(): void {
    debugger;
    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos =>{

      this.id_empresa = datos["id"]
      this.puestosProd.getAllArea(this.id_empresa).subscribe(datos => {
      this.arreglo = datos.datos;
      console.log("puestos-->",this.arreglo);
      this.cargando = false;
      //this.paginar();
    });

    });

  }


  public verdetalle(obj:any){
    debugger;
    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['empresa/detalle',this.id_empresa,'puestos', tipoinsert],{state:{datos:obj}});
    this.cargando = false;
  }
  public eliminar(obj:any){

     debugger;
     
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
  

  apagando(indice:number){
    
    for(let x = 0;x < this.arreglo.length; x++){
      if(x == indice)
            continue;

      this.arreglo[x].seleccionado = false;
    }


    this.arreglo[indice].seleccionado = !this.arreglo[indice].seleccionado;
  
  }

  public recibir($evento: any) {
    debugger;
    this.modal = false;
    if (this.iconType == "warning") {

      if ($evento) {
        //let id = this.arreglo[this.indexSeleccionado].id;

        this.puestosProd.eliminar(this.objEnviar).subscribe(datos => {
          let mensaje = datos.mensaje;
          let resultado = datos.resultado;

          this.strTitulo = mensaje;
          this.iconType = resultado ? "success" : "error";

          this.modal = true;

          if(resultado){


            this.arreglo.splice(this.objEnviar,1);
            console.log("split -->>",this.arreglo);


          }


        });

      }

    }


  }

} 



