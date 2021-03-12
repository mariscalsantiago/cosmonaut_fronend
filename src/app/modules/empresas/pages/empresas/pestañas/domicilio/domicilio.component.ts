import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomicilioService } from 'src/app/modules/empresas/services/domicilio/domicilio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';

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
  

  public myForm!: FormGroup;

  public submitEnviado: boolean = false;
  public habcontinuar: boolean = false;
  public habGuardar: boolean = true;
  public domicilioCodigoPostal:any = [];
  public nombreEstado:string = "";
  public idEstado:number = 0;
  public nombreMunicipio:string = "";
  public idMunicipio:number = 0;
  public id_empresa: number = 0;
  public asentamientoCpCons: number =0;
  public arreglo: any=[];
  public modsinIdDom: boolean = false;

  constructor(private formBuilder: FormBuilder,private domicilioPrd:DomicilioService,
    private catalogosPrd:CatalogosService,private routerPrd:Router) { }

  ngOnInit(): void {
    debugger;
    let obj:any = {};
    this.id_empresa = this.datosempresa.centrocClienteEmpresa
    if(!this.datosempresa.insertar){
      this.domicilioPrd.getDetDom(this.id_empresa).subscribe(datos => {
        this.arreglo = datos.datos[0];
        this.catalogosPrd.getAsentamientoByCodigoPostal(this.arreglo.codigo,true).subscribe(datos => {
            
            this.arreglo = datos.datos;
        });
      });
      this.myForm = this.createForm(obj);
    }
    if(!this.datosempresa.insertar && this.arreglo.asentamientoCpCons != undefined ){

    this.domicilioPrd.getDetDom(this.id_empresa).subscribe(datos => {
      obj = datos.datos[0];
      obj.asentamientoCpCons = obj.asentamientoId
      this.catalogosPrd.getAsentamientoByCodigoPostal(obj.codigo,true).subscribe(datos => {
          
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

        //this.myForm = this.createForm(obj);
      });      
    
      this.myForm = this.createForm(obj);

    });
    }
    else{
    this.myForm = this.createForm(obj);
    }

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
    this.habcontinuar= false;
    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas continuar?";
    this.alerta.iconType = "warning";

  }
}

  public verdetalle(obj:any){

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

      if(this.datosempresa.insertar){
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
          this.habcontinuar= true;
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
          //this.alerta.strsubtitulo = datos.mensaje
          this.alerta.modal = true;

        });
      }
     }

  }

  public buscar(obj:any){
    debugger;
    this.myForm.controls.estado.setValue("");
    this.myForm.controls.municipio.setValue("");

    let valor:string = this.myForm.controls.codigo.value;

    if(this.myForm.controls.codigo.errors?.pattern === undefined && valor !== null ){
      if(valor.trim() !== ""){
     
        this.catalogosPrd.getAsentamientoByCodigoPostal(valor,true).subscribe(datos => {
          
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
