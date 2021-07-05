import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpleadosService } from '../../services/empleados.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

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


  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esDescargar:boolean = false;



 



  public tamanio: number = 0;

  constructor(private routerPrd: Router, private empleadosPrd: EmpleadosService, private reportesPrd: ReportesService,
    private usuarioSistemaPrd: UsuarioSistemaService,private modalPrd:ModalService, private empresasPrd: SharedCompaniaService,
    private areasPrd: SharedAreasService,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {

    
    this.establecerPermisos();

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;



    this.idEmpresa = this.usuarioSistemaPrd.getIdEmpresa();
    this.empresasPrd.getAllEmp(this.idEmpresa).subscribe(datos => this.arregloEmpresa = datos.datos);
    this.areasPrd.getAreasByEmpresa(this.idEmpresa).subscribe(datos => this.arregloAreas = datos.datos);
    this.areasPrd.getPuestosPorEmpresa(this.idEmpresa).subscribe(datos => this.arregloPuestos = datos.datos);

    this.filtrar();

  }


  public establecerPermisos(){
    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionPrd.getPermisos("Consultar");
    this.esEditar = this.configuracionPrd.getPermisos("Editar");
    this.esDescargar = this.configuracionPrd.getPermisos("Descargar");
  }



  public agregar() {

    this.routerPrd.navigate(['/empleados/empleado']);


  }


  public recibirTabla(obj: any) {
    switch (obj.type) {

      case "columna":
        this.routerPrd.navigate(['empleados', obj.datos.idPersona, 'personal']);
        break;

    }

  }


  public bajaEmpleado() {
    this.routerPrd.navigate(['empleados', 'bajaempleado']);
  }

  public descargarEmpleados(){
    
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

  
        this.reportesPrd.getDescargaListaEmpleados(this.idEmpresa).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          const linkSource = 'data:application/xlsx;base64,' + `${archivo.datos}\n`;
          const downloadLink = document.createElement("a");
          const fileName = `${"Empleados"}.xlsx`;
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        });
  
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
          apellidoMaterno:this.apellidoMaterno
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
        new tabla("nombre", "Nombre", this.esConsultar, this.esConsultar),
        new tabla("numeroEmpleado", "Número de empleado",false,false,true),
        new tabla("razonSocial", "Empresa"),
        new tabla("puesto", "Puesto"),
        new tabla("area", "Área"),
        new tabla("sede", "Sede"),
        new tabla("estatus", "Estatus",false,false,true),
        new tabla("porcentaje","Porcentaje de avance")
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
