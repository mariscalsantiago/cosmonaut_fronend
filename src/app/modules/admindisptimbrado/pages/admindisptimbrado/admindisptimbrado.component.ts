import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admindisptimbrado',
  templateUrl: './admindisptimbrado.component.html',
  styleUrls: ['./admindisptimbrado.component.scss']
})

export class AdminDispercionTimbradoComponent implements OnInit {

  public empresa: any;

  public idEmpresa: number = 0;
  public arreglo: any = [];
  public cargandoIcon: boolean = false;
  public cargando: boolean = false;
  public objFiltro: any = [];
  public nombre: string = "";
  public cliente: string = "";
  public empresaFiltro: string = "";

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

  ngOnInit() {
    //this.idEmpresa = this.usauriosSistemaPrd.getIdEmpresa();
   this.idEmpresa = 1;
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
    console.log('datos',this.arreglo)
    if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        if(item.fechaMovimiento !== undefined ){
        item.fecha = (new Date(item.fechaMovimiento).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fecha = String(datepipe.transform(item.fecha , 'dd-MMM-y')?.replace(".",""));
        item.nombre = item.nombre + " " + item.apellidoPaterno+" "+(item.apellidoMaterno == undefined ? "":item.apellidoMaterno);
        }
      }
    }
   
    
    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }


  public filtrar() {
    
 
      
        
        this.objFiltro = {
          ...this.objFiltro,
          centroClienteId: this.idEmpresa,

        };
        console.log('moc', this.objFiltro)
      this.empresasPrd.bitacoraMovimientoslistar(this.objFiltro).subscribe(datos => {
   
        
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



