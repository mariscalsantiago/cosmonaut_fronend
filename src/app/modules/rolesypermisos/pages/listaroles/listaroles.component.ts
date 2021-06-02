import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { RolesService } from '../../services/roles.service';

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

  public arreglo:any = [];

  constructor(private routerPrd:Router,private rolesPrd:RolesService) { }

  ngOnInit(): void {

    this.cargando = true;
    this.rolesPrd.getListaTodosSistema().subscribe(datos =>{
      this.arreglo = datos.datos;
      let columnas:Array<tabla> = [new tabla("nombreRol","Rol"),
      new tabla("","Número de usuarios"),
      new tabla("esActivo","Estatus")]
      this.arreglotabla = {
        columnas: columnas,
        filas: this.arreglo
      };
      this.cargando = false;
    });
  }



  public detalle(obj:any){
    this.routerPrd.navigate(['rolesypermisos', 'lista', 'rol'], { state: { datos: obj } });
  }

  public recibirTabla(obj:any){

  }

}
