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
