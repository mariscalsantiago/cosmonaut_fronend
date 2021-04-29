import { Component, HostListener, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { truncateSync } from 'fs';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent implements OnInit {

  public tamanio:number = 0;
  public cargando : Boolean = false;
  public arreglo: any = [];
  public cargandoIcon: boolean= false;

  
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;
    this.tamanio = event.target.innerWidth;
  }



  constructor(private routerPrd: Router, private bancosPrd: CuentasbancariasService, private ventana:VentanaemergenteService) { }

  ngOnInit(): void {

    debugger;
    this.cargando = true;
    this.bancosPrd.getListaDeduccionesEmpleado(636,112).subscribe(datos => {
      debugger;
        this.crearTabla(datos);
    });


  }


  public crearTabla(datos:any){
    debugger;
    this.arreglo = datos.datos;

    
    let columnas: Array<tabla> = [
      new tabla("nombre", "Nombre"),
      new tabla("fechaInicioDesctoDed", "Fecha"),
      new tabla("valor", "Tipo de documento")
    ]


    this.arreglotabla = {
      columnas:[],
      filas:[]
    }


    if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        item.fechaInicioDescto = (new Date(item.fechaInicioDescto).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaInicioDesctoDed = datepipe.transform(item.fechaInicioDescto , 'dd-MMM-y')?.replace(".","");
  
        item.nombre = "IFE";
        item.valor = "Identificación oficial"

        if(item.esActivo){
          item.esActivo = true
         }
         if(!item.esActivo){
         item.esActivo = false
         }
      }
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }


  public recibirTabla(obj: any) {
    if (obj.type == "editar") {
      //this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: obj.datos } });
    }
    if (obj.type == "descargar") {
      //this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: obj.datos } });
    }
  }

  public filtrar(){

  }

  public iniciarDescarga() {
    this.cargandoIcon = true;

    //this.empledoContratoPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datos => {
    //let fechacontrato = datos.datos?.fechaContrato;


      /*let objenviar = {
        fechaContrato: fechacontrato,
        "centrocClienteId": {
          "centrocClienteId": datos.datos.centrocClienteId.centrocClienteId
        },
        "personaId": {
          "personaId": datos.datos.personaId.personaId
        }

      }*/

      /*this.reportesPrd.getReportePerfilPersonal(objenviar).subscribe(archivo => {
        this.cargandoIcon = false;
        const linkSource = 'data:application/pdf;base64,' + `${archivo.datos}\n`;
        const downloadLink = document.createElement("a");
        const fileName = `${datos.datos.numEmpleado}-${this.empleado.personaId.nombre.toUpperCase()}_${this.empleado.personaId.apellidoPaterno.toUpperCase()}.pdf`;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      });*/
    //});


  }

  public agregar(){

    this.ventana.showVentana(this.ventana.subirdocumento).then(valor =>{
      if(valor.datos){
        debugger;
          //this.agregarNuevaDeduccion(valor.datos);
      }
    });
  }

}
