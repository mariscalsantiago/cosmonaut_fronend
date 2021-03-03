import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-listaempleados',
  templateUrl: './listaempleados.component.html',
  styleUrls: ['./listaempleados.component.scss']
})
export class ListaempleadosComponent implements OnInit {

  public personaId: any = "";
  public nombre: any = "";
  public apellidoPaterno = "";
  public apellidoMaterno = "";
  public idarea: any = "";
  public idPuesto: any = "";
  public empresa: any = "";
  public estatus: any = "";

  public idEmpresa: number = -1;
  public arregloEmpresa: any = [];
  public arregloAreas: any = [];
  public arregloPuestos: any = [];


  public arreglo: any = [];
  public cargando: boolean = false;

  public arreglotabla: any = {
    columnas: [],
    filas: []
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  public tamanio: number = 0;

  constructor(private routerPrd: Router, private empleadosPrd: EmpleadosService,
    private usuarioSistemaPrd: UsuarioSistemaService, private empresasPrd: SharedCompaniaService,
    private areasPrd: SharedAreasService) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.empleadosPrd.getEmpleadosCompania(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => {
      let columnas: Array<tabla> = [
        new tabla("nombre", "Nombre", true, true),
        new tabla("personaId", "Número de empleado"),
        new tabla("nombreEmpresa", "Empresa"),
        new tabla("puesto", "Puesto"),
        new tabla("area", "Área"),
        new tabla("sede", "Sede"),
        new tabla("esActivo", "Estatus")
      ]

      let arrayTemp = [];

      if (datos.datos !== undefined) {
        for (let item of datos.datos) {

          let obj = {
            nombre: item.personaId.nombre + " " + item.personaId.apellidoPaterno + " " + (item.personaId.apellidoMaterno == undefined? "":item.personaId.apellidoMaterno),
            personaId: item.personaId.personaId,
            puesto: item.puestoId.descripcion,
            area: item.areaId.descripcion,
            sede: item.sedeId.descripcion,
            esActivo: item.personaId.esActivo,
            nombreEmpresa: "DEFINIR"
          }

          arrayTemp.push(obj);

        }
      }

      this.arreglo = arrayTemp.length == 0 ? undefined : arrayTemp;

      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = this.arreglo;
      this.cargando = false;
    });


    this.idEmpresa = this.usuarioSistemaPrd.getIdEmpresa();
    this.empresasPrd.getAllEmp(this.idEmpresa).subscribe(datos => this.arregloEmpresa = datos.datos);
    this.areasPrd.getAreasByEmpresa(this.idEmpresa).subscribe(datos => this.arregloAreas = datos.datos);
    this.areasPrd.getPuestosPorEmpresa(this.idEmpresa).subscribe(datos => this.arregloPuestos = datos.datos);

  }


  public agregar() {

    this.routerPrd.navigate(['/empleados/empleado']);


  }


  public recibirTabla(obj: any) {
    switch (obj.type) {

      case "columna":
        this.routerPrd.navigate(['empleados', obj.datos.personaId, 'personal']);
        break;

    }

  }


  public bajaEmpleado() {
    this.routerPrd.navigate(['empleados', 'bajaempleado']);
  }

  public filtrar() {
   let objenviar =  {
      areaId: {
          areaId: this.idarea
      },
      puestoId: {
          puestoId: this.idPuesto
      },
      personaId: {
          nombre: this.nombre,
          apellidoPaterno:this.apellidoPaterno,
          apellidoMaterno:this.apellidoPaterno
      },
      centrocClienteId: {
          centrocClienteId: (this.empresa == "" || this.empresa == undefined || this.empresa == null)?this.idEmpresa:this.empresa
      },
      esActivo:this.estatus,
      numEmpleado:this.personaId
  }

    this.cargando = true;
    this.empleadosPrd.filtrar(objenviar).subscribe(datos =>{
      let columnas: Array<tabla> = [
        new tabla("nombre", "Nombre", true, true),
        new tabla("idPersona", "Número de empleado"),
        new tabla("razonSocial", "Empresa"),
        new tabla("puesto", "Puesto"),
        new tabla("area", "Área"),
        new tabla("sede", "Sede"),
        new tabla("estatus", "Estatus")
      ];

      if(datos.datos !== undefined){
        for(let item of datos.datos){
            item["nombre"]=`${item["nombre"]} ${item["apellidoPaterno"]} ${item["apellidoMaterno"]==undefined?"":item["apellidoMaterno"]}`;
        }
      }


      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = datos.datos;

      this.cargando = false;
    });
  }

}
