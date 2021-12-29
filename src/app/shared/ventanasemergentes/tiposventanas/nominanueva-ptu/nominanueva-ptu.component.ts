import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/services/cuentasbancarias/cuentasbancarias.service';
import { UsuarioService } from 'src/app/modules/usuarios/services/usuario.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { NominaptuService } from 'src/app/shared/services/nominas/nominaptu.service';
import { DatePipe } from '@angular/common';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';

@Component({
  selector: 'app-nominanueva-ptu',
  templateUrl: './nominanueva-ptu.component.html',
  styleUrls: ['./nominanueva-ptu.component.scss']
})
export class NominanuevaPtuComponent implements OnInit,OnChanges {
  @ViewChild("inputarea") elemento!:ElementRef;
  @ViewChild("inputgruponomina") gruponomina!:ElementRef;
  @ViewChild("inputFile") inputFile!:ElementRef;
  @Input() public datos:any ;

  public activado = [
    { tab: true, form: true, disabled: false, seleccionado: true },
    { tab: false, form: false, disabled: false, seleccionado: false },
    { tab: false, form: false, disabled: false, seleccionado: false }];
  @Output() salida = new EventEmitter();

  public monedaPeso: number = 1;
  public valor: string = "1";
  public cargandoIcon: boolean = false;
  public arregloMonedas: any = [];
  public cuentasBancarias: any = [];
  public arregloCompanias: any = [];
  public arregloareas: any = [];
  public etiquetas:any = [];

  public arregloEmpleados: any = [];

  public agregarDiserpsarEmpleado: any = [];

  public myFormFile!:FormGroup;

  public nominaCreada = {nominaPeriodoId:null}

  public myForm!: FormGroup;

  public editar:boolean = false;

  public maximo:any;
  public arreglonacionalidad: any = [];
  public arreglogruponominas:any = [];

  constructor(private formbuilder: FormBuilder, private modal: ModalService, private cuentasBancariasPrd: CuentasbancariasService,
    private catalogosPrd: CatalogosService, private usuariosPrd: UsuarioSistemaService,
    private companiasPrd: SharedCompaniaService, private areasPrd: SharedAreasService,
    private empleadosPrd: EmpleadosService, private nominaPrd: NominaptuService,private gruponominaPrd: GruponominasService) { }

  ngOnInit(): void {
    
    this.maximo = (new DatePipe("es-MX").transform((new Date(new Date().getFullYear(),11,31)),"yyyy-MM-dd"));


    this.gruponominaPrd.getAll(this.usuariosPrd.getIdEmpresa()).subscribe(datos => this.arreglogruponominas = datos.datos);
    this.editar = Boolean(this.datos?.editar)
    if(this.editar){
      this.activado[0].tab = false;
      this.activado[0].form = false;
      this.activado[1].tab = true;
      this.activado[1].form = true;
      this.nominaCreada.nominaPeriodoId = this.datos.datos.nominaXperiodoId;
    }

    this.catalogosPrd.getMonedas(true).subscribe(datos => this.arregloMonedas = datos.datos);
    
    this.cuentasBancariasPrd.getCuentaFuncion(this.usuariosPrd.getIdEmpresa()).subscribe(datos => this.cuentasBancarias = datos.datos);

    this.myFormFile = this.formbuilder.group({
        archivo:[{value:'',disabled:false},Validators.required]
    });

    this.areasPrd.getAreasByEmpresa(this.usuariosPrd.getIdEmpresa()).subscribe(datos => this.arregloareas = datos.datos);

    this.empleadosPrd.getEmpleadosCompania(this.usuariosPrd.getIdEmpresa()).subscribe(datos => {
      this.arregloEmpleados = datos.datos
      for (let item of this.arregloEmpleados) {
        
        item["nombre"] = item.personaId?.nombre + " " + item.personaId?.apellidoPaterno+" "+(item.personaId?.apellidoMaterno || '');
      }
    });

    this.myForm = this.createEtapa1();
    
    if(this.usuariosPrd.esCliente()){
      
      this.companiasPrd.getAllEmp(this.usuariosPrd.getIdEmpresa()).subscribe(datos => {
          //this.arregloCompanias = datos.datos;
          this.myForm.controls.centrocClienteId.setValue(datos.datos.razonSocial);
      });
    }else{
      this.companiasPrd.getEmpresaById(this.usuariosPrd.getIdEmpresa()).subscribe(datos =>{
        //this.arregloCompanias = [datos.datos];
        this.myForm.controls.centrocClienteId.setValue(datos.datos.razonSocial);
      
      });
    }

    
  }

