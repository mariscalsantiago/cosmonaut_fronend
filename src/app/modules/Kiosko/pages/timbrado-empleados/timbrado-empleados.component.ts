import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { ContratocolaboradorService } from 'src/app/modules/empleados/services/contratocolaborador.service';
import { DocumentosService } from 'src/app/modules/empleados/services/documentos.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { TimbradoEmpleadoService } from '../../services/timbrado-empleado.service';

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

  public arreglo: any = [];

  constructor(public configuracionPrd: ConfiguracionesService, private empleadosPrd: EmpleadosService,
    private modalPrd: ModalService, private usuariosSistemaPrd: UsuarioSistemaService,
    private documentosPrd: DocumentosService,private sobrePadoPrd:TimbradoEmpleadoService,
    private contratoColaboradorPrd:ContratocolaboradorService) { }

  ngOnInit(): void {

    this.cargando = true;
    this.empleadosPrd.getPersonaByCorreo(this.usuariosSistemaPrd.usuario.correo, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
      if (!datos.resultado) {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      } else {
        this.idEmpleado = datos.datos.personaId;
        this.contratoColaboradorPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datocontrato =>{

          let objenviar = {
            personaId:this.idEmpleado,
            fechaContratoNogrupo:datocontrato.fechaContrato,
            centrocClienteId:this.usuariosSistemaPrd.getIdEmpresa()
          }
          this.sobrePadoPrd.getSobrepago(objenviar).subscribe(datos =>{
            this.crearTabla(datos);
          });
        });
      }
    });
  }

  public crearTabla(datos: any) {

    this.arreglo = datos.datos;


    let columnas: Array<tabla> = [
      new tabla("nombreArchivo", "Nombre"),
      new tabla("fechaCargaDocumento", "Fecha"),
      new tabla("tipoDocumento", "Tipo de documento")
    ]

    if (this.arreglo !== undefined) {
      for (let item of this.arreglo) {
        item.fechaCarga = (new Date(item.fechaCarga).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaCargaDocumento = datepipe.transform(item.fechaCarga, 'dd-MMM-y')?.replace(".", "");

        item.tipoDocumento = item.tipoDocumento?.nombre;
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

  public recibirTabla(obj: any) {
  }

}
