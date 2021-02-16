import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomicilioService } from 'src/app/modules/empleados/services/domicilio.service';

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
  @Input() datosPersona:any;
  

  public myForm!: FormGroup;

  public submitEnviado: boolean = false;

  constructor(private formBuilder: FormBuilder,private domicilioPrd:DomicilioService) { }

  ngOnInit(): void {

    let obj = {};
    this.myForm = this.createForm(obj);

  }

  public createForm(obj: any) {

    return this.formBuilder.group({
      codigo: [obj.codigo, [Validators.required,Validators.pattern('[0-9]+')]],
      estado:[obj.estado,[Validators.required]],
      municipio:[obj.municipio,[Validators.required]],
      asentamientoId:[obj.asentamientoId,[Validators.required]],
      calle:[obj.calle,[Validators.required]],
      numExterior:[obj.numExterior,[Validators.required]],
      numInterior:obj.numInterior
    });

  }



  public guardar() {
    this.enviado.emit({ type: "domicilio", valor: true });
  }
  public cancelar() {

  }


  public enviarFormulario() {

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
    this.alerta.strsubtitulo = "Esta apunto de guardar un empleado";
    this.alerta.iconType = "warning";

  }

  public get f() {
    return this.myForm.controls;
  }


  ngOnChanges(changes: SimpleChanges) {

    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      

      let obj = this.myForm.value;


      let objenviar = 
        {
          codigo: obj.codigo,
          municipio: obj.municipio,
          estado: obj.estado,
          asentamientoId: obj.asentamientoId,
          calle: obj.calle,
          numExterior: obj.numExterior,
          numInterior:obj.numInterior,
          personaId: {
              personaId: this.datosPersona.personaId
          }
      }

      this.domicilioPrd.save(objenviar).subscribe(datos =>{
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
    if(this.myForm.controls.codigo.errors?.pattern === undefined){
      this.myForm.controls.estado.setValue("Oaxaca");
      this.myForm.controls.municipio.setValue("Oaxaca");
    }
  }




}
