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
 

  public alerta = {

    modal: false,
    strTitulo: "",
    iconType: "",
    strsubtitulo: ""
  };

  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public domicilioCodigoPostal:any = [];
  public objdsede: any = []; 
  public nombreEstado:string = "";
  public idEstado:number = 0;
  public nombreMunicipio:string = "";
  public idMunicipio:number = 0;
  public insertar: boolean = false;

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
   
    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.alerta.modal = true;
      this.alerta.strTitulo = "Campos obligatorios o inválidos";
      this.alerta.strsubtitulo = "Hay campos inválidos o sin rellenar, favor de verificar";
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
  public recibir($evento: any) {
     
    this.alerta.modal = false;
    if(this.alerta.iconType == "warning"){
      if ($evento) {
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
              centrocClienteId: this.objdsede.centrocClienteId
            },
            sedeId: {
              descripcion: obj.sede,
               centrocClienteId: {
                centrocClienteId: this.objdsede.centrocClienteId
            }
          }
        }

        if(this.insertar){
           
          
          this.sedePrd.save(objenviar).subscribe(datos =>{
            this.alerta.iconType = datos.resultado ? "success" : "error";
    
            this.alerta.strTitulo = datos.mensaje;
            this.alerta.strsubtitulo = datos.mensaje
            this.alerta.modal = true;
          });

        }else{
    
              

          /*this.politicasPrd.modificar(objEnviar).subscribe(datos =>{
            this.iconType =  datos.resultado? "success":"error";  
            this.strTitulo = datos.mensaje;
            this.strsubtitulo = 'Registro modificado correctamente!'
            this.modal = true;


          });*/
        }
      
      }
    }else{
      if(this.alerta.iconType == "success"){
          this.routerPrd.navigate(["/listaempresas/empresas/nuevo"]);
      }
     
      this.alerta.modal = false;
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

