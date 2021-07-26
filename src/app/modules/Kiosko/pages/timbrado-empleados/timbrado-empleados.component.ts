import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timbrado-empleados',
  templateUrl: './timbrado-empleados.component.html',
  styleUrls: ['./timbrado-empleados.component.scss']
})
export class TimbradoEmpleadosComponent implements OnInit {
  public arreglotabla = {
    columnas:[],
    filas:[]
  }

  public cargando:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public filtrar(){

  }

  public recibirTabla(obj:any){
    }

}
