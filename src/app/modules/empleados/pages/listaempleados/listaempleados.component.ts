import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { usuarioClass, UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-listaempleados',
  templateUrl: './listaempleados.component.html',
  styleUrls: ['./listaempleados.component.scss']
})
export class ListaempleadosComponent implements OnInit {

  public arreglo:any = [];
  public cargando:boolean = false;

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  public tamanio:number = 0;

  constructor(private routerPrd:Router,private empleadosPrd:EmpleadosService,
    private usuarioSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {

    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.empleadosPrd.getEmpleadosCompania(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos =>{
      console.log("Ver lo que se intera",datos);
      let columnas:Array<tabla> = [
        new tabla("nombre","Nombre",true,true),
        new tabla("personaId","Número de empleado"),
        new tabla("puesto","Puesto"),
        new tabla("area","area"),
        new tabla("sede","Sede"),
      ]

      let arrayTemp = [];

     if(datos.datos !== undefined){
      for(let item of datos.datos){

        let obj = {
          nombre:item.personaId.nombre+" "+item.personaId.apellidoPaterno,
          personaId:item.personaId.personaId,
          puesto:item.puestoId.descripcion,
          area:item.areaId.descripcion,
          sede:item.sedeId.descripcion
        }

        arrayTemp.push(obj);

      }
     }

      this.arreglo = arrayTemp.length == 0 ? undefined:arrayTemp;

      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = this.arreglo;
      this.cargando = false;
    });

  }


  public agregar(){

    this.routerPrd.navigate(['/empleados/empleado']);


  }


  public recibirTabla(obj:any){
    switch(obj.type){

      case "columna":
        this.routerPrd.navigate(['empleados',obj.datos.personaId,'personal']);
        break;

    }

  }


  public bajaEmpleado(){
    this.routerPrd.navigate(['empleados','bajaempleado']);
  }

  public filtrar(){
    
  }

}
