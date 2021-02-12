import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';

@Component({
  selector: 'app-preferencias',
  templateUrl: './preferencias.component.html',
  styleUrls: ['./preferencias.component.scss']
})
export class PreferenciasComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() alerta: any;
  @Input() enviarPeticion: any;
  @Input() cambiaValor: boolean = false;

  public myForm!: FormGroup;

  public submitEnviado: boolean = false;

  public arregloPreferencias:any = [];

  constructor(private formBuilder: FormBuilder,private catalogosPrd:CatalogosService) { }


  ngOnInit(): void {

    let obj = {};
    this.myForm = this.createForm(obj);


    this.catalogosPrd.getPreferencias().subscribe(datos => this.arregloPreferencias = datos.datos);
  }

  public createForm(obj: any) {

    return this.formBuilder.group({
    
    });

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


  ngOnChanges(changes: SimpleChanges) {

    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;
      alert("peticion preferencias");

      setTimeout(() => {
        this.alerta.iconType = "success";

          this.alerta.strTitulo = "Mensaje desde preferencias";
          this.alerta.strsubtitulo = "subtitutlo";
          this.alerta.modal = true;
      }, 2000);

    }
  }
}
