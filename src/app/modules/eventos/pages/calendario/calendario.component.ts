import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';

@Component({
  selector: 'app-calendarioevento',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  public apareceListadoEventos: boolean = false;
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  }

  constructor(private ventana:VentanaemergenteService) { }

  ngOnInit(): void {

    const columnas:Array<tabla> = [
      new tabla("tipo","Tipo"),
      new tabla("nombre","Empleado"),
      new tabla("x","Fecha de inicio"),
      new tabla("x","Fecha fin"),
      new tabla("x","Duración"),
      new tabla("x","Estado")
    ];

    let arreglo = [];
    arreglo.push({tipo:"1",nombre:'santiago'});
    arreglo.push({tipo:"1",nombre:'santiago'});
    arreglo.push({tipo:"1",nombre:'santiago'});
    arreglo.push({tipo:"1",nombre:'santiago'});
    arreglo.push({tipo:"1",nombre:'santiago'});
    arreglo.push({tipo:"1",nombre:'santiago'});
    arreglo.push({tipo:"1",nombre:'santiago'});
    arreglo.push({tipo:"1",nombre:'santiago'});
    arreglo.push({tipo:"1",nombre:'santiago'});
    arreglo.push({tipo:"1",nombre:'santiago'});
    arreglo.push({tipo:"1",nombre:'santiago'});

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = arreglo;

  }

  public agregarEvento(indice: number) {
    switch (indice) {
      case 1:
          this.ventana.showVentana(this.ventana.solicitudVacaciones);
        break;
      case 2:
        this.ventana.showVentana(this.ventana.solicitudIncapacidad);
        break;
      case 3:
        this.ventana.showVentana(this.ventana.solicitudHorasExtras);
        break;
      case 4:
        this.ventana.showVentana(this.ventana.solicitudDiasEconomicos);
        break;
      case 5:
        this.ventana.showVentana(this.ventana.registrofaltas);
        break;
    }
  }

}
