import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})

export class MovimientosComponent implements OnInit {

  public empresa: any;
  public arregloEmpresa: any = [];
  public cargandoIcon: boolean = false;
  public cargando: boolean = false;
  public arreglotabla: any = {
    columnas: [],
    filas: []
  }
  public arreglotablaDesglose:any = {
      columnas:[],
      filas:[]
  };



  constructor(private empresasPrd: EmpresasService, private usauriosSistemaPrd: UsuarioSistemaService,
    private modalPrd:ModalService) { }

  ngOnInit(): void {
    this.empresasPrd.getAllEmp(this.usauriosSistemaPrd.getIdEmpresa()).subscribe(datos => {
      this.arregloEmpresa = datos.datos;
    });


    this.traerTabla();
  }

  public traerTabla() {
    const columna: Array<tabla> = [
      new tabla("nombre", "Nombre de usuario"),
      new tabla("rol", "Rol"),
      new tabla("modulo", "Módulo"),
      new tabla("movimiento", "Movimiento"),
      new tabla("fecha", "Fecha de movimiento")
    ];


    this.arreglotabla.columnas = columna;
    this.arreglotabla.filas = [{
      nombre : "Mayte Delacrúz Nieto",
      rol : "Administrador de recursos humanos ",
      modulo : "Empleados",
      movimiento : "Regitró empleado",
      fecha : "18/05/2021"
    }];
  }


  public filtrar() {

  }


}
