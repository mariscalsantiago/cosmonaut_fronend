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
