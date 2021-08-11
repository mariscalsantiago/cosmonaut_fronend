import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { NominasHistoricasService } from 'src/app/shared/services/nominas/nominas-historicas.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-nomina-historicas',
  templateUrl: './nomina-historicas.component.html',
  styleUrls: ['./nomina-historicas.component.scss']
})
export class NominaHistoricasComponent implements OnInit {


  public arreglotabla: any =
    {
      columnas: [],
      filas: []
    }

  public cargando: boolean = false;

  public nombreNomina: string = "";
  public periodo: string = "";
  public fecha: string = "";


  constructor(private nominashistoricasPrd: NominasHistoricasService, private usuarioSistemaPrd: UsuarioSistemaService,
    public configuracionPrd: ConfiguracionesService, private reportesPrd: ReportesService,
    private modalPrd: ModalService) { }

  ngOnInit(): void {
    let objEnviar = {
      clienteId: this.usuarioSistemaPrd.getIdEmpresa()
    }

    this.cargando = true;

    this.nominashistoricasPrd.getNominasHistoricas(objEnviar).subscribe(datos => {
      this.rellenarTablas(datos);

      this.cargando = false;

    });
  }

  public rellenarTablas(datos:any){
    let columnas: Array<tabla> = [new tabla("nombre_nomina", "Nombre de nómina"),
    new tabla("clave_periodo", "Clave de periodo"),
    new tabla("anio", "Año"),
    new tabla("fechai", "Fecha")
    ];

    if (datos.datos !== undefined) {
      for (let item of datos.datos) {
        item["anio"] = new DatePipe("es-MX").transform(item.fecha_inicio, "yyyy");
        item["fechai"] = new DatePipe("es-MX").transform(item.fecha_inicio, "dd/MM/yyyy");
      }
    }


    this.arreglotabla = {
      columnas: columnas,
      filas: datos.datos
    }
  }





  public recibirTabla(obj: any) {
    obj.datos.cargandoDetalle = false;

    

    let objEnviar: any;

    switch (obj.type) {
      case "polizacontable":
        alert("Poliza contable");
        break;
      case "detallenomina":
        alert("detlale nomina");
        break;
      case "nomina":
        alert("nomina");
        break;
      case "fotos":
        objEnviar = {
          nominaXperiodoId: obj.datos.nominaXperiodoId,
          listaIdPersona: [
    
          ]
        }

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.reportesPrd.getFoliosnominaConcluir(objEnviar).subscribe(objrecibido => {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          if (objrecibido.resultado) {
            this.reportesPrd.crearArchivo(objrecibido.datos, `Foliosfiscales_${obj.datos.nombreNomina}_${obj.datos.clavePeriodo}`, "pdf");
          } else {
            this.modalPrd.showMessageDialog(objrecibido.resultado, objrecibido.mensaje);
          }
        });
        break;
      case "reportenomina":
        alert("reporte nomina")
        break;
      case "reportepolizacontable":
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.reportesPrd.getHistoricoPolizaContable(obj.datos.nominaXperiodoId).subscribe(datos => {
            if(datos.resultado){
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.reportesPrd.crearArchivo(datos.datos, `ReportePólizaContable_${obj.datos.clavePeriodo}_${obj.datos.nombreNomina}`, "xlsx");
            }else{
                this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
            }
        });
        break;
      case "recibonominazip":
        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        objEnviar = {
          nominaPeriodoId: obj.datos.nominaXperiodoId,
          esVistaPrevia: false,
          esTimbrado: true
        };

        this.reportesPrd.getComprobanteFiscalXML(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          if(datos.resultado){
            this.reportesPrd.crearArchivo(datos.datos, `RecibosNómina_${obj.datos.clavePeriodo}_${obj.datos.nombreNomina}`, "zip");
          }else{
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
          }
        });
        break;
      case "cancelartimbrado":
        alert("cancelartimbrado");
        break;
    }
  }


  public filtrar() {

      let objEnviar = {
        nombre: this.nombreNomina || undefined,
        clavePeriodo: this.periodo || undefined,
        fechaInicio: this.fecha || undefined
      }

      this.cargando = true;
      this.nominashistoricasPrd.filtrado(objEnviar).subscribe(datos =>{

        this.rellenarTablas(datos);
        this.cargando = false;
      });
  }
}
