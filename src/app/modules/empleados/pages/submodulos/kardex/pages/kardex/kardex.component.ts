import { Component, HostListener, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentosService } from 'src/app/modules/empleados/services/documentos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { truncateSync } from 'fs';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss']
})
export class KardexComponent implements OnInit {

  public tamanio:number = 0;
  public cargando : Boolean = false;
  public arreglo: any = [];
  public cargandoIcon: boolean= false;
  public idEmpleado: number = 0;
  public idEmpresa: number = 0;

  
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  public arreglotablaDesglose:any = {
    columnas:[],
    filas:[]
};

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;
    this.tamanio = event.target.innerWidth;
  }



  constructor(private routerPrd: Router, private documentosPrd: DocumentosService,private modalPrd:ModalService, 
    private router:ActivatedRoute, private ventana:VentanaemergenteService,private usuariosSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {

    

    this.router.params.subscribe(params => {
      this.idEmpleado = params["id"];
    });
  
    this.cargando = true;
    this.documentosPrd.getListaDocumentosEmpleado(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado).subscribe(datos => {
        //this.crearTabla(datos);
    });

    this.crearTabla();
  }


  public crearTabla(){
    
    //this.arreglo = datos.datos;

    
    let columnas: Array<tabla> = [
      new tabla("tipoMovimiento", "Tipo de movimiento"),
      new tabla("fechaMovimiento", "Fecha de movimiento"),
      new tabla("registroPatronal", "Registro Patronal")
    ]


    this.arreglotabla = {
      columnas:[],
      filas:[]
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = [{
      tipoMovimiento : "Alta de empleado",
      fechaMovimiento : "18/05/2021",
      registroPatronal : "EF23456",

    }];

    /*if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        item.fechaCarga = (new Date(item.fechaCarga).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaCargaDocumento = datepipe.transform(item.fechaCarga , 'dd-MMM-y')?.replace(".","");

        item.tipoDocumento= item.tipoDocumento?.nombre;
      }
    }*/

    this.cargando = false;
  }


  public recibirTabla(obj: any) {
    
    if (obj.type == "desglosar") {
      let datos = obj.datos;

      let item = obj.datos;
       
      let columnas: Array<tabla> = [
       new tabla("politica", "Política"),
       new tabla("salarioDiario", "Salario Diario"),
       new tabla("salarioIntegrado", "Salario diario integrado"),
       new tabla("salarioCotización", "Salario base de cotización"),
       new tabla("estatusEmpleado", "Estatus de empleado"),
              
     ];
    

     item.politica = "Estándar";
     item.salarioDiario = "1084.93",
     item.salarioIntegrado = "1135.49",
     item.salarioCotización = "1135.49",
     item.estatusEmpleado = "Activo"

     this.arreglotablaDesglose.columnas = columnas;
     this.arreglotablaDesglose.filas = item;

     item.cargandoDetalle = false;
     
    }


  }

  public filtrar(){

  }



}
