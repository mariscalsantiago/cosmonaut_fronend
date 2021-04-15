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
  public id_empresa: number = 0;
  public cargando: Boolean = false;
  public arregloImss: any = [];
  public objenviar: any = [];
  public insertarMof: boolean = false;


  constructor(private formBuilder:FormBuilder,private imssPrd: ImssService,private routerPrd:Router) { }

  ngOnInit(): void {
    debugger;

    this.id_empresa = this.datosempresa.centrocClienteEmpresa


   this.imssPrd.getAllByImss(this.id_empresa).subscribe(datos => {
   this.arregloImss = datos.datos;
   console.log(this.arregloImss);

   this.myForm = this.createForm(this.arregloImss);
  });

  this.myForm = this.createForm(this.arregloImss);

  }

  public createForm(obj: any) {

    return this.formBuilder.group({
      registroPatronal: [obj.registroPatronal,[Validators.required,Validators.pattern(/^[A-Za-z,ñ,Ñ,&]/)]],
      emPrimaRiesgo:[obj.emPrimaRiesgo,[Validators.required, Validators.pattern(/[0-9]{1}(\.[0-9])/)]],
      emClaveDelegacionalImss:[obj.emClaveDelegacionalImss,[Validators.required, Validators.pattern(/^\d{2}$/)]],
      emImssObreroIntegradoApatronal: obj.emImssObreroIntegradoApatronal,
      emCalculoAutoPromedioVar: obj.emCalculoAutoPromedioVar
    
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
    debugger;
     
    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      
      let obj = this.myForm.value;

      if(!this.datosempresa.insertar && this.arregloImss.registroPatronalId == undefined){
        this.insertarMof = true;
     }
     
      this.objenviar = {
          registroPatronal: obj.registroPatronal,
          emPrimaRiesgo: obj.emPrimaRiesgo,
          emClaveDelegacionalImss: obj.emClaveDelegacionalImss,
          emImssObreroIntegradoApatronal: obj.emImssObreroIntegradoApatronal,
          emCalculoAutoPromedioVar: obj.emCalculoAutoPromedioVar,
          centrocClienteId:{
              centrocClienteId: this.datosempresa.centrocClienteEmpresa
          }

        }
      
      if(this.insertarMof){
          this.imssPrd.save(this.objenviar).subscribe(datos =>{
            this.alerta.iconType = datos.resultado ? "success" : "error";
            this.alerta.strTitulo = datos.mensaje;
            this.alerta.modal = true;
              if(datos.resultado){
                this.enviado.emit({
                  type:"sedeCont"
                });
              }
          });
      }
      else if(this.datosempresa.insertar){        
      this.imssPrd.save(this.objenviar).subscribe(datos => {
        this.alerta.iconType = datos.resultado ? "success" : "error";
        this.alerta.strTitulo = datos.mensaje;
        this.alerta.modal = true;
      });

      }else{

      this.objenviar.registroPatronalId = this.arregloImss.registroPatronalId;
      this.imssPrd.modificar(this.objenviar).subscribe(datos => {
        this.alerta.iconType = datos.resultado ? "success" : "error";
        this.alerta.strTitulo = datos.mensaje;
        this.alerta.modal = true;
      });
    }
    }
  }
}


