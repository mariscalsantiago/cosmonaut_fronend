import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
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



  public cargando: boolean = false;
  public eventos: any;
  public eventosCopia: any;
  public colapsar: boolean = false;


  public arreglo: any = [];

  public modulo: string = "";
  public subModulo: string = "";

  constructor(private ventana: VentanaemergenteService, private eventoPrd: EventosService,
    private areasPrd: SharedAreasService, private catalogos: CatalogosService,
    private usuariosSistemaPrd: UsuarioSistemaService, public configuracionPrd: ConfiguracionesService) { }

  ngOnInit(): void {
    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();


    this.cargando = true;


  }


  public calcularFechasEventos(fechaActual: Date) {
    let inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    let finalMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    let obj = {
      clienteId: this.usuariosSistemaPrd.getIdEmpresa(),
      fechaInicio: inicioMes.getTime(),
      fechaFin: finalMes.getTime(),
      esActivo: true
    }



    this.eventoPrd.filtro(obj).subscribe(datos => {

      
      this.arreglo = datos.datos;



      let columnas: Array<tabla> = [
        new tabla("incidenciaDescripcion", "Tipo de evento"),
        new tabla("nombrecompleado", "Empleado"),
        new tabla("fechaInicioTemp", "Fecha inicio", false, false, true),
        new tabla("fechaFinTemp", "Fecha fin", false, false, true),
        new tabla("duracion", "Duraciòn", false, false, true)
      ];

    

      let aux:any = undefined;
      if (this.arreglo) {
        let temporal = JSON.stringify(this.arreglo);
        aux = JSON.parse(temporal);

        for (let item of aux) {

          item["nombrecompleado"] = `${item.nombre} ${item.apellidoPaterno} ${item.apellidoMaterno == undefined ? "" : item.apellidoMaterno}`;

          if(item.fechaInicio !== undefined ){
            item["fechaInicioTemp"] = new DatePipe("es-MX").transform(new Date(item.fechaInicio), 'dd-MMM-y');
          }
          if(item.fechaFin !== undefined ){
            item["fechaFinTemp"] = new DatePipe("es-MX").transform(new Date(item.fechaFin), 'dd-MMM-y');
          }
        }
       
      }


      this.arreglotabla = {
        columnas:columnas,
        filas:aux
      }
  
      this.cargando = false;
     

      this.eventos = datos.datos;
      this.eventosCopia = datos.datos;

      this.filtrandoEventos();
    });
  }

  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "fecha":
        this.calcularFechasEventos(obj.datos);
        break;
    }

  }


  public cambiaValor() {
    this.filtrandoEventos();
  }

  public colapsarmtd() {
    this.colapsar = !this.colapsar;

  }


  public filtrandoEventos() {
    let hijosEventos: any = document.getElementById("eventoscheckbox")?.getElementsByTagName("input");

    let arrayFiltrado: any[] = [];
    for (let item of hijosEventos) {
      if (item.checked) {
        let mm = `${item.id}`.replace("e", "");
        if (mm.includes("-")) {
          arrayFiltrado.push(Number(mm.split("-")[0]));
          arrayFiltrado.push(Number(mm.split("-")[1]));
          continue;
        }

        arrayFiltrado.push(Number(mm));
      }
    }



    this.eventos = [];
    Object.values(this.eventosCopia).forEach((valor: any) => {
     
      if (arrayFiltrado.includes(valor.tipoIncidenciaId)) {
        this.eventos.push(valor);
      }
    });

  }


}
