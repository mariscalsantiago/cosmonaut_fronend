import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { ContratocolaboradorService } from 'src/app/modules/empleados/services/contratocolaborador.service';
import { DocumentosService } from 'src/app/modules/empleados/services/documentos.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { TimbradoEmpleadoService } from '../../services/timbrado-empleado.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timbrado-empleados',
  templateUrl: './timbrado-empleados.component.html',
  styleUrls: ['./timbrado-empleados.component.scss']
})
export class TimbradoEmpleadosComponent implements OnInit {
  public arreglotabla: any = {
    columnas: [],
    filas: []
  }

  public cargando: boolean = false;
  public idEmpleado: number = 0;
  public numeroEmpleado: number = -1;

  public arreglo: any = [];

  public modulo: string = "";
  public subModulo: string = "";

  constructor(public configuracionPrd: ConfiguracionesService, private empleadosPrd: EmpleadosService,
    private modalPrd: ModalService, private usuariosSistemaPrd: UsuarioSistemaService,
    private documentosPrd: DocumentosService, private sobrePadoPrd: TimbradoEmpleadoService, private router: Router,
    private contratoColaboradorPrd: ContratocolaboradorService, private reportesPrd: ReportesService) { }

  ngOnInit(): void {

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    this.cargando = true;
    this.empleadosPrd.getPersonaByCorreo(this.usuariosSistemaPrd.usuario.correo, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
      if (!datos.resultado) {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      } else {
        this.idEmpleado = datos.datos.personaId;

        this.contratoColaboradorPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datocontrato => {
          this.numeroEmpleado = datocontrato.datos.numEmpleado;
          let objenviar = {
            personaId: this.idEmpleado,
            fechaContratoNogrupo: datocontrato.datos.fechaContrato,
            centrocClienteId: this.usuariosSistemaPrd.getIdEmpresa(),
            esTimbrado: true
          }
          this.sobrePadoPrd.getSobrepago(objenviar).subscribe(datos => {
            this.crearTabla(datos);
          });
        });
      }
    });
  }

  public crearTabla(datos: any) {

    this.arreglo = datos.datos;


    let columnas: Array<tabla> = [
      new tabla("nombreNomina", "Nombre"),
      new tabla("mes", "Mes"),
      new tabla("anio", "Año"),
      new tabla("fechatimbre", "Fecha")
    ]

    if (this.arreglo !== undefined) {
      for (let item of this.arreglo) {
        
        item["fechatimbre"] = new DatePipe("es-MX").transform((item.fechaTimbrado || new Date()), "dd/MM/yyyy");
        item["anio"] = new DatePipe("es-MX").transform((item.fechaTimbrado || new Date()), "yyyy");
        item["mes"] = new DatePipe("es-MX").transform((item.fechaTimbrado || new Date()), "MMM");
      }
    }

    this.arreglotabla = {
      columnas: columnas,
      filas: this.arreglo
    };
    this.cargando = false;
  }

  public filtrar() {

  }

  public inicio(){
    this.router.navigate(['/inicio']);
  }

  public recibirTabla(obj: any) {
    console.log(obj.datos);
    switch (obj.type) {
      case "descargar":
        let enviarObj = {
          nominaPeriodoId: obj.datos.nominaXperiodoId,
          idEmpleado: this.numeroEmpleado,
          esZip: false,
          clienteId:this.usuariosSistemaPrd.getIdEmpresa()
        }
        

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
       if(Boolean(obj.datos.esExtraordinaria)){
        this.reportesPrd.getComprobanteFiscalXMLExtraordinarias(enviarObj).subscribe(valor => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

          this.reportesPrd.crearArchivo(valor.datos, "Timbrado_" + obj.datos.nombreNomina + this.numeroEmpleado, "pdf")
        });
       }else{
        this.reportesPrd.getComprobanteFiscalXMLOrdinarias(enviarObj).subscribe(valor => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

          this.reportesPrd.crearArchivo(valor.datos, "Timbrado_" + obj.datos.nombreNomina + this.numeroEmpleado, "pdf")
        });
       }
        break;
    }
  }

}
