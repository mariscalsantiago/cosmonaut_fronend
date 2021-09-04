import { Component, Input, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';

@Component({
  selector: 'app-lista-empleados',
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.scss']
})
export class ListaEmpleadosComponent implements OnInit {

  @Input() datos:any;


 public arreglo:any = {
   columnas:[],
   filas:[]
 };

  constructor() { }

  ngOnInit(): void {


    let columnas:Array<tabla>  = [
      new tabla("numeroEmpleado","Número de empleados"),
      new tabla("nombreCompleto","Nombre del empleado")
    ];
    let filas = this.datos;

    this.arreglo = {
      columnas:columnas,
      filas:filas
    };
  }

}
