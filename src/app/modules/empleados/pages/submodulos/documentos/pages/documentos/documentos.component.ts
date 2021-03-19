import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  public tamanio:number = 0;
  public cargando:Boolean = false;

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  constructor() { }

  ngOnInit(): void {
  }

  public filtrar(){

  }
}
