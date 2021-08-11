import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';

@Component({
  selector: 'app-ventana-resumen-dispersion',
  templateUrl: './ventana-resumen-dispersion.component.html',
  styleUrls: ['./ventana-resumen-dispersion.component.scss']
})
export class VentanaResumenDispersionComponent implements OnInit {
  @Output() salida = new EventEmitter<any>();
  @Input() datos:any;
  public cargandoIcon:boolean = false;
  public recibidos:any;
  constructor(private reportesPrd:ReportesService,private nominasOrdinariasPrd:NominaordinariaService) { }

  ngOnInit(): void {
    
    this.nominasOrdinariasPrd.resumenDispersar(this.datos.nominaId,this.datos.empleados).subscribe(datos =>{
        if(datos.datos !== undefined){
          this.recibidos = datos.datos;
        }
    });
  }



  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }


  public guardar(){
    this.salida.emit({type:"guardar",datos:true});
  }


  public descargarErrores(){
    this.cargandoIcon = true;
    this.reportesPrd.getErroresDispersionEmpleados(this.datos.nominaId).subscribe(datos =>{
      this.cargandoIcon = false;
      this.reportesPrd.crearArchivo(datos.datos,"erroresDispersion","xlsx");
    });
  }
}
