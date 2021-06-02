import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listaroles',
  templateUrl: './listaroles.component.html',
  styleUrls: ['./listaroles.component.scss']
})
export class ListarolesComponent implements OnInit {

  public arreglotabla:any ={
    columnas:[],
    filas:[]
  };

  public cargando:boolean = false;

  constructor(private routerPrd:Router) { }

  ngOnInit(): void {
    console.log("Componente llamado");
  }



  public detalle(obj:any){
    this.routerPrd.navigate(['rolesypermisos', 'lista', 'rol'], { state: { datos: obj } });
  }

  public recibirTabla(obj:any){

  }

}
