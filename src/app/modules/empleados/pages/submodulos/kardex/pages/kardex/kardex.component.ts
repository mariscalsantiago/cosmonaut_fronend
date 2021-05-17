import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';
import { KardexService } from 'src/app/modules/empleados/services/kardex.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss']
})
export class KardexComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  public tamanio:number = 0;
  public cargando:Boolean = false;
  public arreglo: any = [];
  public idEmpleado: number = 0;

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  public arreglotablaDesglose: any = {
    columnas: [],
    filas: []
  };

  constructor(private router:ActivatedRoute, private ksrdexPrd: KardexService, 
    private usuariosSistemaPrd:UsuarioSistemaService) { }


  ngOnInit(): void {

    let documento:any = document.defaultView;
    this.tamanio = documento.innerWidth;

    this.router.params.subscribe(params => {
      this.idEmpleado = params["id"];
    });

    this.cargando = true;
    this.ksrdexPrd.getListaDocumentosEmpleado(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado).subscribe(datos => {
        this.crearTabla(datos);
    });

  }



  public crearTabla(datos:any){
    
    this.arreglo = datos.datos;

    
    let columnas: Array<tabla> = [
      new tabla("nombreArchivo", "Nombre"),
      new tabla("fechaCargaDocumento", "Fecha"),
      new tabla("tipoDocumento", "Tipo de documento")
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

  public filtrar() {
  
  }

}
