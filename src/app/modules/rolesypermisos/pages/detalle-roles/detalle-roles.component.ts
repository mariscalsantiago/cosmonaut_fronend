import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { modulos } from 'src/app/core/modelos/modulos';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { RolesService } from '../../services/roles.service';

@Component({
  selector: 'app-detalle-roles',
  templateUrl: './detalle-roles.component.html',
  styleUrls: ['./detalle-roles.component.scss']
})
export class DetalleRolesComponent implements OnInit {

  public myForm!: FormGroup;

  public cargando: boolean = false;
  public arreglo!: Array<modulos>;


  constructor(private rolesPrd: RolesService, private fb: FormBuilder,
    private modalPrd: ModalService) { }

  ngOnInit(): void {

    this.myForm = this.createForm({});

    this.cargando = true;
    this.rolesPrd.getListaModulos(true).subscribe(datos => {
      this.cargando = false;
      this.arreglo = datos;
      this.arreglo.forEach(valor => { valor.seleccionado = false });
      console.log("Este es el arreglo", this.arreglo);
    });
  }


  public createForm(obj: any) {
    return this.fb.group({
      nombre: ['', [Validators.required]]
    });
  }


  public cancelar() {

  }

  public enviarPeticion() {

    if (this.myForm.invalid) {

      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;
    }

    this.guardar();

  }


  public guardar() {
    let titulo: string = "¿Deseas guardar los cambios?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo, "").then(valor => {

      if (valor) {

        this.realizarGuardado();

      }

    });

  }

  public realizarGuardado(){
      
  }

  public cambiarStatus(numero: number) {

    this.arreglo.forEach(valor => { valor.seleccionado = false });

    this.arreglo[numero].seleccionado = !this.arreglo[numero].seleccionado;
  }


  public get f(){
    return this.myForm.controls;
  }

}
