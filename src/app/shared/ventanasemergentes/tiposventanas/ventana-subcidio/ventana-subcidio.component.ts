import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TablaValoresService } from 'src/app/modules/empresas/pages/submodulos/tablavalores/services/tablavalores.service';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ventana-subcidio',
  templateUrl: './ventana-subcidio.component.html',
  styleUrls: ['./ventana-subcidio.component.scss']
})
export class VentanaSubcidioComponent implements OnInit {
  public myForm!: FormGroup;
  public arregloSubcidioISR: any = [];
  public empresa: number = 0;
  public periodo = "";
  public empleado: number = 0;
  public cargando: boolean = false;

  public arreglotablaSubcidio: any = {
    columnas: [],
    filas: []
  };

  @Input() public datos:any;


  @Output() salida = new EventEmitter<any>();


  constructor(private modalPrd:ModalService, private formBuild: FormBuilder,
    private tablasISRPrd: TablaValoresService) { }

  ngOnInit(): void {
    

    this.empresa = this.datos.centrocClienteId?.centrocClienteId;
    this.empleado = this.datos.personaId?.personaId;

    this.cargando = true;
    this.periodo = this.datos.tabla;
    
    this.tablasISRPrd.getListaSubcidioISR(this.datos.periodo).subscribe(datos => {
        this.crearTablaSubcidio(datos);
    });


  }

  public crearTablaSubcidio(datos:any){
    
     
    this.arregloSubcidioISR = datos.datos;
    
    if (this.arregloSubcidioISR !== undefined) {
      for (let item of this.arregloSubcidioISR) {
        item.fechaInicio = (new Date(item.fechaInicio).toUTCString()).replace(" 00:00:00 GMT", "");
        item.fechaFin = (new Date(item.fechaFin).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaInicio = datepipe.transform(item.fechaInicio , 'dd-MMM-y')?.replace(".","");;
        item.fechaFin = datepipe.transform(item.fechaFin , 'dd-MMM-y')?.replace(".","");;
      }
    }
    let columnas: Array<tabla> = [
      new tabla("limiteInferior", "Para ingresos de"),
      new tabla("limiteSuperior", "Hasta ingresos de"),
      new tabla("montoSubsidio", "Cantidad de subsidio para el empleo"),
      new tabla("fechaInicio", "Fecha Inicio"),
      new tabla("fechaFin", "Fecha Fin")

    ];

    this.arreglotablaSubcidio = {
      columnas:[],
      filas:[]
    }


    this.arreglotablaSubcidio.columnas = columnas;
    this.arreglotablaSubcidio.filas = this.arregloSubcidioISR;
    this.cargando = false;
  
  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }


  }


