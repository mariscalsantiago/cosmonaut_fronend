import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImssService } from 'src/app/modules/empresas/services/imss/imss.service';



@Component({
  selector: 'app-datosimss',
  templateUrl: './datosimss.component.html',
  styleUrls: ['./datosimss.component.scss']
})
export class DatosimssComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() alerta: any;
  @Input() enviarPeticion: any;
  @Input() cambiaValor: boolean = false;
  @Input() datosempresa:any;

  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public activadoCer:boolean = false;
  public activadoFiel: boolean = false;

  constructor(private formBuilder:FormBuilder,private imssPrd: ImssService,private routerPrd:Router) { }

  ngOnInit(): void {

    let obj = {};
    this.myForm = this.createForm(obj);

  }

  public createForm(obj: any) {

    return this.formBuilder.group({
      registroPatronal: [obj.registroPatronal,[Validators.required]],
      emPrimaRiesgo:[obj.emPrimaRiesgo,[Validators.required, Validators.pattern(/^\d{2}$/)]],
      emClaveDelegacionalImss:[obj.emClaveDelegacionalImss,[Validators.required, Validators.pattern(/^\d{2}$/)]],
      emImssObreroIntegradoApatronal: obj.emImssObreroIntegradoApatronal,
      emEnviarMovsImss:obj.emEnviarMovsImss
    
    });

  }


public activcer(){
     
    this.activadoFiel = false;
    this.activadoCer = true;
}
public activfiel(){
   
  this.activadoFiel = true;
  this.activadoCer = false;
}
 
  public cancelar() {
    this.routerPrd.navigate(['/listaempresas']);

  }


  public enviarFormulario() {

    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.alerta.modal = true;
      this.alerta.strTitulo = "Campos obligatorios o inválidos";
      //this.alerta.strsubtitulo = "Hay campos inválidos o sin rellenar, favor de verificar";
      this.alerta.iconType = "error";
      return;
    }

    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas guardar cambios?";
    //this.alerta.strsubtitulo = "Esta apunto de guardar un empleado";
    this.alerta.iconType = "warning";

  }

  public get f() {
    return this.myForm.controls;
  }


  ngOnChanges(changes: SimpleChanges) {
     
    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      let obj = this.myForm.value;
      let objenviar = {
          registroPatronal: obj.registroPatronal,
          emPrimaRiesgo: obj.emPrimaRiesgo,
          emClaveDelegacionalImss: obj.emClaveDelegacionalImss,
          emImssObreroIntegradoApatronal: obj.emImssObreroIntegradoApatronal,
          emEnviarMovsImss: obj.emEnviarMovsImss,
          centrocClienteId:{
              centrocClienteId: this.datosempresa.centrocClienteEmpresa
          }

        }

        
      this.imssPrd.save(objenviar).subscribe(datos => {
        this.alerta.iconType = datos.resultado ? "success" : "error";

        this.alerta.strTitulo = datos.mensaje;
        //this.alerta.strsubtitulo = datos.mensaje
        this.alerta.modal = true;
      });


    }else{
      if(this.alerta.iconType == "success"){
        this.routerPrd.navigate(["/listaempresas"]);
    }
   
    this.alerta.modal = false;
    }

  }
}


