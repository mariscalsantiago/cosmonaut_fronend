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
  public arreglo: any = [];
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
    debugger;

    this.filtrar();
  }

  public traerTabla(obj:any) {

    this.arreglo = obj.datos;

    const columnas: Array<tabla> = [
      new tabla("nombre", "Nombre de usuario"),
      new tabla("rol", "Rol"),
      new tabla("modulo", "Módulo"),
      new tabla("movimiento", "Movimiento"),
      new tabla("fecha", "Fecha de movimiento")
    ];


    this.arreglotabla = {
      columnas:[],
      filas:[]
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }


  public filtrar() {

 
      let peticion = {
        
          centroClienteId: 1
      }
      
      
      this.cargando = true;
      this.empresasPrd.bitacoraMovimientoslistar(peticion).subscribe(datos => {
          this.traerTabla(datos);
      });
      /*}else{
        this.cargando = true;
        this.empresasPrd.bitacoraMovimientoslistar(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado).subscribe(datos => {
            this.traerTabla(datos);
        });
      });
      }*/
  
    }

  }



