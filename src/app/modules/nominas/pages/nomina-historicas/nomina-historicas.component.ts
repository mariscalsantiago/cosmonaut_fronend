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

  public anioactual:number = new Date().getFullYear();

  public mes:string[] = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  public reporteindex:number = 1;
  public mesIndex:number = 0;
   




  constructor(private nominashistoricasPrd: NominasHistoricasService, private usuarioSistemaPrd: UsuarioSistemaService,
    public configuracionPrd: ConfiguracionesService, private reportesPrd: ReportesService,
    private modalPrd: ModalService) { }

  ngOnInit(): void {
    let objEnviar = {
      clienteId: this.usuarioSistemaPrd.getIdEmpresa()
    }
    this.cargando = true;
    this.filtrar();  
  }

  public rellenarTablas(datos: any) {
    
    let columnas: Array<tabla> = [new tabla("nombre_nomina", "Nombre de nómina"),
    new tabla("clave_periodo", "Clave de periodo"),
    new tabla("anio", "Año"),
    new tabla("fechai", "Fecha")
    ];

    if (datos.datos !== undefined) {
      for (let item of datos.datos) {
        console.log(item);
        item["anio"] = new DatePipe("es-MX").transform(item.fecha_inicio, "yyyy");
        item["fechai"] = new DatePipe("es-MX").transform(item.fecha_inicio, 'dd/MM/yyyy');
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
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.reportesPrd.nominaHistorica(obj.datos.nomina_xperiodo_id).subscribe(objrecibido => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          if (!objrecibido.resultado) {
            this.modalPrd.showMessageDialog(objrecibido.resultado, objrecibido.mensaje);
          } else {
            this.reportesPrd.crearArchivo(objrecibido.datos, `Detallenomina_${obj.datos.nombre_nomina}_${obj.datos.clave_periodo}`, "pdf");
          }
        });
        break;
      case "nomina":
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.reportesPrd.nominaReporteRaya(obj.datos.nomina_xperiodo_id).subscribe(objrecibido => {
          if (objrecibido.resultado) {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.reportesPrd.crearArchivo(objrecibido.datos, `reportenomina_${obj.datos.nombre_nomina}_${obj.datos.clave_periodo}`, "pdf");
          } else {
            this.modalPrd.showMessageDialog(objrecibido.resultado, objrecibido.mensaje);
          }
        });
        break;
      case "fotos":
        objEnviar = {
          nominaXperiodoId: obj.datos.nomina_xperiodo_id,
          listaIdPersona: [

          ]
        }

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.reportesPrd.getFoliosnominaConcluir(objEnviar).subscribe(objrecibido => {
          if (objrecibido.resultado) {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.reportesPrd.crearArchivo(objrecibido.datos, `Foliosfiscales_${obj.datos.nombre_nomina}_${obj.datos.clave_periodo}`, "pdf");
          } else {
            this.modalPrd.showMessageDialog(objrecibido.resultado, objrecibido.mensaje);
          }
        });
        break;
      case "reportenomina":
        objEnviar = {
          nominaPeriodoId: obj.datos.nomina_xperiodo_id
        }


        let esnormal: boolean = true;
        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        if (esnormal) {
          this.reportesPrd.getReporteNominasTabCalculados(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.reportesPrd.crearArchivo(datos.datos, `ReporteNomina_${obj.datos.nombre_nomina}_${obj.datos.clave_periodo}`, "xlsx");
          });
        } else {
          this.reportesPrd.getReporteNominasTabCalculadosEspeciales(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.reportesPrd.crearArchivo(datos.datos, `ReporteNomina_${obj.datos.nombre_nomina}_${obj.datos.clave_periodo}`, "xlsx");
          });
        }
        break;
      case "reportepolizacontable":
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.reportesPrd.getHistoricoPolizaContable(obj.datos.nomina_xperiodo_id).subscribe(datos => {
          if (datos.resultado) {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.reportesPrd.crearArchivo(datos.datos, `ReportePólizaContable_${obj.datos.clavePeriodo}_${obj.datos.nombreNomina}`, "xlsx");
          } else {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
          }
        });
        break;
      case "recibonominazip":
        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        objEnviar = {
          nominaPeriodoId: obj.datos.nomina_xperiodo_id,
          esZip: true
        };

        if(Boolean(obj.datos.esExtraordinaria)){
          this.reportesPrd.getComprobanteFiscalXMLExtraordinarias(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            if (datos.resultado) {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.reportesPrd.crearArchivo(datos.datos, `RecibosNómina_${obj.datos.clave_periodo}_${obj.datos.nombre_nomina}`, "zip");
            } else {
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
            }
          });
        }else{
          this.reportesPrd.getComprobanteFiscalXMLOrdinarias(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            if (datos.resultado) {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.reportesPrd.crearArchivo(datos.datos, `RecibosNómina_${obj.datos.clave_periodo}_${obj.datos.nombre_nomina}`, "zip");
            } else {
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
            }
          });
        }

       
        break;
      case "reporteAcumuladosPorMes":
         objEnviar = {
          mes:new DatePipe("es-MX").transform(obj.datos.fecha_inicio,"MM"),
          clienteId:this.usuarioSistemaPrd.getIdEmpresa()
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.nominashistoricasPrd.acumuladosPorMes(objEnviar).subscribe(datos =>{
          if (datos.resultado) {
            
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.reportesPrd.crearArchivo(datos.datos, `Acumuladospormes_${new DatePipe("es-MX").transform(obj.datos.fecha_inicio,"MM")}`, "xlxs");
          } else {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
          }
        });
        break;
      case "reporteAcumuladosPorConcepto":
        objEnviar = {
          mes:new DatePipe("es-MX").transform(obj.datos.fecha_inicio,"MM"),
          centroCostoClienteId:this.usuarioSistemaPrd.getIdEmpresa()
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.nominashistoricasPrd.acumuladosPorMes(objEnviar).subscribe(datos =>{
          if (datos.resultado) {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.reportesPrd.crearArchivo(datos.datos, `Acumuladospormes_${new DatePipe("es-MX").transform(obj.datos.fecha_inicio,"MM")}`, "pdf");
          } else {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
          }
        });
        break;
    }
  }


  public obtenerReportes(){
    let objEnviar:any;
       switch(`${this.reporteindex}`){
        case "1":
          objEnviar = {
           mes:Number(this.mesIndex)+1,
           clienteId:this.usuarioSistemaPrd.getIdEmpresa()
         }
 
 
         this.modalPrd.showMessageDialog(this.modalPrd.loading);
         this.nominashistoricasPrd.acumuladosPorMes(objEnviar).subscribe(datos =>{
           if (datos.resultado) {
             this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
             this.reportesPrd.crearArchivo(datos.datos, `Acumuladospormes_${this.mesIndex}`, "xlsx");
           } else {
             this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
           }
         });
         break;
       case "2":
         objEnviar = {
           mes:Number(this.mesIndex)+1,
           centroCostoClienteId:this.usuarioSistemaPrd.getIdEmpresa()
         }
 
 
         this.modalPrd.showMessageDialog(this.modalPrd.loading);
         this.nominashistoricasPrd.acumuladosPorConceptos(objEnviar).subscribe(datos =>{
           if (datos.resultado) {
             this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
             this.reportesPrd.crearArchivo(datos.datos, `Acumuladospormes_${this.mesIndex}`, "pdf");
           } else {
             this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
           }
         });
         break;
       }
  }


  public filtrar() {

    console.log(this.fecha,"Esta es la fecha");

    let objEnviar = {
      centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa(),
      estadoNominaIdActual: 5,
      nombreNomina: this.nombreNomina || null,
      clavePeriodo: this.periodo || null,
      fechaInicio: this.fecha || null
    }

    console.log("Fcha de inicio",objEnviar);

    this.cargando = true;
    this.nominashistoricasPrd.filtrado(objEnviar).subscribe(datos => {

      this.rellenarTablas(datos);
      this.cargando = false;
    });
  }
}
