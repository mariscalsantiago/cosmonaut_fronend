import { Component, OnInit } from '@angular/core';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.scss']
})
export class ExpedienteComponent implements OnInit {

  public arreglotabla = {
    columnas:[],
    filas:[]
  }


  public cargando:boolean = false;

  constructor(public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
  }


  public filtrar(){
    }

    public recibirTabla(obj:any){

    }

}
