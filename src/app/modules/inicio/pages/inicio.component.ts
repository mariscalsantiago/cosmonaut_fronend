import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EventosService } from 'src/app/modules/eventos/services/eventos.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  public arreglopintar: any = [false];
  public idEmpresa: number = -1;
  public valor: any;
  public eventos: any;
  public apareceListadoEventos: boolean = false;
  public arreglotabla: any = {
    columnas: [],
    filas: []
  }



  public cargando: boolean = false;
  public eventosCopia: any;


  public arreglo: any = [];

  constructor( private eventoPrd: EventosService,
    private catalogos: CatalogosService, private routerPrd : Router, private reportesPrd: ReportesService, private modalPrd:ModalService,
    private usuariosSistemaPrd: UsuarioSistemaService, public configuracionPrd: ConfiguracionesService) { }

  ngOnInit(): void {

    this.cargando = true;
    this.idEmpresa = this.usuariosSistemaPrd.getIdEmpresa();


  }

  public iniciarDescarga(){
    
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

      if (this.arreglo !== undefined) {
        let temporal = JSON.stringify(this.arreglo);

      }else{
        this.arreglotabla.filas = this.arreglotabla;
      }


      this.cargando = false;
     

      this.eventos = datos.datos;
      this.eventosCopia = datos.datos;

      this.filtrandoEventos();
    });
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

  public verdetalle(obj:any){
    
    this.configuracionPrd.accesoRuta = true;
    this.routerPrd.navigate(['/eventos/eventosxempleado']);

    setTimeout(() => {
      if (!this.configuracionPrd.cargandomodulo) {
        setTimeout(() => {
          this.configuracionPrd.accesoRuta = false;
        }, 10);
      }
  
    }, 10);
   
  }

  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "fecha":
        this.calcularFechasEventos(obj.datos);
        break;
    }

  }

}
