import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ConceptosService } from '../../services/conceptos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-listasconceptospercepciones',
  templateUrl: './listasconceptospercepciones.component.html',
  styleUrls: ['./listasconceptospercepciones.component.scss']
})
export class ListasconceptospercepcionesComponent implements OnInit {

  public tamanio: number = 0;
  public objEnviar: any;
  public changeIconDown: boolean = false;
  public nombre: string = "";
  public cargando: boolean = false;
  public id_empresa: number = 0;
  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandodetallegrupo:boolean = false;
  public indexSeleccionado: number = 0;

  public arreglotablaPer: any = [];

  public arreglotablaDed: any = [];

  public arreglodetalle:any = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;

    if (this.tamanio < 600) {

      this.modalWidth = "90%";

    } else {
      this.modalWidth = "55%";

    }
  }

  public arreglotablaPert: any = {
    columnas: [],
    filas: []
  };

  public arreglotablaDesgloseP:any = {
    columnas:[],
    filas:[]
  }


  public arreglotablaDedt: any = {
    columnas: [],
    filas: []
  };

  public arreglotablaDesgloseD:any = {
    columnas:[],
    filas:[]
  }

  public cargandoPer:boolean = false;
  public cargandoDed:boolean = false;


  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;






  constructor(private conceptosPrd: ConceptosService, private routerPrd: Router,
    private routerActive: ActivatedRoute,private modalPrd:ModalService,private configuracionesPrd:ConfiguracionesService) { }

  ngOnInit(): void {


    this.establecerPermisos();

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];

      this.cargando = true;
      
      this.cargandoPer = true;
      this.conceptosPrd.getListaConceptoPercepcion(this.id_empresa).subscribe(datos => {
          this.crearTablaPercepcion(datos);
      });

      this.cargandoDed = true;

      this.conceptosPrd.getListaConceptoDeduccion(this.id_empresa).subscribe(datos => {
           this.crearTablaDeduccion(datos);
      });

    });

  }



 public establecerPermisos(){
  this.esRegistrar = this.configuracionesPrd.getPermisos("Registrar");
  this.esConsultar = this.configuracionesPrd.getPermisos("Consultar");
  this.esEditar = this.configuracionesPrd.getPermisos("Editar");
  this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
}


  public crearTablaDeduccion(datos:any){
    this.arreglotablaDed = datos.datos;

    
    let columnas: Array<tabla> = [
      new tabla("nombre", "Nombre de la deducción"),
      new tabla("tipoDeduccionIdDescripcion", "Descripción SAT"),
      new tabla("esActivo", "Estatus"),
    ];


    this.arreglotablaDedt = {
      columnas:[],
      filas:[]
    }


    if(this.arreglotablaDed !== undefined){
        for(let item of this.arreglotablaDed){
          item.tipoDeduccionIdDescripcion =  item.tipoDeduccionId.descripcion;
        }
    }

    this.arreglotablaDedt.columnas = columnas;
    this.arreglotablaDedt.filas = this.arreglotablaDed;
    this.cargandoDed = false;

    this.cargando = false;
  }


  public crearTablaPercepcion(datos:any){
    if(datos.datos !== undefined){
      datos.datos.forEach((part:any) => {
        part.descripcion=part.tipoPercepcionId?.descripcion;
        if(part.tipoConcepto == "O"){
          part.tipoConcepto= "Ordinario"
        }
        if(part.tipoConcepto == "E"){
          part.tipoConcepto= "Extraordinario"
        }

        if(part.tipoPeriodicidad == "P"){
          part.tipoPeriodicidad= "Periodica"
        }
        if(part.tipoPeriodicidad == "E"){
          part.tipoPeriodicidad= "Estandar"
        }
        if(part.tipoPeriodicidad == "A"){
          part.tipoPeriodicidad= "Ambos"
        }

      });
    }
    this.arreglotablaPer = datos.datos;

    let columnas: Array<tabla> = [
      new tabla("nombre", "Nombre de la percepción"),
      new tabla("tipoConcepto", "Tipo de concepto"),
      new tabla("descripciolnsat", "Descripción SAT"),
      new tabla("esActivo", "Estatus")
    ];


    this.arreglotablaPert = {
      columnas:[],
      filas:[]
    }


    if(this.arreglotablaPer !== undefined){
        for(let item of this.arreglotablaPer){
          item.descripciolnsat =  item.tipoPercepcionId.descripcion;
        }
    }

    this.arreglotablaPert.columnas = columnas;
    this.arreglotablaPert.filas = this.arreglotablaPer;
    this.cargandoPer = false;
  }

  public filtrar() {

  }


  public eliminarPer(obj: any) {
    
    this.objEnviar = {
      conceptoPercepcionId: obj.conceptoPercepcionId,
      tipoPercepcionId: {
        tipoPercepcionId: obj.tipoPercepcionId.tipoPercepcionId
       },
      centrocClienteId: obj.centrocClienteId
      }

      const titulo = "¿Deseas eliminar la percepción?";

    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){

        
        this.conceptosPrd.eliminarPer(this.objEnviar).subscribe(datos => {
          this.cargando = false;        
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
        
          if (datos.resultado) {
            this.conceptosPrd.getListaConceptoPercepcion(this.id_empresa).subscribe(datos => {
                this.crearTablaPercepcion(datos);
       
            });

        }
  
        });
       }
    });



  }

  public eliminarDed(obj: any) {

    this.objEnviar = {
      conceptoDeduccionId: obj.conceptoDeduccionId,
      tipoDeduccionId: {
        tipoDeduccionId: obj.tipoDeduccionId.tipoDeduccionId
       },
      centrocClienteId: obj.centrocClienteId
      }

      const titulo = "¿Deseas eliminar la deducción?";

    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){


        this.conceptosPrd.eliminarDed(this.objEnviar).subscribe(datos => {
          this.cargando = false;        
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
        
          if (datos.resultado) {
            this.conceptosPrd.getListaConceptoDeduccion(this.id_empresa).subscribe(datos => {
               this.crearTablaDeduccion(datos);
            });

        }
  
        });
       }
    });



  }

  public verdetallePer(obj: any) {
    
        if(obj == undefined){
          this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'conceptosPercepciones', 'nuevo']);
        }else{
          this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'conceptosPercepciones', 'editar'],{ state: { data: obj}});
        }
      }
      public verdetalleDed(obj: any) {
    
        if(obj == undefined){
          this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'conceptosDeducciones', 'nuevo']);
        }else{
          this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'conceptosDeducciones', 'editar'],{ state: { data: obj}});
        }
      }

  apagandoPer(indice: number) {

    

    for(let x = 0;x < this.arreglotablaPer.length; x++){
      if(x == indice)
            continue;

      this.arreglotablaPer[x].seleccionado = false;
    }


    this.arreglotablaPer[indice].seleccionado = !this.arreglotablaPer[indice].seleccionado;
  
  }

  apagandoDed(indice: number) {

    

    for(let x = 0;x < this.arreglotablaDed.length; x++){
      if(x == indice)
            continue;

      this.arreglotablaDed[x].seleccionado = false;
    }


    this.arreglotablaDed[indice].seleccionado = !this.arreglotablaDed[indice].seleccionado;
  
  }



  public recibirTablaPercepcion(obj:any){
     switch(obj.type){
        case "editar":
          this.verdetallePer(obj.datos);
        break;
        case "eliminar":
          this.eliminarPer(obj.datos);
        break;
        case "desglosar":
          let item = obj.datos;

          let columnas:Array<tabla> = [
            new tabla("gravaIsrdescripcion","Grava ISR"),
            new tabla("gravaIsndescripcion","Grava ISN"),
            new tabla("cuentaContable","Cuenta contable"),
            new tabla("tipoPeriodicidad","Tipo de percepción")
          ];


          item.gravaIsrdescripcion = (item.gravaIsr=='S')?'Si':'No';
          item.gravaIsndescripcion = item.gravaIsn?"Si":"No";

          this.arreglotablaDesgloseP.columnas = columnas;
          this.arreglotablaDesgloseP.filas = item;


          item.cargandoDetalle = false;
          

        break;
     }
  }



  public recibirTablaDeduccion(obj:any){
      switch(obj.type){
        case "editar":
          this.verdetalleDed(obj.datos);
          break;
          case "eliminar":
            this.eliminarDed(obj.datos);
          break;
          case "desglosar":
            let item = obj.datos;
            let columnas:Array<tabla> = [
              new tabla("cuentaContable","Cuenta contable")
            ];
            this.arreglotablaDesgloseD.columnas = columnas;
            this.arreglotablaDesgloseD.filas = item;
            item.cargandoDetalle = false;
          break;
      }
  }



}
