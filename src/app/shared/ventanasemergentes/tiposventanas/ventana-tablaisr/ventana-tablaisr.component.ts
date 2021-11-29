import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TablaValoresService } from 'src/app/modules/empresas/pages/submodulos/tablavalores/services/tablavalores.service';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ventana-tablaisr',
  templateUrl: './ventana-tablaisr.component.html',
  styleUrls: ['./ventana-tablaisr.component.scss']
})
export class VentanaTablaISRComponent implements OnInit {
  public myForm!: FormGroup;
  public arreglotarifaISR: any = [];
  public empresa: number = 0;
  public empleado: number = 0;
  public cargando: boolean = false;
  public periodo: string = '';

  public arreglotablaISR: any = {
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

    this.tablasISRPrd.getListaTarifaISR(this.datos.periodo).subscribe(datos => {
        this.crearTablaISR(datos);
    });


  }

  public formatearNumero(valor: number){
    return valor.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  public crearTablaISR(datos:any){


    this.arreglotarifaISR = datos.datos;
    if (this.arreglotarifaISR !== undefined) {
      for (let item of this.arreglotarifaISR) {
        item.fechaInicio = (new Date(item.fechaInicio).toUTCString()).replace(" 00:00:00 GMT", "");
        item.limiteInferior = this.formatearNumero(item.limiteInferior);
        item.limiteSuperior = this.formatearNumero(item.limiteSuperior);
        item.cuotaFija = this.formatearNumero(item.cuotaFija);
        item.fechaFin = (new Date(item.fechaFin).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaInicio = datepipe.transform(item.fechaInicio , 'dd-MMM-y')?.replace(".","");
        item.fechaFin = datepipe.transform(item.fechaFin , 'dd-MMM-y')?.replace(".","");
      }
    }

    let columnas: Array<tabla> = [
      new tabla("limiteInferior", "Límite inferior"),
      new tabla("limiteSuperior", "Límite superior"),
      new tabla("cuotaFija", "Cuota fija"),
      new tabla("porcExcedenteLimInf", "Excedente %"),
      new tabla("fechaInicio", "Fecha Inicio"),
      new tabla("fechaFin", "Fecha Fin")
    ];

    this.arreglotablaISR = {
      columnas: [],
      filas: []
    };


    this.arreglotablaISR.columnas = columnas;
    this.arreglotablaISR.filas = this.arreglotarifaISR;
    this.cargando = false;

  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }


  }


