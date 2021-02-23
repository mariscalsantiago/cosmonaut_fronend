import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SedeService } from 'src/app/modules/empresas/services/sede/sede.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss']
})
export class SedeComponent implements OnInit {

  @Input() enviarPeticion: any;
  @Input() datosempresa:any;
  //@Input() alerta: any;
  public alerta = {

    modal: false,
    strTitulo: "",
    iconType: "",
    strsubtitulo: ""
  };

  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public domicilioCodigoPostal:any = [];
  public nombreEstado:string = "";
  public idEstado:number = 0;
  public nombreMunicipio:string = "";
  public idMunicipio:number = 0;

  constructor(private formBuilder: FormBuilder,private sedePrd:SedeService,
    private catalogosPrd:CatalogosService,private routerPrd:Router) {
     
  }
    
  ngOnInit(): void {
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

  public recibirAlerta(obj: any) {

    debugger;
    //this.cambiaValor = !this.cambiaValor;
    

    this.alerta.modal = false;
    this.enviarPeticion.enviarPeticion = false;
    

    if (this.alerta.iconType === "warning") {
      
      if (obj) {
        
        this.enviarPeticion.enviarPeticion = true;
      }


    } /*else {
      if (this.alerta.iconType == "success") {

        let indexSeleccionado = 0;
        for (let x = 0; x < this.activado.length; x++) {
          if (this.activado[x].form) {

            indexSeleccionado = x;
            break;
          }
        }

      }
    }*/

  }

  public enviarFormulario() {
  debugger;
    this.submitEnviado = true;
    if (this.myForm.invalid) {
      console.log(this.myForm);
      this.alerta.modal = true;
      this.alerta.strTitulo = "Campos obligatorios o invalidos";
      this.alerta.strsubtitulo = "Hay campos invalidos o sin rellenar, favor de verificar";
      this.alerta.iconType = "error";
      return;
    }

    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas guardar cambios?";
    this.alerta.strsubtitulo = "Esta apunto de guardar una sede";
    this.alerta.iconType = "warning";

  }

  public cancelar(){
    this.routerPrd.navigate(["/listaempresas/empresas/nuevo"]);
   
  }
  
  ngOnChanges(changes: SimpleChanges) {
    debugger;
    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      

      let obj = this.myForm.value;


      let objenviar = 
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
            centrocClienteId: this.datosempresa.centrocClienteId
          },
          sedeId: {
            descripcion: obj.sede,
             centrocClienteId: {
              centrocClienteId: this.datosempresa.centrocClienteId
          }
        }
      }

      this.sedePrd.save(objenviar).subscribe(datos =>{
        this.alerta.iconType = datos.resultado ? "success" : "error";

        this.alerta.strTitulo = datos.mensaje;
        this.alerta.strsubtitulo = datos.mensaje
        this.alerta.modal = true;
      });
      

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

