import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomicilioService } from 'src/app/modules/empresas/services/domicilio/domicilio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { tabla } from 'src/app/core/data/tabla';

@Component({
  selector: 'app-domicilio',
  templateUrl: './domicilio.component.html',
  styleUrls: ['./domicilio.component.scss']
})
export class DomicilioComponent implements OnInit {


  @Output() enviado = new EventEmitter();
  @Input() alerta: any;
  @Input() enviarPeticion: any;
  @Input() cambiaValor: boolean = false;
  @Input() datosempresa:any;
  @Input() datosmoficar: any;
  

  public myForm!: FormGroup;

  public submitEnviado: boolean = false;
  public habGuardar: boolean = true;
  public habcontinuar: boolean = false;
  public habContinua: boolean = true;
  public domicilioCodigoPostal:any = [];
  public nombreEstado:string = "";
  public idEstado:number = 0;
  public nombreMunicipio:string = "";
  public idMunicipio:number = 0;
  public id_empresa: number = 0;
  public asentamientoCpCons: number =0;
  public arreglo: any=[];
  public arregloListaSede: any = [] ;
  public modsinIdDom: boolean = false;
  //public listaSedeNuevo: boolean = true;
  public listaSedeModificar: boolean = false;
  public cargando: Boolean = false;
  public arregloCons: any = [];
  public cargaDom: boolean = false;
  public indexSeleccionado: number = 0;
  public eliminarSede: boolean = false;

  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public arreglotablaDesglose: any = {
    columnas: [],
    filas: []
  };


  constructor(private formBuilder: FormBuilder,private domicilioPrd:DomicilioService,
    private catalogosPrd:CatalogosService,private routerPrd:Router) { }

  ngOnInit(): void {
    debugger;
    let obj:any = {};
    if(!this.datosempresa.insertar){
      this.habContinua=false;
      
    }
    this.datosempresa.activarGuardaMod= true;
    this.id_empresa = this.datosempresa.centrocClienteEmpresa;
    //this.listaSedeModificar = this.datosempresa.activarList;
    //this.listaSedeNuevo = this.datosempresa.activarForm;

    
    this.domicilioPrd.getDetDom(this.id_empresa).subscribe(datos => {this.arregloCons = datos.datos

      if(this.arregloCons != undefined){
        this.cargaDom =true;
      }

      this.cargando = true;
      this.domicilioPrd.getListaSede(this.id_empresa).subscribe(datos => {
       this.arregloListaSede = datos.datos;
       let columnas: Array<tabla> = [
         new tabla("sedeNombre", "Nombre de la sede"),
         new tabla("codigoPostal", "Código postal"),
         new tabla("municipio", "Municipio o alcadía"),
         new tabla("entidadFederativa", "Entidad Federativa"),
       ];
   
  
   
       this.arreglotabla.columnas = columnas;
       this.arreglotabla.filas = this.arregloListaSede;
       this.cargando = false;
       
     });


    if(!this.datosempresa.insertar && this.cargaDom){
      
      this.domicilioPrd.getDetDom(this.id_empresa).subscribe(datos => {
        obj = datos.datos[0];
        obj.asentamientoCpCons = obj.asentamientoId
        this.catalogosPrd.getAsentamientoByCodigoPostal(obj.codigo).subscribe(datos => {
          if(datos.resultado){
            this.domicilioCodigoPostal = datos.datos;
  
            for(let item of datos.datos){
  
              this.nombreEstado = item.dedo;
              this.nombreMunicipio = item.dmnpio;
              this.idEstado = item.edo.estadoId;
              this.idMunicipio = item.catmnpio.cmnpio;
  
              obj.municipio = this.nombreMunicipio;
              obj.estado = this.nombreEstado;
  
  
            }
  
          }
  
          this.myForm = this.createForm(obj);
  
          
        });      
 
      });

    }
    else if(this.cargaDom && this.datosempresa.insertar){
      this.domicilioPrd.getDetDom(this.id_empresa).subscribe(datos => {
        obj = datos.datos[0];
        obj.asentamientoCpCons = obj.asentamientoId
        this.catalogosPrd.getAsentamientoByCodigoPostal(obj.codigo).subscribe(datos => {
          if(datos.resultado){
            this.domicilioCodigoPostal = datos.datos;
  
            for(let item of datos.datos){
              
              this.nombreEstado = item.dedo;
              this.nombreMunicipio = item.dmnpio;
              this.idEstado = item.edo.estadoId;
              this.idMunicipio = item.catmnpio.cmnpio;
  
              obj.municipio = this.nombreMunicipio;
              obj.estado = this.nombreEstado;
  
  
            }
  
          }
  
          this.myForm = this.createForm(obj);
          this.habGuardar =  false;

        });      

      });
    }
    else{
    this.myForm = this.createForm(obj);


    }

  });

  }

  public createForm(obj: any) {

    return this.formBuilder.group({
      codigo: [obj.codigo, [Validators.required,Validators.pattern('[0-9]+')]],
      estado:[obj.estado,[Validators.required]],
      municipio:[obj.municipio,[Validators.required]],
      asentamientoId:[obj.asentamientoCpCons,[Validators.required]],
      calle:[obj.calle,[Validators.required]],
      numExterior:[obj.numExterior,[Validators.required]],
      numInterior:obj.numInterior,
      domicilioId: obj.domicilioId
    });

  }

  public activarContunuar(){

    this.habcontinuar = true;
  }

