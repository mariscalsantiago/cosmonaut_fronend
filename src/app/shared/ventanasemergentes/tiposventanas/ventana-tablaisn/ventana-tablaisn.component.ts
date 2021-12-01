import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TablaValoresService } from 'src/app/modules/empresas/pages/submodulos/tablavalores/services/tablavalores.service';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ventana-tablaisn',
  templateUrl: './ventana-tablaisn.component.html',
  styleUrls: ['./ventana-tablaisn.component.scss']
})
export class VentanaTablaISNComponent implements OnInit {
  public myForm!: FormGroup;
  public arreglotarifaISN: any = [];
  public empresa: number = 0;
  public empleado: number = 0;
  public cargando: boolean = false;
  public estadoId: number = 0;
  public cestado: string = "";

  public arreglotablaISN: any = {
    columnas: [],
    filas: []
  };

  @Input() public datos:any;


  @Output() salida = new EventEmitter<any>();


  constructor(private modalPrd:ModalService, private formBuild: FormBuilder,
    private tablasISRPrd: TablaValoresService) { }

  ngOnInit(): void {


    this.cargando = true;
    this.estadoId = this.datos.estadoId;
    this.cestado = this.datos.estado;

    this.tablasISRPrd.getListaTarifaISN(this.estadoId).subscribe(datos => {
        this.crearTablaISN(datos);
    });


  }

  public formatearNumero(valor: number){
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
    });
    return formatter.format(valor);
  }

  public crearTablaISN(datos:any){


    this.arreglotarifaISN = datos.datos;
    if (this.arreglotarifaISN !== undefined) {
      for (let item of this.arreglotarifaISN) {
        item.fechaInicio = (new Date(item.fechaInicio).toUTCString()).replace(" 00:00:00 GMT", "");
        //item.fechaFin = (new Date(item.fechaFin).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaInicio = datepipe.transform(item.fechaInicio , 'dd-MMM-y')?.replace(".","");;
        //item.fechaFin = datepipe.transform(item.fechaFin , 'dd-MMM-y')?.replace(".","");;

        item.limiteInferior = this.formatearNumero(item.limiteInferior);
        item.limiteSuperior = this.formatearNumero(item.limiteSuperior);
        item.cuotaFija = this.formatearNumero(item.cuotaFija);
      }
    }

    let columnas: Array<tabla> = [
      new tabla("limiteInferior", "Límite inferior"),
      new tabla("limiteSuperior", "Límite superior"),
      new tabla("cuotaFija", "Cuota fija"),
      new tabla("tasa", "Excedente %"),
      new tabla("fechaInicio", "Fecha Inicio"),
    ];

    this.arreglotablaISN = {
      columnas: [],
      filas: []
    };


    this.arreglotablaISN.columnas = columnas;
    this.arreglotablaISN.filas = this.arreglotarifaISN;
    this.cargando = false;

  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }


  }


