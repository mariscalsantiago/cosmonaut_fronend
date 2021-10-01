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
