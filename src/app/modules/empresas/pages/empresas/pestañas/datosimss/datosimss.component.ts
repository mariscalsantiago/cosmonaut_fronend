import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
  public activadoCER:boolean = false;
  public activadoFIEL: boolean = false;
  constructor(private formBuilder:FormBuilder) { }

  ngOnInit(): void {

    let obj = {};
    this.myForm = this.createForm(obj);

  }

  public createForm(obj: any) {

    return this.formBuilder.group({
    
    });

  }


  public activarcer(obj:any){
    debugger;
    //this.activadoCER = obj.checked;
    this.activadoFIEL = false;
    this.activadoCER = true;
}
public activarfiel(obj:any){
  debugger;
  //this.activadoFIEL = obj.checked;
  this.activadoFIEL = true;
  this.activadoCER = false;
}
 
  public cancelar() {

  }


  public enviarFormulario() {

    this.submitEnviado = true;
    if (this.myForm.invalid) {
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


 /* ngOnChanges(changes: SimpleChanges) {

    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      alert("peticion empleo");

      setTimeout(() => {
        this.alerta.iconType = "success";

          this.alerta.strTitulo = "Mensaje desde empleo";
          this.alerta.strsubtitulo = "subtitutlo";
          this.alerta.modal = true;
      }, 2000);

    }
  }*/
}
