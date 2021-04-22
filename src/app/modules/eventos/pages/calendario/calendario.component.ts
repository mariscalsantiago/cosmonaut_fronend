import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EventosService } from '../../services/eventos.service';

@Component({
  selector: 'app-calendarioevento',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  public apareceListadoEventos: boolean = false;
  public arreglotabla: any = {
    columnas: [],
    filas: []
  }


  public arregloEventos: any = [];
  public arregloAreas: any = [];
  public cargando:boolean = false;
  public eventos:any;


  public arreglo:any = [];

  constructor(private ventana: VentanaemergenteService, private eventoPrd: EventosService,
    private areasPrd: SharedAreasService, private catalogos: CatalogosService,
    private usuariosSistemaPrd: UsuarioSistemaService) { }

  ngOnInit(): void {

    this.catalogos.getTipoIncidencia(true).subscribe(datos => {
      this.arregloEventos = datos.datos;
      
    });

    this.areasPrd.getAreasByEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
      this.arregloAreas = datos.datos;
      
    });


    let fechaActual = new Date();
    
    
    
    //this.calcularFechasEventos(fechaActual);
    

    this.cargando = true;

    this.eventoPrd.getByIdEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos =>{

      this.arreglo = datos.datos;

      
      let columnas:Array<tabla> = [
        new tabla("incidenciaDescripcion","Tipo de evento"),
        new tabla("nombrecompleado","Empleado"),
        new tabla("fechaInicio","Fecha inicio",false,false,true),
        new tabla("fechaInicio","Fecha fin",false,false,true),
        new tabla("duracion","Duraciòn",false,false,true)
      ];

      this.arreglotabla = {
        columnas:[],
        filas:[]
      }

      if(this.arreglo !== undefined){
          for(let item of this.arreglo){
              item["nombrecompleado"] = `${item.nombre} ${item.apellidoPaterno} ${item.apellidoMaterno == undefined ? "":item.apellidoMaterno}`;
              var datePipe = new DatePipe("es-MX");
              item.fechaInicio = (new Date(item.fechaInicio).toUTCString()).replace(" 00:00:00 GMT", "");
              item.fechaInicio = datePipe.transform(item.fechaInicio, 'dd-MMM-y')?.replace(".","");

              item.fechaFin = (new Date(item.fechaFin).toUTCString()).replace(" 00:00:00 GMT", "");
              item.fechaFin = datePipe.transform(item.fechaFin, 'dd-MMM-y')?.replace(".","");
          }
      }
 
      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = this.arreglo;

      this.cargando = false;
    });


  }


  public calcularFechasEventos(fechaActual:Date){
    let inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    let finalMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    let obj = {
      clienteId: this.usuariosSistemaPrd.getIdEmpresa(),
      fechaInicio: inicioMes.getTime(),
      fechaFin: finalMes.getTime()
    }



    this.eventoPrd.filtro(obj).subscribe(datos =>{
      this.eventos = datos.datos;
    });
  }

  public recibirTabla(obj:any){

    switch(obj.type){
        case "fecha":
             this.calcularFechasEventos(obj.datos);
          break;
    }

  }

  

  

}
