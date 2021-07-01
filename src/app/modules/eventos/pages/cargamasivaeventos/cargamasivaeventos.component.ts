import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { tabla } from 'src/app/core/data/tabla';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';



@Component({
  selector: 'app-cargamasivaeventos',
  templateUrl: './cargamasivaeventos.component.html',
  styleUrls: ['./cargamasivaeventos.component.scss']
})
export class CargaMasivaEventosComponent implements OnInit {

  @ViewChild("documento") public inputdoc!: ElementRef;
  @Output() salida = new EventEmitter<any>();

  @ViewChild("inputarea") elemento!:ElementRef;
  @ViewChild("inputFile") inputFile!:ElementRef;
  @Input() public datos:any ;

  public activado = [
    { tab: true, form: true, disabled: false, seleccionado: true },
    { tab: false, form: false, disabled: false, seleccionado: false }];

  public myForm!: FormGroup;
  public valor: string = "1";
  public cargandoIcon:boolean = false;
  public cargando:boolean = false;
  public arregloMonedas: any = [];
  public cuentasBancarias: any = [];
  public listaErrores: boolean = false;
  public idEvento: number = 0;
  public idEmpresa : number = 0;
  public submitEnviado: boolean = false;
  public fromEventos: boolean = true;
  public arreglo: any = [];
  public obj: any = [];
  public arregloareas: any = [];
  public arregloEmpleados: any = [];
  public etiquetas:any = [];
  public estatusEvento: boolean = false;

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };


  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esDescargar:boolean = false;


  constructor(private formbuilder: FormBuilder, private modalPrd: ModalService, private routerPrd: Router,
    private catalogosPrd:CatalogosService, private usuarioSistemaPrd:UsuarioSistemaService,private areasPrd: SharedAreasService,
    private reportesPrd: ReportesService,private EmpleadosService:EmpleadosService,public configuracionPrd:ConfiguracionesService) { }
 
  ngOnInit(): void {

    this.establecerPermisos();

    this.idEmpresa = this.usuarioSistemaPrd.getIdEmpresa();
    this.obj = history.state.datos == undefined ? {} : history.state.datos;

    this.areasPrd.getAreasByEmpresa(112).subscribe(datos => this.arregloareas = datos.datos);

    this.EmpleadosService.getEmpleadosCompania(112).subscribe(datos => {
      this.arregloEmpleados = datos.datos;
      for (let item of this.arregloEmpleados) {
        item["nombre"] = item.personaId?.nombre + " " + item.personaId?.apellidoPaterno;
      }
    });



    this.myForm = this.createForm((this.obj));
  }


  public establecerPermisos(){

  
    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionPrd.getPermisos("Consultar");
    this.esDescargar = this.configuracionPrd.getPermisos("Descargar");
  }


  public createForm(obj: any) {
    
    return this.formbuilder.group({

      documento: [obj.documento,[Validators.required]],
      nombre: [obj.nombre],

    });
  }

  public backTab(index: number) {
    
    switch(index){
      case 0:
        this.activado[0].form = true;
        this.activado[0].seleccionado = true;
        this.activado[0].tab = true;
        this.activado[1].tab = false;
        this.activado[1].form = false;
        break;
        case 1:
          this.activado[1].form = true;
          this.activado[1].seleccionado = true;
          this.activado[1].tab = true;
          this.activado[0].tab = false;
          this.activado[0].form = false;

        break;

    }

  }

  public enviarEtapa1() {

    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);
      Object.values(this.myForm.controls).forEach(controls => {
        controls.markAsTouched();
      });;
      return;
    }
  }

  public recibirEtiquetas(obj: any) {
    this.etiquetas = obj;
 }

  public descargarArchivo(){
    
      this.cargandoIcon = true;
      let obj = 

      {
        reporteEventoIncidencia: {
          idEmpresa: this.idEmpresa,
          listaIdEmpleados: this.obtenerEmpleados(),
          esActivo: true
        }
      }
  
  
      if(obj.reporteEventoIncidencia.listaIdEmpleados.length === 0){
  
        this.modalPrd.showMessageDialog(this.modalPrd.error,"No se ha seleccionado ningun empledo");
        return;
      }

      this.modalPrd.showMessageDialog(this.modalPrd.loading);
      this.reportesPrd.getTipoFormatoEventos(obj).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        const linkSource = 'data:application/vnd.ms-excel;base64,' + `${datos.datos}\n`;
        const downloadLink = document.createElement("a");
        const fileName = `Formato carga masiva eventos.xlsx`;
  
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      });
    }


    public filtrar(){
      
      if(this.idEvento != 0){
        if(this.idEvento == 1){
          this.estatusEvento = true;
        }else{
          this.estatusEvento = false;
        }
      
        this.cargando = true;

      
        this.EmpleadosService.getFiltroCargaMasivaEventos(this.idEmpresa,this.estatusEvento).subscribe(datos =>{
            this.crearTabla(datos);
        });

      }else{
        this.cargando = true;
  
        this.EmpleadosService.getListaCargaMasivaEventos(this.idEmpresa).subscribe(datos => {
                         
          this.crearTabla(datos);
        });
      }
  
    }
 
    public obtenerEmpleados() {
      
      let valor = [];
      
      switch (this.valor) {
        case "1":
           for(let item of this.arregloEmpleados){
                valor.push(item.personaId?.personaId);
             }
          break;
        case "2":
          for(let item of this.arregloEmpleados){
            if(item.areaId?.areaId == this.elemento.nativeElement.value){
              valor.push(item.personaId?.personaId);
            }
         }
          break;
        case "3":
          for(let item of this.etiquetas){
          
              valor.push(item.personaId?.personaId);
         }
          break;
      }
      return valor;
    }

  public get f(){
    return this.myForm.controls;
  }

  public cancelar(){
    this.routerPrd.navigate(['/eventos/eventosxempleado']);
  }

  public cambiarTab(obj:any){
    
    for(let item of this.activado){
        item.form = false;
        item.seleccionado = false;
    }


    switch(obj.type){
      case "etapa1":
        this.activado[1].form = true;
        this.activado[1].seleccionado = true;
        this.activado[1].tab = true;
        this.activado[0].seleccionado = true;
        break;
        case "etapa2":
          this.activado[1].tab = true;
          this.activado[1].form = true;
          this.activado[1].seleccionado = true;
          this.activado[0].seleccionado = false;
          this.activado[0].form = false;
          this.activado[0].tab = false;
        break;
    }
  }


  public seleccionarItem() {
    
    /*if(this.valor == "2"){
      if(this.etiquetas.length === 0){
        this.modalPrd.showMessageDialog(this.modalPrd.error,"No se ha seleccionado ningun empledo");
        return;  
      }
    }*/
    this.cambiarTab({ type: "etapa2", datos: true });
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

        item.estatus = item.esCorrecto? "Exitoso":"Error";
          
      }
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;
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
  
      let mensaje = "¿Deseas realizar esta carga masiva de eventos?";
      
      this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
        
          if(valor){
            
            let  obj = this.myForm.getRawValue();

              let objEnviar : any = 
            {
                centrocClienteId: this.idEmpresa,
                archivo: obj.documento
            };

           
            this.modalPrd.showMessageDialog(this.modalPrd.loading);

                this.EmpleadosService.saveCargaMasivaEventos(objEnviar).subscribe(datos => {
    
                this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
    
                this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje)
                  .then(()=> {
                     if (!datos.resultado) {
                      
                      this.listaErrores = true;
                      this.fromEventos = false;
                      this.cargando = true;
                                                            
                      this.EmpleadosService.getListaCargaMasivaEventos(this.idEmpresa).subscribe(datos => {
                       
                      this.crearTabla(datos);
                    });
                  } else{
                    this.routerPrd.navigate(['/eventos/eventosxempleado']);
                  }  
                  });
              });     

          }
        });
        

  }

  public abrirArchivo()
  {

    
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

  public descargarEventos(){
    
    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    let objEnviar: any ={
      idEmpresa: this.idEmpresa,
      listaIdEmpleados: this.obtenerEmpleados()
    }

  
        this.reportesPrd.getDescargaListaEventosErroneos(objEnviar).subscribe(archivo => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          const linkSource = 'data:application/xlsx;base64,' + `${archivo.datos}\n`;
          const downloadLink = document.createElement("a");
          const fileName = `${"Empleados-Erroneos"}.xlsx`;
  
          downloadLink.href = linkSource;
          downloadLink.download = fileName;
          downloadLink.click();
        });
  
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

  public agregar(){
    this.fromEventos = true;
    this.listaErrores = false;

  }


  
}

