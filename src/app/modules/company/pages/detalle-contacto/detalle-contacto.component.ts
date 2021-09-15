import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-detalle-contacto',
  templateUrl: './detalle-contacto.component.html',
  styleUrls: ['./detalle-contacto.component.scss']
})
export class DetalleContactoComponent implements OnInit {
  @ViewChild("nombre") public nombre!: ElementRef;

  public myFormcont!: FormGroup;
  public arreglo: any = [];
  public contacto: boolean = false;
  public listcontacto: boolean = false;
  public compania: boolean = true;
  public companiaprincipal: boolean = true;
  public insertar: boolean = false;
  public fechaActual!: Date;
  public objcontacto: any;
  public fechaAlta: string = "";
  public cargando: Boolean = false;
  public centrocClienteId: number = 1;
  public datosEmpresa: any;

  public submitEnviado: boolean = false;
  public esModificaEmpresa: boolean = false;

  public cargandoCheckbox: boolean = false;
  public tieneUsuarioInicial: boolean = false;



  constructor(private formBuilder: FormBuilder, private companyPrd: CompanyService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private modalPrd: ModalService, private usuariosAuth: UsuariosauthService, public configuracionPrd: ConfiguracionesService,
    private usuarioSistemaPrd: UsuarioSistemaService) {

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
    });





    this.fechaActual = new Date();

  }

  ngOnInit(): void {

    this.objcontacto = history.state.datos == undefined ? {} : history.state.datos;
    this.datosEmpresa = history.state.empresa == undefined ? {} : history.state.empresa;
    this.esModificaEmpresa = history.state.modificaEmpresa == undefined ? false : history.state.modificaEmpresa;

    this.myFormcont = this.createFormcont((this.objcontacto));

    if (Boolean(history.state.datos)) {

      this.cargandoCheckbox = true;
      this.usuarioSistemaPrd.getInformacionAdicionalUser(encodeURIComponent(this.objcontacto?.emailCorporativo)).subscribe(valorusuario => {
        this.cargandoCheckbox = false;
        this.myFormcont.controls.usuarioinicial.setValue(Boolean(valorusuario.datos));
        this.tieneUsuarioInicial = Boolean(valorusuario.datos);
        if(this.tieneUsuarioInicial){
          this.myFormcont.controls.usuarioinicial.disable();
          this.myFormcont.controls.emailCorporativo.disable();
        }
      });
    }

  }


  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }


  public createFormcont(obj: any) {
    
    console.log("Esta es el obj",obj);
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: [obj.apellidoMaterno],
      celular: [obj.celular],
      curp: [obj.curp, Validators.pattern(ConfiguracionesService.regexCurp)],
      emailCorporativo: [obj.emailCorporativo?.toLowerCase(), [Validators.required, Validators.email]],
      contactoInicialEmailPersonal: [obj.contactoInicialEmailPersonal?.toLowerCase(), [Validators.email]],
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      fechaAlta: [{ value: obj.fechaAlta, disabled: true }, [Validators.required]],
      personaId: obj.personaId,
      contactoInicialPuesto: obj.contactoInicialPuesto,
      usuarioinicial: [obj.usuarioinicial]

    });
  }

  public enviarPeticioncont() {

    this.submitEnviado = true;


    if (this.myFormcont.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    let mensaje = this.insertar ? "¿Deseas registrar el contacto?" : "¿Deseas actualizar los datos del contacto inicial?";


    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {
        let obj = this.myFormcont.getRawValue();
        obj = {
          ...obj,
          fechaAlta: this.fechaActual,
        };
        let objEnviar: any = {
          nombre: obj.nombre,
          apellidoPaterno: obj.apellidoPaterno,
          apellidoMaterno: obj.apellidoMaterno,
          curp: obj.curp,
          celular: obj.celular,
          //fechaAlta: obj.fechaAlta,
          emailCorporativo: obj.emailCorporativo?.toLowerCase(),
          contactoInicialEmailPersonal: obj.contactoInicialEmailPersonal?.toLowerCase(),
          contactoInicialTelefono: obj.contactoInicialTelefono,
          centrocClienteId: {
            centrocClienteId: this.datosEmpresa.centrocClienteId
          },
          contactoInicialPuesto: obj.contactoInicialPuesto
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);


        if (this.insertar) {

          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.companyPrd.savecont(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

            if (datos.resultado) {
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
                .then(() => {

                  if (obj.usuarioinicial) {
                    let objAuthEnviar = {
                      nombre: obj.nombre,
                      apellidoPat: obj.apellidoPaterno,
                      apellidoMat: obj.apellidoMaterno,
                      email: obj.emailCorporativo?.toLowerCase(),
                      centrocClienteIds: [this.datosEmpresa.centrocClienteId],
                      rolId: 1,
                      version:this.usuarioSistemaPrd.getVersionSistema()
                    }

                    this.usuariosAuth.guardar(objAuthEnviar).subscribe(vv => {
                      if (!vv.resultado) {
                        this.modalPrd.showMessageDialog(vv.resultado, vv.mensaje);
                      }
                    });
                  }

                  if (this.esModificaEmpresa) {
                    this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: this.datosEmpresa } });
                  } else {
                    this.routerPrd.navigate(['company'])
                  }
                });
            } else {
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
            }

            this.compania = false;
            this.contacto = true;

          });
        } else {

          objEnviar.personaId = obj.personaId;


          objEnviar.tipoPersonaId = {
            tipoPersonaId:2
          }


          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.companyPrd.modificarCont(objEnviar).subscribe(datos => {
            
            if (datos.resultado) {
              if (!this.tieneUsuarioInicial) {
                if (obj.usuarioinicial) {
                  let objAuthEnviar = {
                    nombre: obj.nombre,
                    apellidoPat: obj.apellidoPaterno,
                    apellidoMat: obj.apellidoMaterno,
                    email: obj.emailCorporativo?.toLowerCase(),
                    centrocClienteIds: [this.datosEmpresa.centrocClienteId],
                    rolId: 1,
                    version:this.usuarioSistemaPrd.getVersionSistema()
                  }

                  this.usuariosAuth.guardar(objAuthEnviar).subscribe(vv => {
                    if (!vv.resultado) {
                      this.modalPrd.showMessageDialog(vv.resultado, vv.mensaje);
                    } else {
                      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
                        .then(() => this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: this.datosEmpresa } }));
                    }
                  });
                } else {
                  this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
                    .then(() => this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: this.datosEmpresa } }));
                }
              } else {
                this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
                  .then(() => this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: this.datosEmpresa } }));
              }
            } else {
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
            }

            this.listcontacto = true;
            this.compania = false;

          });
        }

      }
    })

  }


  public redirect(obj: any) {
    this.routerPrd.navigate(["/company"]);
  }


  public regresarPantallaPrincipal() {
    this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: this.datosEmpresa } });
  }



  get f() { return this.myFormcont.controls; }


}
