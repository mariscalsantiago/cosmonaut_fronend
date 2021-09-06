import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { DocumentosService } from 'src/app/modules/empleados/services/documentos.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.scss']
})
export class ExpedienteComponent implements OnInit {

  public fileName:any;

  public arreglotabla: any = {
    columnas: [],
    filas: []
  }

  public cargando: boolean = false;
  public idEmpleado: number = 0;

  public arreglo: any = [];
  public arregloDocumentos:any = [];
  public tipodocumento:string = "";

  constructor(public configuracionPrd: ConfiguracionesService, private empleadosPrd: EmpleadosService,
    private modalPrd: ModalService, private usuariosSistemaPrd: UsuarioSistemaService,
    private documentosPrd: DocumentosService) { }

  ngOnInit(): void {

    this.cargando = true;

    this.documentosPrd.getDocumentosEmpleado().subscribe(datos => this.arregloDocumentos = datos.datos);
    this.empleadosPrd.getPersonaByCorreo(this.usuariosSistemaPrd.usuario.correo, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
      if (!datos.resultado) {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      } else {
        this.idEmpleado = datos.datos.personaId;
        this.documentosPrd.getListaDocumentosEmpleado(this.usuariosSistemaPrd.getIdEmpresa(), this.idEmpleado).subscribe(datos => {
          this.crearTabla(datos);
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

  public filtrar(){
    this.cargando = true;
    if(this.tipodocumento){
      this.documentosPrd.getListaTipoDocumento(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado,Number(this.tipodocumento || 0)).subscribe(datos => {
          this.crearTabla(datos);
      });
    }else{
    this.documentosPrd.getListaDocumentosEmpleado(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado).subscribe(datos => {
        this.crearTabla(datos);
    });
    }

  }

  public recibirTabla(obj: any) {
    if (obj.type == "descargar") {
      this.iniciarDescarga(obj.datos);
      
    }
  }

  public iniciarDescarga(obj:any){
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.documentosPrd.getDescargaDocEmpleado(obj.cmsArchivoId).subscribe(archivo => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      let linkSource: string = "";
      if(archivo.datos.tipoMM?.extension == "jpg"){
          linkSource = 'data:application/jpg;base64,' + `${archivo.datos.contenido}\n`;
          this.fileName = `${archivo.datos.nombre}.jpg`;
      }
      else if(archivo.datos.tipoMM?.extension == "docx"){
        linkSource = 'data:application/docx;base64,' + `${archivo.datos.contenido}\n`;
          this.fileName = `${archivo.datos.nombre}.docx`;
      }
      else if(archivo.datos.tipoMM?.extension == "png"){
        linkSource = 'data:application/png;base64,' + `${archivo.datos.contenido}\n`;
        this.fileName = `${archivo.datos.nombre}.png`;
      }
      else if(archivo.datos.tipoMM?.extension == "zip"){
        linkSource = 'data:application/zip;base64,' + `${archivo.datos.contenido}\n`;
        this.fileName = `${archivo.datos.nombre}.zip`;
      }
      else if(archivo.datos.tipoMM?.extension == "rar"){
        linkSource = 'data:application/rar;base64,' + `${archivo.datos.contenido}\n`;
        this.fileName = `${archivo.datos.nombre}.rar`;
      }
      else if(archivo.datos.tipoMM?.extension == "xlsx"){
        linkSource = 'data:application/xlsx;base64,' + `${archivo.datos.contenido}\n`;
        this.fileName = `${archivo.datos.nombre}.xlsx`;
      }
      else if(archivo.datos.tipoMM?.extension == "pdf"){
        linkSource = 'data:application/pdf;base64,' + `${archivo.datos.contenido}\n`;
        this.fileName = `${archivo.datos.nombre}.pdf`;
      }
      else if(archivo.datos.tipoMM?.extension == "doc"){
        linkSource = 'data:application/doc;base64,' + `${archivo.datos.contenido}\n`;
        this.fileName = `${archivo.datos.nombre}.doc`;
      }
      else if(archivo.datos.tipoMM?.extension == "jpg"){
      linkSource = 'data:application/jpg;base64,' + `${archivo.datos.contenido}\n`;
      this.fileName = `${archivo.datos.nombre}.jpg`;
      }
      else{
      linkSource = 'data:application/txt;base64,' + `${archivo.datos.contenido}\n`;
      this.fileName = `${archivo.datos.nombre}.txt`;
      }
      const downloadLink = document.createElement("a");
      

      downloadLink.href = linkSource;
      downloadLink.download = this.fileName;
      downloadLink.click();
    });
  


  }


}
