import { Component, HostListener, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KardexService } from 'src/app/modules/empleados/services/kardex.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';


@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss']
})
export class KardexComponent implements OnInit {

  public tamanio:number = 0;
  public cargando : Boolean = false;
  public arreglo: any = [];
  public cargandoIcon: boolean= false;
  public idEmpleado: number = 0;
  public idEmpresa: number = 0;

  
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  public arreglotablaDesglose:any = {
    columnas:[],
    filas:[]
};

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;
    this.tamanio = event.target.innerWidth;
  }



  constructor(private routerPrd: Router, private kardexPrd: KardexService,private modalPrd:ModalService, 
    private router:ActivatedRoute,private usuariosSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {

    
    debugger;
    this.router.params.subscribe(params => {
      this.idEmpleado = params["id"];
    });
  
    this.cargando = true;
    this.kardexPrd.getListaDocumentosEmpleado(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado).subscribe(datos => {
        this.crearTabla(datos);
    });


  }


  public crearTabla(datos:any){
    
    this.arreglo = datos.datos;

    
    let columnas: Array<tabla> = [
      new tabla("nombreArchivo", "Tipo de movimiento"),
      new tabla("fechaCargaDocumento", "Fecha de movimiento"),
      new tabla("tipoDocumento", "Registro patronal")
    ]


    this.arreglotabla = {
      columnas:[],
      filas:[]
    }


    if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        item.fechaCarga = (new Date(item.fechaCarga).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaCargaDocumento = datepipe.transform(item.fechaCarga , 'dd-MMM-y')?.replace(".","");

        item.tipoDocumento= item.tipoDocumento?.nombre;
      }
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }

  

  public recibirTabla(obj:any){
    if (obj.type == "editar") {
      let datos = obj.datos;
    }
    if (obj.type == "descargar") {
    }
    if (obj.type == "desglosar") {

            let item = obj.datos;

   
    
              let columnas: Array<tabla> = [
                new tabla("descripcion", "Política"),
                new tabla("funcionCuenta", "Salario diario"),
                new tabla("numInformacion", "Salario diario integrado"),
                new tabla("numInformacion", "Salario base de cotización"),
                new tabla("numSucursal", "Eatatus Empleado")
              ];
              
              item.funcionCuenta = item.funcionCuentaId?.descripcion;
    
    
              this.arreglotablaDesglose.columnas = columnas;
              this.arreglotablaDesglose.filas = item;
    
              item.cargandoDetalle = false;
    
            }

  }


  public filtrar(){

  }





}