  public createEtapa1() {


    return this.formbuilder.group({
      nombre: ['', Validators.required],
      bancoId: ['', Validators.required],
      monedaId: [this.monedaPeso, Validators.required],
      centrocClienteId: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
  }

  public backTab(index: number) {

    if(this.activado[0].form){
      return;
    }

    switch (index) {
      case 0:
        this.activado[0].form = true;
        this.activado[0].seleccionado = true;
        this.activado[0].tab = true;
        this.activado[1].tab = false;
        this.activado[2].tab = false;
        this.activado[1].form = false;
        this.activado[2].form = false;
        break;
      case 1:
        this.activado[1].form = true;
        this.activado[1].seleccionado = true;
        this.activado[1].tab = true;
        this.activado[0].tab = false;
        this.activado[2].tab = false;
        this.activado[0].form = false;
        this.activado[2].form = false;

        break;
      case 3:
        this.activado[2].form = true;
        this.activado[2].seleccionado = true;
        this.activado[2].tab = true;
        this.activado[0].tab = false;
        this.activado[1].tab = false;
        this.activado[0].form = false;
        this.activado[1].form = false;
        break;
    }

  }


  public  ngOnChanges(changes: SimpleChanges): void{
        
  }
  public enviarEtapa1() {

    if (this.myForm.invalid) {

      this.modal.showMessageDialog(this.modal.error);
      Object.values(this.myForm.controls).forEach(controls => {
        controls.markAsTouched();
      });;
      return;
    }

    if (!this.validaFechaFinal()) {
      return;
    }


    this.modal.showMessageDialog(this.modal.warning, "¿Deseas guardar la nòmina?").then(valor => {
      if (valor) {

        let obj = this.myForm.value;

        let objEnviar = {
          clienteId: this.usuariosPrd.getIdEmpresa(),
          usuarioId: this.usuariosPrd.getUsuario().usuarioId,
          nombreNomina: obj.nombre,
          cuentaBancoId: obj.bancoId,
          monedaId: obj.monedaId,
          fecIniPeriodo: obj.fechaInicio,
          fecFinPeriodo: obj.fechaFin
        };


        this.modal.showMessageDialog(this.modal.loading);
        this.nominaPrd.crearNomina(objEnviar).subscribe(datos => {
          
          this.modal.showMessageDialog(this.modal.loadingfinish);
       
          this.modal.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
            if(datos.resultado){
              this.nominaCreada = datos.datos;
              this.cambiarTab({ type: "etapa1", datos: true });
            }
          });
          
        });


      }
    });

  }

  public get f() {
    return this.myForm.controls;
  }

  public cancelar() {
    this.salida.emit({ type: "cancelar" });
  }

  public cambiarTab(obj: any) {

    for (let item of this.activado) {
      item.form = false;
      item.seleccionado = false;
    }



    switch (obj.type) {
      case "etapa1":
        this.activado[1].form = true;
        this.activado[1].seleccionado = true;
        this.activado[1].tab = true;
        this.activado[0].seleccionado = true;
        break;
      case "etapa2":
        this.activado[2].form = true;
        this.activado[2].seleccionado = true;
        this.activado[2].tab = true;
        this.activado[1].tab = true;
        break;
    }
  }


  public seleccionarItem() {
    if(this.valor == "3"){
      if(this.etiquetas.length === 0){
        this.modal.showMessageDialog(this.modal.error,"No se ha seleccionado ningun empleado");
        return;  
      }
    }
    this.cambiarTab({ type: "etapa2", datos: true });
  }

  public abrirArchivo() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "";
  
      input.click();
  
      input.onchange = () => {
        let imagenInput: any = input.files;
        this.inputFile.nativeElement.value = imagenInput![0].name;
        for (let item in Object.getOwnPropertyNames(imagenInput)) {
  
          let archivo: File = imagenInput[item];
  
          archivo.arrayBuffer().then(datos => {
            this.myFormFile.controls.archivo.setValue(this.arrayBufferToBase64(datos));
          });
  
  
        }
  
      }
    

  }

  public recibirEtiquetas(obj: any) {
     this.etiquetas = obj;
  }

  public descargarArchivo() {
    this.cargandoIcon = true;
    let obj = {
      idEmpresa: this.usuariosPrd.getIdEmpresa(),
      listaIdEmpleados: this.obtenerEmpleados()
    }


    if(obj.listaIdEmpleados.length === 0){

      this.modal.showMessageDialog(this.modal.error,"No se ha seleccionado ningun empleado");
      this.cargandoIcon = false;
      return;
    }
    this.nominaPrd.descargarArchivo(obj).subscribe(datos => {
      this.cargandoIcon = false;
      const linkSource = 'data:application/vnd.ms-excel;base64,' + `${datos.datos}\n`;
      const downloadLink = document.createElement("a");
      const fileName = `LayoutPTU.xlsx`;

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    });
  }


  public  obtenerEmpleados() {
    
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
        case "4":
          debugger;
          for(let item of this.arregloEmpleados){
            if(item.grupoNominaId?.grupoNominaId == this.gruponomina.nativeElement.value){
              valor.push(item.personaId?.personaId);
            }
         }
        break;
    }
    return valor;
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

  public guardarArchivoDispersion(){

    if(this.myFormFile.controls.archivo.invalid){
      
      Object.values(this.myFormFile.controls).forEach(control =>{
         control.markAsTouched();  
      });

      this.modal.showMessageDialog(this.modal.error,"Falta seleccionar el archivo layout");
     return;
    }

    this.modal.showMessageDialog(this.modal.warning,"¿Deseas cargar el archivo?").then(valor =>{
      if(valor){

        this.modal.showMessageDialog(this.modal.loading);

        
        let objEnviar = {
          nominaPeriodoId: this.nominaCreada.nominaPeriodoId,
          centrocClienteId: this.usuariosPrd.getIdEmpresa(),
          archivo: this.myFormFile.controls.archivo.value}

        this.nominaPrd.subirArchivo(objEnviar).subscribe(datos =>{
          this.modal.showMessageDialog(this.modal.loadingfinish);
          this.modal.showMessageDialog(datos.resultado,datos.mensaje).then(() =>{
            if(datos.resultado){
              this.salida.emit({
                type: "guardar", datos: datos
              });
            }
          });
        });

        }  
      
    });

  }

  public validaFechaFinal(): Boolean{
    
    let respuesta: boolean = true;
    let fechaInicioP = this.myForm.controls.fechaInicio.value;
    let fechafinP = this.myForm.controls.fechaFin.value;
    if ( fechafinP < fechaInicioP) {
      this.modal.showMessageDialog(this.modal.error, 'La fecha de fin debe ser mayor a la fecha de inicio');
      this.myForm.controls.fechaFin.setValue("");
      respuesta = false;
    }

    return respuesta;

  }

}
