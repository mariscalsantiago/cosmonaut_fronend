import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
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


  public esConsultar:boolean = false;
  public esEditar:boolean = false;

  public modulo: string = "";
  public subModulo: string = "";

  constructor(private empleadosPrd:EmpleadosService,private usuariosSistemaPrd:UsuarioSistemaService ,
    private router:Router,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo.toUpperCase();

    this.cargando = true;

    this.empleadosPrd.getEmpleadosIncompletos(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos =>{
      console.log("empleados incompletos",datos);
      
      const columnas:Array<tabla> = [
        new tabla("rfc","RFC"),
        new tabla("nombre","Nombre"),
        new tabla("apellidoPaterno","Primer apellido")
      ]; 


      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = datos.datos;


      this.cargando = false;

    });



    this.establecerPermisos();
    

  }


  public establecerPermisos(){
    this.esConsultar = this.configuracionPrd.getPermisos("Consultar");
    this.esEditar = this.configuracionPrd.getPermisos("Editar");
  }

  public recibirTabla(obj:any){

    
    
    let isInsertar = false;

    
    this.router.navigate(['empleados/empleado'],{ state: { datos: obj.datos, insertar: isInsertar } });

  }

}
