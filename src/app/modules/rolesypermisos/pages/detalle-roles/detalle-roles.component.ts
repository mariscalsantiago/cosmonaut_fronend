import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { modulos } from 'src/app/core/modelos/modulos';
import { permiso } from 'src/app/core/modelos/permiso';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
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
  public mostrarEstatus: boolean = false;
  public objrol: any;


  constructor(private rolesPrd: RolesService, private fb: FormBuilder,
    private modalPrd: ModalService, private usuariosSistemaPrd: UsuarioSistemaService,
    private routerPrd: Router, public configuracionPrd: ConfiguracionesService) { }

  ngOnInit(): void {

    debugger;
    this.objrol = history.state.datos;
    this.actualizar = Boolean(this.objrol);
    this.myForm = this.createForm(this.objrol);

    this.cargando = true;
    if (this.objrol) {
      this.mostrarEstatus = true;
      this.rolesPrd.getPermisosxRol(this.objrol.rolId, true).subscribe(datos => {
        this.traerDatosMenu(datos.datos);
      });
    } else {
      this.traerDatosMenu();
    }

  }


  public createForm(obj: any) {
    return this.fb.group({
      nombre: [obj?.nombreRol, [Validators.required]],
      esActivo: [obj?.esActivo]
    });
  }

  public traerDatosMenu(obj?: any) {

    let modificar = Boolean(obj);
    this.rolesPrd.getListaModulos(true, this.usuariosSistemaPrd.getVersionSistema()).subscribe(datos => {
      this.arreglo = datos;
      this.arreglo.forEach(valor => {
        valor.seleccionado = false;
        valor.checked = false;
        valor.previo = false;
        valor.mostrar = true;
        if (Number(valor.moduloId) == 8) {
          valor.mostrar = false;
        }
        
        if (valor.submodulos) {
          valor.submodulos.forEach(valor2 => {
            let primerAuxSubmodulo = true;
            valor2.checked = false;
            valor2.previo = false;
            valor2.mostrar = true;
            let filtrar: any = [];
            if (modificar) filtrar = Object.values(obj).filter((x: any) => x.submoduloId == valor2.submoduloId);

            valor2.permisos?.forEach(valor3 => {

              valor3.checked = this.encontrarConcidencias(filtrar, valor3);
              valor3.mostrar = true;
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



      this.rolesPrd.getPermisosByVersiones(this.usuariosSistemaPrd.getVersionSistema()).subscribe(datos => {
        this.cargando = false;

        if (this.usuariosSistemaPrd.getVersionSistema() !== 4 && this.usuariosSistemaPrd.getVersionSistema() !== 1) {
          this.arreglo.forEach(modulo => {
            if (modulo.submodulos) {
              let haysubmodulos: any = [];
              modulo.submodulos.forEach(submodulo => {
                let existe = datos.datos.some((obj: any) => obj.submoduloId == submodulo.submoduloId);
                submodulo.mostrar = existe;
                haysubmodulos.push(existe);
                if (submodulo.permisos) {

                  submodulo.permisos.forEach(permiso => {
                    let existePermisos = datos.datos.some((obj: any) => obj.permisoId == permiso.permisoId);
                    permiso.mostrar = existePermisos;
                  });



                }
              });
              modulo.mostrar = haysubmodulos.includes(true);
            }
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
    debugger;
    if(this.myForm.value.esActivo == 'true'){
      this.myForm.controls.esActivo.setValue(true);
      this.myForm.controls.esActivo.updateValueAndValidity();
    }
    if(this.myForm.value.esActivo == 'false'){
      this.myForm.controls.esActivo.setValue(false);
      this.myForm.controls.esActivo.updateValueAndValidity();
    }
    let objenviar = {
      esActivo: this.myForm.value.esActivo,
      nombreRol: this.myForm.value.nombre,
      centrocClienteId: this.usuariosSistemaPrd.getIdEmpresa(),
      rolId: this.objrol.rolId,
    }

    if (!this.verificandoSeleccionadoAlguno()) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "No se ha seleccionado ningun permiso");
        return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.rolesPrd.modificarRol(objenviar).subscribe(datos => {
      if (datos.resultado) {
        const rolId: number = datos.datos.rolId;
       
        let enviarArray = this.formandoPermisos(rolId);
        let enviarArraySinPermiso = this.quitandoPermisos(rolId);





        if (enviarArray.submodulosXpemisos.length !== 0) {
          this.rolesPrd.guardarPermisoxModulo(enviarArray).subscribe(valorDatos => {
            if (valorDatos.resultado) {

              if (enviarArraySinPermiso.submodulosXpemisos.length !== 0) {
                this.rolesPrd.quitarPermisoxModulo(enviarArraySinPermiso).subscribe(sinpermiso => {
                  this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
                  this.modalPrd.showMessageDialog(sinpermiso.resultado, sinpermiso.mensaje).then(() => {
                    if (sinpermiso.resultado) {
                      this.routerPrd.navigate(["/rolesypermisos/lista"]);
                    }
                  });
                });
              } else {

                this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
                this.modalPrd.showMessageDialog(valorDatos.resultado, valorDatos.mensaje).then(() => {
                  if (valorDatos.resultado) {
                    this.routerPrd.navigate(["/rolesypermisos/lista"]);
                  }
                });

              }

            } else {
              this.modalPrd.showMessageDialog(valorDatos.resultado, valorDatos.mensaje);
            }
          });
        } else {
          if (enviarArraySinPermiso.submodulosXpemisos.length !== 0) {
            this.rolesPrd.quitarPermisoxModulo(enviarArraySinPermiso).subscribe(sinpermiso => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(sinpermiso.resultado, sinpermiso.mensaje).then(() => {
                if (sinpermiso.resultado) {
                  this.routerPrd.navigate(["/rolesypermisos/lista"]);
                }
              });
            });
          } else {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.routerPrd.navigate(["/rolesypermisos/lista"]);
              }
            });
          }
        }

      } else {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      }
    });
  }

  public verificandoSeleccionadoAlguno(): Boolean {
    let verificando: boolean = false;

    for (let item of this.arreglo) {
      if (item.checked) {
        if (item.submodulos) {
          for (let item2 of item.submodulos) {
            if ((item2.checked)) {
              if (item2.permisos) {
                for (let item3 of item2.permisos) {

                  if (item3.checked) {
                     return true;
                  }
                }
              }
            }
          }
        }
      }
    }

    return verificando;
  }

  public realizarGuardado() {
    debugger;

    let objenviar = {
      nombreRol: this.myForm.value.nombre,
      centrocClienteId: this.usuariosSistemaPrd.getIdEmpresa()
    }

    let temp = this.formandoPermisos(0);
    if (temp.submodulosXpemisos.length == 0) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "No se ha seleccionado ningun permiso");
      return;
    }


    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.rolesPrd.guardarRol(objenviar).subscribe(datos => {
      if (datos.resultado) {
        const rolId: number = datos.datos.rolId;
        temp.rolId = rolId;
        let enviarArray = temp;


        if (enviarArray.submodulosXpemisos.length !== 0) {
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
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            if (datos.resultado) {
              this.routerPrd.navigate(["/rolesypermisos/lista"]);
            }
          });
        }

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
                  if (valor.previo) {
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
            if (valor.previo) {
              let idSubmodulo = valor.submoduloId;
              valor.permisos?.forEach(valor2 => {
                if (valor2.previo) {
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

    if(!this.arreglo[numero].checked) return;

    this.arreglo[numero].seleccionado = !this.arreglo[numero].seleccionado;
  }


  public get f() {
    return this.myForm.controls;
  }


  public desplegar(indice:any){
    setTimeout(() => {
      this.arreglo[indice].seleccionado = this.arreglo[indice].checked;
    }, 10);
  }



}
