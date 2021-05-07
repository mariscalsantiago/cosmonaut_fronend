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

  public arreglotablaISR: any = {
    columnas: [],
    filas: []
  };

  @Input() public datos:any;


  @Output() salida = new EventEmitter<any>();


  constructor(private modalPrd:ModalService, private formBuild: FormBuilder,
    private tablasISRPrd: TablaValoresService) { }

  ngOnInit(): void {
    debugger;

    this.empresa = this.datos.centrocClienteId?.centrocClienteId;
    this.empleado = this.datos.personaId?.personaId;

    this.cargando = true;
    debugger;
    this.tablasISRPrd.getListaTarifaISR(this.datos.periodo).subscribe(datos => {
        this.crearTablaISR(datos);
    });


  }

  public crearTablaISR(datos:any){
    debugger;
     
    this.arreglotarifaISR = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("limiteInferior", "Límite inferior"),
      new tabla("limiteSuperior", "Límite superior"),
      new tabla("cuotaFija", "Cuota fija"),
      new tabla("porcExcedenteLimInf", "Excedente %")

    ];

    this.arreglotablaISR = {
      columnas:[],
      filas:[]
    }


    this.arreglotablaISR.columnas = columnas;
    this.arreglotablaISR.filas = this.arreglotarifaISR;
    this.cargando = false;
  
  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }


  }


