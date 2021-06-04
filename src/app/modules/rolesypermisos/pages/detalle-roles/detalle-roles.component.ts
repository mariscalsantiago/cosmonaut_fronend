import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { modulos } from 'src/app/core/modelos/modulos';
import { permiso } from 'src/app/core/modelos/permiso';
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
  public actualizar: boolean = false;
  public objrol: any;


  constructor(private rolesPrd: RolesService, private fb: FormBuilder,
    private modalPrd: ModalService, private usuariosSistemaPrd: UsuarioSistemaService,
    private routerPrd: Router) { }

  ngOnInit(): void {



    this.objrol = history.state.datos;
    this.actualizar = Boolean(this.objrol);
    this.myForm = this.createForm(this.objrol);

    this.cargando = true;
    if (this.objrol) {
      this.rolesPrd.getPermisosxRol(this.objrol.rolId, true).subscribe(datos => {
        this.traerDatosMenu(datos.datos);
      });
    } else {
      this.traerDatosMenu();
    }

  }


  public createForm(obj: any) {
    return this.fb.group({
      nombre: [obj?.nombreRol, [Validators.required]]
    });
  }

  public traerDatosMenu(obj?: any) {
    let modificar = Boolean(obj);
    this.rolesPrd.getListaModulos(true).subscribe(datos => {
      this.cargando = false;
      this.arreglo = datos;
      this.arreglo.forEach(valor => {
        valor.seleccionado = false;
        valor.checked = false;
        valor.previo = false;
        if (valor.submodulos) {
          valor.submodulos.forEach(valor2 => {
            let primerAuxSubmodulo = true;
            valor2.checked = false;
            valor2.previo = false;
            let filtrar: any = [];
            if (modificar) filtrar = Object.values(obj).filter((x: any) => x.submoduloId == valor2.submoduloId);

            valor2.permisos?.forEach(valor3 => {

              valor3.checked = this.encontrarConcidencias(filtrar, valor3);
              valor3.previo = valor3.checked;
              if (valor3.checked) {
                if (primerAuxSubmodulo) {
                  valor.checked = true;
                  valor.previo = true;
                  valor2.checked = true;
                  valor2.previo = true;
                  primerAuxSubmodulo = false;
                }
              }
            });
          });
        }
      });

    });
  }

  public encontrarConcidencias(obj: any, valor3: permiso): boolean {
    let tieneModulo = Boolean(obj);
    if (tieneModulo) {
      tieneModulo = Object.values(obj).filter((x: any) => x.permisoId == valor3.permisoId).length > 0
    }
    return tieneModulo;
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
    let titulo: string = this.actualizar ? "¿Deseas actualizar los datos del rol?" : "¿Deseas guardar el rol?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo, "").then(valor => {

      if (valor) {

        if (!this.actualizar) {
          this.realizarGuardado();
        } else {
          this.realizarActualización();
        }

      }

    });

  }

  public realizarActualización() {
    let objenviar = {
      nombreRol: this.myForm.value.nombre,
      centrocClienteId: this.usuariosSistemaPrd.getIdEmpresa(),
      rolId: this.objrol.rolId,
    }


   
    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.rolesPrd.modificarRol(objenviar).subscribe(datos => {
      if (datos.resultado) {
        const rolId: number = datos.datos.rolId;
        let enviarArray = this.formandoPermisos(rolId);
        let enviarArraySinPermiso = this.quitandoPermisos(rolId);

        this.rolesPrd.guardarPermisoxModulo(enviarArray).subscribe(valorDatos => {
          if (valorDatos.resultado) {

            this.rolesPrd.quitarPermisoxModulo(enviarArraySinPermiso).subscribe(sinpermiso => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(sinpermiso.resultado,sinpermiso.mensaje).then(() => {
                if (sinpermiso.resultado) {
                  this.routerPrd.navigate(["/rolesypermisos/lista"]);
                }
              });
            });

          } else {
            this.modalPrd.showMessageDialog(valorDatos.resultado, valorDatos.mensaje);
          }
        });

      } else {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
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
            if ((item2.checked)) {
              if (item2.permisos) {
                for (let item3 of item2.permisos) {

                  if (item3.checked && !item3.previo) {
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


  public quitandoPermisos(rolId: number) {
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

                  if (!item3.checked && item3.previo) {
                    objEnviarPermiso.submodulosXpemisos.push(
                      {
                        submoduloId: item2.submoduloId,
                        permisoId: item3.permisoId
                      }
                    );
                  }
                }
              }
            } else {
              if (!item2.checked && item2.previo) {
                item2.permisos?.forEach(valor => {
                 if(valor.previo){
                  objEnviarPermiso.submodulosXpemisos.push(
                    {
                      submoduloId: item2.submoduloId,
                      permisoId: valor.permisoId
                    }
                  );
                 }
                });
              }
            }
          }
        }
      } else {


        if (!item.checked && item.previo) {
          item.submodulos?.forEach(valor => {
           if(valor.previo){
            let idSubmodulo = valor.submoduloId;
            valor.permisos?.forEach(valor2 => {
              if(valor2.previo){
                objEnviarPermiso.submodulosXpemisos.push(
                  {
                    submoduloId: idSubmodulo,
                    permisoId: valor2.permisoId
                  }
                );
              }
            });
           }
          });
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
