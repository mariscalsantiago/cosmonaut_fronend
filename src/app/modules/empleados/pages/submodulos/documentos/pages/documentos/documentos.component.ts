import { Component, HostListener, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentosService } from 'src/app/modules/empleados/services/documentos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
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
  public idEmpleado: number = 0;
  public idEmpresa: number = 0;
  public fileName: string = "";
  public arregloDocumentos: any = [];
  public idTipoDocumento : number = 0;
  
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;
    this.tamanio = event.target.innerWidth;
  }



  constructor(private routerPrd: Router, private documentosPrd: DocumentosService,private modalPrd:ModalService, 
    private router:ActivatedRoute, private ventana:VentanaemergenteService,private usuariosSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {

    

    this.router.params.subscribe(params => {
      this.idEmpleado = params["id"];
    });

    this.documentosPrd.getDocumentosEmpleado().subscribe(datos => this.arregloDocumentos = datos.datos);
    debugger;
    this.cargando = true;
    this.documentosPrd.getListaDocumentosEmpleado(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado).subscribe(datos => {
        this.crearTabla(datos);
    });


  }


  public crearTabla(datos:any){
    
    this.arreglo = datos.datos;

    
    let columnas: Array<tabla> = [
      new tabla("nombreArchivo", "Nombre"),
      new tabla("fechaCargaDocumento", "Fecha"),
      new tabla("tipoDocumento", "Tipo de documento")
    ]


    this.arreglotabla = {
      columnas:[],
      filas:[]
    }


    if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        item.fechaCarga = (new Date(item.fechaCarga).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaCargaDocumento = datepipe.transform(item.fechaCarga , 'dd-MMM-y')?.replace(".","");

        item.tipoDocumento= item.tipoDocumento?.nombre;
      }
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }


  public recibirTabla(obj: any) {
    
    if (obj.type == "editar") {
      let datos = obj.datos;
      this.ventana.showVentana(this.ventana.subirdocumento,{datos:datos}).then(valor =>{
        if(valor.datos){
          
            this.modificarDocumento(valor.datos);
        }
      });
    }
    if (obj.type == "descargar") {
      this.iniciarDescarga(obj.datos);
      
    }
    if (obj.type == "eliminar") {

      let mensaje = "¿Estás seguro de eliminar el documento? Al eliminarlo no podrá ser recuperado posteriormente";
      this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
      if(valor){
      let idDocuemnto = obj.datos.documentosEmpleadoId;
      this.modalPrd.showMessageDialog(this.modalPrd.loading);
  
      this.documentosPrd.eliminar(idDocuemnto).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
        this.documentosPrd.getListaDocumentosEmpleado(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado).subscribe(datos => {
          this.crearTabla(datos);
        });
        
      });
    }

    });
      
    }
  
  }

  public filtrar(){
    debugger;
    if(this.idTipoDocumento != 0){
    
      this.cargando = true;
    
      this.documentosPrd.getListaTipoDocumento(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado,this.idTipoDocumento).subscribe(datos => {
          this.crearTabla(datos);
      });
    }else{
    this.documentosPrd.getListaDocumentosEmpleado(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado).subscribe(datos => {
        this.crearTabla(datos);
    });
    }

  }

  public iniciarDescarga(obj:any) {
    debugger;
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

  public agregar(){
    
    let datos : any = {
      idEmpleado: this.idEmpleado,
      idEmpresa: this.usuariosSistemaPrd.getIdEmpresa(),
      esInsert: true
    };

    this.ventana.showVentana(this.ventana.subirdocumento,{datos:datos}).then(valor =>{
      if(valor.datos){
        
          this.agregarDocumento(valor.datos);
      }
    });
  }

  public agregarDocumento(obj:any){
  
    this.modalPrd.showMessageDialog(this.modalPrd.loading);
  
    this.documentosPrd.save(obj).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
      this.documentosPrd.getListaDocumentosEmpleado(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado).subscribe(datos => {
        this.crearTabla(datos);
      });
      
    });
  }

  public modificarDocumento(obj:any){
    
      this.modalPrd.showMessageDialog(this.modalPrd.loading);
    
      this.documentosPrd.modificar(obj).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
        this.documentosPrd.getListaDocumentosEmpleado(this.usuariosSistemaPrd.getIdEmpresa(),this.idEmpleado).subscribe(datos => {
          this.crearTabla(datos);
        });
        
      });
    }

}
