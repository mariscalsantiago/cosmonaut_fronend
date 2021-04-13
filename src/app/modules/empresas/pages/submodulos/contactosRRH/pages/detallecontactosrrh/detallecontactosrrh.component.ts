import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuariocontactorrhService } from '../services/usuariocontactorrh.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-detallecontactosrrh',
  templateUrl: './detallecontactosrrh.component.html',
  styleUrls: ['./detallecontactosrrh.component.scss']
})
export class DetallecontactosrrhComponent implements OnInit {

  @ViewChild("nombre") public nombre!: ElementRef;

  public myForm!: FormGroup;
  public fechaActual: string = "";
  public subbmitActive: boolean = false;
  public id_empresa: number = 0;
  public esInsert: boolean = true;
  public usuario: any;
  constructor(private formBuild: FormBuilder, private usuariosPrd: UsuariocontactorrhService, private ActiveRouter: ActivatedRoute,
    private routerPrd: Router, private modalPrd: ModalService) { }

  ngOnInit(): void {


    this.ActiveRouter.params.subscribe(datos => {
      this.id_empresa = datos["id"];
      if (datos["tipoinsert"] == "nuevo") {
        this.esInsert = true;
      } else if (datos["tipoinsert"] == "editar") {
        this.esInsert = false;
      } else {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'contactosrrh']);
      }
    });
    debugger;

    let obj = {};

    if (!this.esInsert) {//Solo cuando es modificar
      obj = history.state.data;
      this.usuario = obj;
      if (this.usuario == undefined) this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'contactosrrh']);
    }

    this.myForm = this.createForm(obj);

  }

  public createForm(obj: any) {


    let fecha = new Date();
    this.fechaActual = fecha.toLocaleDateString();
    let datePipe = new DatePipe("en-MX");
    return this.formBuild.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPat: [obj.apellidoPaterno, [Validators.required]],
      apellidoMat: [obj.apellidoMaterno],
      celular: [obj.celular, []],
      curp: [obj.curp, [Validators.required, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)]],
      emailCorp: [obj.emailCorporativo, [Validators.required, Validators.email]],
      ciEmailPersonal: [obj.contactoInicialEmailPersonal, [ Validators.email]],
      ciTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      ciExtension: [obj.contactoInicialExtension],
      //fechaAlta: [{ value: ((this.esInsert) ? datePipe.transform(new Date(), 'dd-MMM-y') : obj.fechaAlta), disabled: true }, [Validators.required]],
      personaId: [obj.personaId]

    });

  }

  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }



  public enviarPeticion() {


    this.subbmitActive = true;

    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }


    let titulo = this.esInsert ? "¿Desea registrar el contacto RRHH?" : "¿Desea actualizar los datos del contacto RRHH?";


    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {
        let obj = this.myForm.value;

        let peticion: any = {
          nombre: obj.nombre,
          apellidoPaterno: obj.apellidoPat,
          apellidoMaterno: obj.apellidoMat,
          curp: obj.curp,
          celular: obj.celular,
          emailCorporativo: obj.emailCorp,
          contactoInicialEmailPersonal: obj.ciEmailPersonal,
          contactoInicialTelefono: obj.ciTelefono,
          contactoInicialExtension: obj.ciExtension,
          centrocClienteId: {
            "centrocClienteId": this.id_empresa
          }
        };


        if (this.esInsert) {


          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.usuariosPrd.save(peticion).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
              .then(() => this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'contactosrrh']));
          });
        } else {

          peticion.personaId = obj.personaId;

          this.usuariosPrd.modificar(peticion).subscribe(datos => {

            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
              .then(() => this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'contactosrrh']));

          });

        }
      }
    });

  }


  public cancelar() {
    this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'contactosrrh']);
  }


  get f() {
    return this.myForm.controls;
  }

}
