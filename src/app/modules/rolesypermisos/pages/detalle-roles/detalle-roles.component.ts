import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { modulos } from 'src/app/core/modelos/modulos';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
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
    private modalPrd: ModalService, private usuariosSistemaPrd: UsuarioSistemaService,
    private routerPrd: Router) { }

  ngOnInit(): void {

    this.myForm = this.createForm({});

    this.cargando = true;
    this.rolesPrd.getListaModulos(true).subscribe(datos => {
      this.cargando = false;
      this.arreglo = datos;
      this.arreglo.forEach(valor => {
        valor.seleccionado = false;
        valor.checked = false;
        if (valor.submodulos) {
          valor.submodulos.forEach(valor2 => {
            valor2.checked = false;
            valor2.permisos?.forEach(valor3 => {
              valor3.checked = false;
            });
          });
        }
      });

    });
  }


  public createForm(obj: any) {
    return this.fb.group({
      nombre: ['', [Validators.required]]
    });
  }


  public cancelar() {
    this.routerPrd.navigate(["/rolesypermisos/lista"]);
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

  public realizarGuardado() {


    let objenviar = {
      nombreRol: this.myForm.value.nombre,
      centrocClienteId: this.usuariosSistemaPrd.getIdEmpresa()
    }


    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.rolesPrd.guardarRol(objenviar).subscribe(datos => {
      if (datos.resultado) {
        const rolId: number = datos.datos.rolId;

        let enviarArray = this.formandoPermisos(rolId);

        this.rolesPrd.guardarPermisoxModulo(enviarArray).subscribe(valorDatos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(valorDatos.resultado, valorDatos.mensaje).then(() => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            if (valorDatos.resultado) {
              this.routerPrd.navigate(["/rolesypermisos/lista"]);
            }
          });
        });

      } else {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      }
    });
  }

  public formandoPermisos(rolId: number) {
    let objEnviarPermiso: any = {
      rolId: rolId,
      submodulosXpemisos: []
    };

    for (let item of this.arreglo) {

      if (item.checked) {
        if (item.submodulos) {
          for (let item2 of item.submodulos) {
            if (item2.checked) {
              if (item2.permisos) {
                for (let item3 of item2.permisos) {
                  if (item3.checked) {
                    objEnviarPermiso.submodulosXpemisos.push(
                      {
                        submoduloId: item2.submoduloId,
                        permisoId: item3.permisoId
                      }
                    );
                  }
                }
              }
            }
          }
        }
      }
    }

    return objEnviarPermiso;
  }

  public cambiarStatus(numero: number) {

    this.arreglo.forEach(valor => { valor.seleccionado = false });

    this.arreglo[numero].seleccionado = !this.arreglo[numero].seleccionado;
  }


  public get f() {
    return this.myForm.controls;
  }

}
