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