  public recibirTabla(obj:any){
    debugger;
    switch(obj.type){
       case "editar":
         this.verdetalle(obj.datos);
       break;
       case "eliminar":
         this.eliminar(obj.datos);
       break;
    }
 }

  public eliminar(indice: any){
    debugger; 
   this.indexSeleccionado = indice.sedeId;
   this.eliminarSede = true;
   
   const titulo = "¿Deseas eliminar la sede?";
  
   this.alerta.modal = true;
   this.alerta.strTitulo = titulo;
   this.alerta.iconType = "warning";

     
   
           
 }

  public cancelar() {
    this.routerPrd.navigate(['/listaempresas']);
  }


  public enviarFormulario() {
     
    this.submitEnviado = true;

    if(!this.habcontinuar){
    if (this.myForm.invalid) {
      
      this.alerta.modal = true;
      this.alerta.strTitulo = "Campos obligatorios o inválidos";
      //this.alerta.strsubtitulo = "Hay campos inválidos o sin rellenar, favor de verificar";
      this.alerta.iconType = "error";
      return;
    }

    this.alerta.modal = true;
    this.alerta.strTitulo = (this.datosempresa.insertar) ? "¿Deseas registrar el domicilio" : "¿Deseas actualizar el domicilio?";
    this.alerta.iconType = "warning";

  }else{
    this.enviado.emit({
      type:"domicilioCont"
    });
    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas continuar?";
    this.alerta.iconType = "warning";

  }
}

  public verdetalle(obj:any){
  

        this.datosempresa.idModificar = obj;
        this.enviado.emit({
          type:"sede"
        }); 
        
   
 }

  public get f() {
    return this.myForm.controls;
  }

  
  ngOnChanges(changes: SimpleChanges) {
     
    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      

      let obj = this.myForm.value;
       if(obj.domicilioId == null && !this.datosempresa.insertar){
        this.datosempresa.insertar = true;
        this.modsinIdDom = true;
       }


      let objenviar: any = 
        {
          codigo: obj.codigo,
          municipio: this.idMunicipio,
          estado: this.idEstado,
          asentamientoId: obj.asentamientoId,
          calle: obj.calle,
          numExterior: obj.numExterior,
          numInterior:obj.numInterior,
          centrocClienteId: {
            centrocClienteId: this.datosempresa.centrocClienteEmpresa
          }
      }
      if(this.eliminarSede){
        debugger;
        this.domicilioPrd.eliminar(this.indexSeleccionado).subscribe(datos => {
          this.alerta.iconType = datos.resultado ? "success" : "error";
          this.alerta.strTitulo = datos.mensaje;
          this.alerta.modal = true;

          if(datos.resultado){
            this.enviado.emit({
              type:"domicilioSede"
            });
            this.ngOnInit();
            
          }
  
        });
      }

      else if(this.datosempresa.insertar){
      this.domicilioPrd.save(objenviar).subscribe(datos =>{

        this.alerta.iconType = datos.resultado ? "success" : "error";

        this.alerta.strTitulo = datos.mensaje;
        //this.alerta.strsubtitulo = datos.mensaje
        this.alerta.modal = true;
        if(!this.modsinIdDom){
        this.enviado.emit({
          type:"domicilioSede"
        });
        if(datos.resultado){
          this.habGuardar=false;
          this.modsinIdDom=false;
        }
      }
      });
      }else{
       
      
      let objenviar: any = 
        {
          domicilioId: obj.domicilioId,
          codigo: obj.codigo,
          municipio: this.idMunicipio,
          estado: this.idEstado,
          asentamientoId: obj.asentamientoId,
          calle: obj.calle,
          numExterior: obj.numExterior,
          numInterior:obj.numInterior,
          centrocClienteId: {
            centrocClienteId: this.datosempresa.centrocClienteEmpresa
          }
      }
      
        this.domicilioPrd.modificar(objenviar).subscribe(datos =>{
          this.alerta.iconType = datos.resultado? "success":"error";
          this.alerta.strTitulo = datos.mensaje;
          this.alerta.modal = true;

          this.enviado.emit({
            type:"domicilioSede"
          });

        });
      }
     }

  }

  public buscar(obj:any){
    
    this.myForm.controls.estado.setValue("");
    this.myForm.controls.municipio.setValue("");

    let valor:string = this.myForm.controls.codigo.value;

    if(this.myForm.controls.codigo.errors?.pattern === undefined && valor !== null ){
      if(valor.trim() !== ""){
     
        this.catalogosPrd.getAsentamientoByCodigoPostal(valor).subscribe(datos => {
          
          if(datos.resultado){
            this.domicilioCodigoPostal = datos.datos;

            for(let item of datos.datos){

              this.nombreEstado = item.dedo;
              this.nombreMunicipio = item.dmnpio;
              this.idEstado = item.edo.estadoId;
              this.idMunicipio = item.catmnpio.cmnpio;

              this.myForm.controls.municipio.setValue(this.nombreMunicipio);
              this.myForm.controls.estado.setValue(this.nombreEstado);


            }


            this.myForm.controls.asentamientoId.enable();
            this.myForm.controls.numExterior.enable();
            this.myForm.controls.numInterior.enable();
            this.myForm.controls.calle.enable();
          }else{
            this.myForm.controls.asentamientoId.disable();
            this.myForm.controls.numExterior.disable();
            this.myForm.controls.numInterior.disable();
            this.myForm.controls.calle.disable();
            this.nombreEstado = "";
            this.nombreMunicipio = "";
            this.idEstado = -1;
            this.idMunicipio = -1;
            this.domicilioCodigoPostal=[]

          }
        });

      }
    }
  }




}
