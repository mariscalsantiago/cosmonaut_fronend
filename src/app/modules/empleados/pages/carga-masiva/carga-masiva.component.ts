import { Component, ElementRef, OnInit, ViewChild , Input, Output , EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { EmpleadosService } from '../../services/empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { tabla } from 'src/app/core/data/tabla';
import { truncate } from 'fs';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss']
})
export class CargaMasivaComponent implements OnInit {

  public myForm!: FormGroup;
  public arreglo: any = [];
  public insertar: boolean = false;

  public cargando: Boolean = false;
  public submitEnviado: boolean = false;
  public cargandoIcon: boolean = false;
  public idEmpresa: number = 0;
  public fileName: string = "";
  public arregloTipoCarga: any  = [];
  public idEmpleado : number = 0;
  public listaErrores : boolean = false;
  public fromEmpleado : boolean = true;
  public estatusEmpleado : boolean = false;
  public tipocarga : number = 0;
  
  public obj: any = [];

  @Input() public datos:any;
  @ViewChild("documento") public inputdoc!: ElementRef;
  @Output() salida = new EventEmitter<any>();

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };



  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esDescargar:boolean = false;

  public modulo: string = "";
  public subModulo: string = "";


  constructor(private formBuilder: FormBuilder, private routerActivePrd: ActivatedRoute, private reportesPrd: ReportesService,
    private routerPrd: Router,private modalPrd:ModalService,private usuarioSistemaPrd:UsuarioSistemaService,
    private catalogosPrd:CatalogosService, private EmpleadosService:EmpleadosService,public configuracionPrd:ConfiguracionesService) {
  }

  ngOnInit(): void {
    
    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    this.establecerPermisos();

    this.idEmpresa = this.usuarioSistemaPrd.getIdEmpresa();
    this.obj = history.state.datos == undefined ? {} : history.state.datos;

      
    this.catalogosPrd.getTipoCarga(true).subscribe(datos => this.arregloTipoCarga = datos.datos);
    
      this.myForm = this.createFormcomp((this.obj));


  }


  public establecerPermisos(){
    
    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionPrd.getPermisos("Consultar");
    this.esDescargar = this.configuracionPrd.getPermisos("Descargar");
  }

  public inicio(){
    this.routerPrd.navigate(['/inicio']);
  }

  public crearTabla(datos:any){
    
    this.arreglo = datos.datos;

    
    let columnas: Array<tabla> = [
      new tabla("nombreCompleto", "Nombre de empleado"),
      new tabla("numeroEmpleado", "Número de empleado"),
      new tabla("estatus", "Estatus carga")
    ]


    this.arreglotabla = {
      columnas:[],
      filas:[]
    }
  

    if(this.arreglo !== undefined){
      for(let item of this.arreglo){

        item.nombreCompleto = item.nombre + " " + item.apellidoPaterno+" "+(item.apellidoMaterno == undefined ? "":item.apellidoMaterno);

        item.estatus = item.esCorrecto? "Exitoso":"No guardado - registro con error";
          
      }
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
  }

  public createFormcomp(obj: any) {
    
    return this.formBuilder.group({

      documento: [obj.documento,[Validators.required]],
      nombre: [obj.nombre],
      tipoCargaId: [obj.tipoCargaId,[Validators.required]]

    });
  }

  public filtrar(){
    
    if(this.idEmpleado != 0){
      if(this.idEmpleado == 1){
        this.estatusEmpleado = true;
      }else{
        this.estatusEmpleado = false;
      }
    
      this.cargando = true;
    
      this.EmpleadosService.getFiltroCargaMasiva(this.idEmpresa,this.estatusEmpleado).subscribe(datos =>{
          this.crearTabla(datos);
      });
    }else{
      this.cargando = true;

      this.EmpleadosService.getListaCargaMasiva(this.idEmpresa).subscribe(datos => {
                       
        this.crearTabla(datos);
      });
    }

  }

  public iniciarDescarga(){
    
    let obj = this.myForm.value;
    this.tipocarga = obj.tipoCargaId;
    if(obj.tipoCargaId == '0' || obj.tipoCargaId == undefined){
      this.modalPrd.showMessageDialog(this.modalPrd.error, "Debe seleccionar un formato a cargar");
    }else{

        
        this.modalPrd.showMessageDialog(this.modalPrd.loading);

          let objEnviar : any = {
            
              idEmpresa: this.idEmpresa,
              tipoCargaId: obj.tipoCargaId
            

          }
          
            this.reportesPrd.getTipoFormatoEmpleado(objEnviar).subscribe(archivo => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              const linkSource = 'data:application/xlsx;base64,' + `${archivo.datos}\n`;
              const downloadLink = document.createElement("a");
              if(obj.tipoCargaId == 1){
                this.fileName = `${"Formato carga masiva Empleados"}.xlsx`;
              }
              else if(obj.tipoCargaId == 2){
                this.fileName = `${"Formato carga masiva Ex-empleados"}.xlsx`;
              }
              else if(obj.tipoCargaId == 3){
                this.fileName = `${"Formato carga masiva Empleados con pago complementario"}.xlsx`;
              }
      
              downloadLink.href = linkSource;
              downloadLink.download = this.fileName;
              downloadLink.click();
            });

    }

  }

  public descargarEmpleados(){
    
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

  
        this.reportesPrd.getDescargaListaEmpleadosErroneos(this.idEmpresa,this.tipocarga).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          const linkSource = 'data:application/xlsx;base64,' + `${archivo.datos}\n`;
          const downloadLink = document.createElement("a");
          const fileName = `${"Empleados-Erroneos"}.xlsx`;
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        });
  
  }

  public abrirDoc() {
    
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx";

    input.click();

    input.onchange = () => {
      let imagenInput: any = input.files;
      this.inputdoc.nativeElement.value = imagenInput![0].name;
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
          this.myForm.controls.nombre.setValue(this.inputdoc.nativeElement.value);
          this.myForm.controls.documento.setValue(this.arrayBufferToBase64(datos));
        });


      }
    }
  }



  public arrayBufferToBase64(buffer: any) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  public enviarPeticion() {
    
    this.submitEnviado = true;
      if (this.myForm.invalid) {
        Object.values(this.myForm.controls).forEach(control => {
          control.markAsTouched();
        });
        this.modalPrd.showMessageDialog(this.modalPrd.error);
        return;
  
      }
  
      let mensaje = "¿Deseas realizar esta carga masiva de empleados?";
      
      this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
        
          if(valor){
            
            let  obj = this.myForm.getRawValue();
            this.tipocarga = obj.tipoCargaId;

              let objEnviar : any = 
            {
                centrocClienteId: this.idEmpresa,
                tipoCargaId: obj.tipoCargaId,
                archivo: obj.documento
            };
            
            this.modalPrd.showMessageDialog(this.modalPrd.loading);

                this.EmpleadosService.saveCargaMasiva(objEnviar).subscribe(datos => {
    
                this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
    
                this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje)
                  .then(()=> {
                     if (!datos.resultado) {
                      
                      this.listaErrores = true;
                      this.fromEmpleado = false;
                      this.cargando = true;
                                                            
                      this.EmpleadosService.getListaCargaMasiva(this.idEmpresa).subscribe(datos => {
                       
                      this.crearTabla(datos);
                    });
                  } else{
                    this.routerPrd.navigate(['/empleados']);
                  }  
                  });
              });     

          }
        });

  }

  public agregar(){
    this.fromEmpleado = true;
    this.listaErrores = false;

  }


  public cancelar() {
    this.routerPrd.navigate(['/empleados']);
  }

  get f() { return this.myForm.controls; }


}
