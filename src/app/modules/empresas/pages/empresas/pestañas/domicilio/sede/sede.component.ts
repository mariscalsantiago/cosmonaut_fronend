import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { timingSafeEqual } from 'crypto';
import { SedeService } from 'src/app/modules/empresas/services/sede/sede.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss']
})
export class SedeComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() alerta: any;
  @Input() enviarPeticion: any;
  @Input() cambiaValor: boolean = false;
  @Input() datosempresa:any;
 


  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public domicilioCodigoPostal:any = [];
  public objdsede: any = []; 
  public nombreEstado:string = "";
  public idEstado:number = 0;
  public nombreMunicipio:string = "";
  public idMunicipio:number = 0;
  public insertar: boolean = false;
  public habcontinuardom: boolean = false;
  public objenviar: any = [];

  constructor(private formBuilder: FormBuilder,private sedePrd:SedeService,
    private catalogosPrd:CatalogosService,private routerPrd:Router, private routerActivePrd: ActivatedRoute )
    {
       
     
  }
    
  ngOnInit(): void {
    this.objdsede = history.state.data == undefined ? {} : history.state.data ;
    this.insertar = this.objdsede.insertar;
    let obj = {};
      this.myForm = this.createForm((obj));

  }


  public createForm(obj: any) {
    return this.formBuilder.group({
          sede: [obj.sede,[Validators.required]],
          codigo: [obj.codigo, [Validators.required,Validators.pattern('[0-9]+')]],
          estado:[obj.estado,[Validators.required]],
          municipio:[obj.municipio,[Validators.required]],
          asentamientoId:[obj.asentamientoId,[Validators.required]],
          calle:[obj.calle,[Validators.required]],
          numExterior:[obj.numExterior,[Validators.required]],
          numInterior:obj.numInterior
      
    });
  }

  public enviarFormulario() {
    
   
   if(!this.habcontinuardom){
    this.submitEnviado = true;
   if (this.myForm.invalid) {
     
     this.alerta.modal = true;
     this.alerta.strTitulo = "Campos obligatorios o inválidos";
     this.alerta.iconType = "error";
     return;
   }

   this.alerta.modal = true;
   this.alerta.strTitulo = (this.datosempresa.insertar) ? "¿Deseas registrar la sede" : "¿Deseas actualizar la sede?";
   this.alerta.iconType = "warning";

 }else{
   this.enviado.emit({
     type:"sedeCont"
   });
   this.habcontinuardom= false;
   this.alerta.modal = true;
   this.alerta.strTitulo = "¿Deseas cancelar?";
   this.alerta.iconType = "warning";

 }
}

public activarCancel(){

  this.habcontinuardom = true;
}

  ngOnChanges(changes: SimpleChanges) {
     
    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
       let obj = this.myForm.value;
       this.objenviar = 
       {
         sede: obj.sede,
         codigo: obj.codigo,
         municipio: this.idMunicipio,
         estado: this.idEstado,
         asentamientoId: obj.asentamientoId,
         calle: obj.calle,
         numExterior: obj.numExterior,
         numInterior:obj.numInterior,
         centrocClienteId: {
           centrocClienteId: this.datosempresa.centrocClienteEmpresa
         },
         sedeId: {
           descripcion: obj.sede,
            centrocClienteId: {
             centrocClienteId: this.datosempresa.centrocClienteEmpresa
         }
       }
     }

      if(this.datosempresa.insertar){
        this.sedePrd.save(this.objenviar).subscribe(datos =>{
          this.alerta.iconType = datos.resultado ? "success" : "error";
          this.alerta.strTitulo = datos.mensaje;
          this.alerta.modal = true;
              this.enviado.emit({
                type:"sedeCont"
              });

        });
      }else{
       

        this.objenviar.domicilioId = obj.domicilioId,
      
          this.sedePrd.save(this.objenviar).subscribe(datos =>{
            this.alerta.iconType = datos.resultado ? "success" : "error";
            this.alerta.strTitulo = datos.mensaje;
            this.alerta.modal = true;
              //if(!this.modsinIdDom){
                this.enviado.emit({
                type:"domicilioSede"
              });
              if(datos.resultado){
                //this.habcontinuar= true;
                //this.habGuardar=false;
                //this.modsinIdDom=false;
              }
            //}
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


  get f() { return this.myForm.controls; }

 
}

