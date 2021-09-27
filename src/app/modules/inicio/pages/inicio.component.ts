import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EventosService } from 'src/app/modules/eventos/services/eventos.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { ContenidoComponent } from 'src/app/layout/contenido/contenido/contenido.component';


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
  public vistosRec: any = undefined;
  public apareceListadoEventos: boolean = false;
  public vistosTrue: boolean = false;
  public vistosFalse: boolean = false;

  public arreglotabla: any = {
    columnas: [],
    filas: []
  }



  public cargando: boolean = false;
  public eventosCopia: any;


  public arreglo: any = [];
  public vistosRecientesFinal : any = [];
  public arreglosIdSubmodulo : any = [];
  public contratoDesc: string | undefined;

  constructor( private eventoPrd: EventosService,
    private catalogos: CatalogosService, private routerPrd : Router, private reportesPrd: ReportesService, private modalPrd:ModalService,
    private usuariosSistemaPrd: UsuarioSistemaService,public ContenidoComponent:ContenidoComponent, public configuracionPrd: ConfiguracionesService) { }

  ngOnInit(): void {
    
    this.cargando = true;
    this.idEmpresa = this.usuariosSistemaPrd.getIdEmpresa();

    if(this.configuracionPrd.VISTOS_RECIENTE.length != 0){
      this.vistosTrue = true;
      this.vistosFalse = false;
      this.vistosRec = this.configuracionPrd.VISTOS_RECIENTE;

      for(let item of this.vistosRec){

        if(this.arreglosIdSubmodulo.length != 0 && this.arreglosIdSubmodulo.length <= 5){
            this.contratoDesc = this.arreglosIdSubmodulo.find((itemvisto: any) => itemvisto.submoduloId === item.submoduloId)?.nombreSubmodulo;
            if(this.contratoDesc !== undefined)
            continue;
            this.arreglosIdSubmodulo.push(item);
 

        }else{
            this.arreglosIdSubmodulo.push(item);
        }
      } 
    }else{
      this.vistosFalse = true;
      this.vistosTrue = false;
      this.vistosRec = {
        ...this.vistosRec,
        icono: "icon_home",
        nombreModulo: "Inicio"
      }

      this.arreglosIdSubmodulo.push(this.vistosRec);
    } 

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

     // this.filtrandoEventos();
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

  public enbase()
  {
    let string = "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"
    this.reportesPrd.crearArchivo(string,"archivo","xlsx");
  }

}
