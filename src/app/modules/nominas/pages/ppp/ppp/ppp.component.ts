import { DatePipe } from '@angular/common';
import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { CheckboxComponent } from 'ng-uikit-pro-standard';
import { type } from 'os';
import { tabla } from 'src/app/core/data/tabla';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { checkServerIdentity } from 'tls';


@Component({
  selector: 'app-ppp',
  templateUrl: './ppp.component.html',
  styleUrls: ['./ppp.component.scss']
})
export class PPPComponent implements OnInit {



  public cargando: Boolean = false;
  public tipoguardad: boolean = false;
  public idEmpresa: number = 0;
  public arregloUsuario : any = [];
  /*
    Directivas de filtros
  */


  public idEmpresaActual: number = 0;
  public numeroEmpleado: any = "";
  public nombreEmpleado: any = "";
  public primerApellidoEmpleado: any="";
  public segundoApellidoEmpleado: any="";
  public grupoNomina: number = 0;

  /*
  
    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arregloEmpresa: any = [];
  public arregloGrupoNomina: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;



  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public activarMultiseleccion: boolean = false;


  constructor(private routerPrd: Router,
    private companiPrd: SharedCompaniaService, private modalPrd: ModalService,private usuarioSistemaPrd:UsuarioSistemaService,
    private reportesPrd: ReportesService,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    let documento: any = document.defaultView;
    this.idEmpresa = this.usuarioSistemaPrd.getIdEmpresa();
    this.tamanio = documento.innerWidth;
    this.cargando = true;
    this.filtrar();
    this.reportesPrd.getListaEmpresaPPP(this.idEmpresa).subscribe(datos => this.arregloEmpresa = datos.datos);
    this.reportesPrd.getListaGrupoNominaPPP(this.idEmpresa).subscribe(datos => this.arregloGrupoNomina = datos.datos);

  }

  public procesarTabla(datos: any) {
    
    this.arreglo = datos.datos;
    let columnas: Array<tabla> = [
      //new tabla("personaId", "ID", false, false, true),
      new tabla("numeroEmpleado", "Número de empleado"),
      new tabla("nombreEmpresa", "Empresa"),
      new tabla("grupoNomina", "Grupo de nómina"),
      new tabla("nombreEmpleado", "Nombre"),
      new tabla("pagoComplementario", "Pago complementario"),
    ]



    this.arreglotabla = {
      columnas: [],
      filas: []
    };
    if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        if(item.pagoComplementario !== undefined ){
          const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
          })
          item.pagoComplementario = formatter.format(item.pagoComplementario)
        }
      }
    }
    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
  }



  public seleccionarTodosBool(input: any) {
    
    for (let item of this.arreglo)
        if(item.personaId){
        input.checkbox = input.checked;
        let checkboxes  = document.getElementsByName('ajusteirs');
        }
      }



  public guardarMultiseleccion() {

    
    let mensaje = `¿Deseas descargar el layaut de lo seleccionado?`;

    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {

        let valor = [];
        for (let item of this.arreglo) {

          if (item["seleccionado"]) {

            valor.push(item.personaId);

          }
        }
        this.arregloUsuario = { 
          idEmpresa: this.idEmpresa,
          listaIdEmpleados: valor
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        this.reportesPrd.getDescargaLayaoutPPP(this.arregloUsuario).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          const linkSource = 'data:application/xlsx;base64,' + `${archivo.datos}\n`;
          const downloadLink = document.createElement("a");
          const fileName = `${"Layaout PPP"}.xlsx`;
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
          if (archivo) {
            for (let item of this.arregloUsuario.listaIdEmpleados) {
              for (let item2 of this.arreglo) {
                if (item2.personaId === item) {
                  item2["seleccionado"] = false;
                  break;
                }
              }
            }
            this.activarMultiseleccion = false;
          }
        });
      }
    });



  }





  public filtrar() {
    
    this.cargando = true;
      let peticion = {
      numeroEmpleado: this.numeroEmpleado,
      nombreEmpleado: this.nombreEmpleado,
      primerApellidoEmpleado: this.primerApellidoEmpleado,
      segundoApellidoEmpleado: this.segundoApellidoEmpleado,
      grupoNomina: this.grupoNomina,
      idEmpresa: this.idEmpresa,
      idEmpresaActual: this.idEmpresaActual
    }
    
    
    
    this.reportesPrd.getFiltroDinamicoPPP(peticion).subscribe(datos => {
      this.arreglo = datos.datos;

      this.procesarTabla({ datos: this.arreglo });

      this.cargando = false;
    });

  }


  public recibirTabla(obj: any) {
    

    switch (obj.type) {
      case "filaseleccionada":
        this.activarMultiseleccion = obj.datos;
        break;

    }

  }


}








