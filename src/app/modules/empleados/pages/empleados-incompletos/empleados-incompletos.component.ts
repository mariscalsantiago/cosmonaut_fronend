import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-empleados-incompletos',
  templateUrl: './empleados-incompletos.component.html',
  styleUrls: ['./empleados-incompletos.component.scss']
})
export class EmpleadosIncompletosComponent implements OnInit {

  public cargando:boolean = false;
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };
  constructor(private empleadosPrd:EmpleadosService,private usuariosSistemaPrd:UsuarioSistemaService ,
    private router:Router) { }

  ngOnInit(): void {

    this.cargando = true;

    this.empleadosPrd.getEmpleadosIncompletos(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos =>{
      
      const columnas:Array<tabla> = [
        new tabla("rfc","RFC"),
        new tabla("nombre","Nombre"),
        new tabla("apellidoPaterno","Apellido paterno"),
        new tabla("esActivo","Estatus")
      ]; 


      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = datos.datos;


      this.cargando = false;

    });

  }


  public recibirTabla(obj:any){
    
    this.router.navigate(['empleados/empleado'],{state:{datos:obj.datos}});

  }

}
