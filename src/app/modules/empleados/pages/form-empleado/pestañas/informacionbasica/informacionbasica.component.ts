import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { validacionesForms } from 'src/app/shared/validaciones/validaciones';

@Component({
  selector: 'app-informacionbasica',
  templateUrl: './informacionbasica.component.html',
  styleUrls: ['./informacionbasica.component.scss']
})
export class InformacionbasicaComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() datosPersona:any;



  public myform!: FormGroup;

  public submitEnviado: boolean = false;

  public arreglonacionalidad: any = [];
  public mostrarRfc: boolean = false;
  public arregloParentezco: any = [];

  


  constructor(private formBuilder: FormBuilder, private catalogosPrd: CatalogosService,
    private empleadosPrd: EmpleadosService, private usuarioSistemaPrd: UsuarioSistemaService,
    private routerPrd: Router, private modalPrd: ModalService) { }

  ngOnInit(): void {
    console.log("Vuelve a iniciar");
    console.log(this.datosPersona);
    this.myform = this.createForm(this.datosPersona[0]);

    this.catalogosPrd.getNacinalidades(true).subscribe(datos => this.arreglonacionalidad = datos.datos);
    this.catalogosPrd.getCatalogoParentezco(true).subscribe(datos => this.arregloParentezco = datos.datos);

  }

  


  public createForm(obj: any) {

    const pipe = new DatePipe("es-MX");


    return this.formBuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: [obj.apellidoMaterno],
      genero: [obj.genero],
      fechaNacimiento: [(obj.fechaNacimiento!==undefined && obj.fechaNacimiento!=="")?pipe.transform(new Date(Number(obj.fechaNacimiento)),"yyyy-MM-dd"):obj.fechaNacimiento],
      tieneCurp: [true],
      contactoInicialEmailPersonal: [obj.contactoInicialEmailPersonal, [Validators.required, Validators.email]],
      emailCorporativo: [obj.emailCorporativo, [Validators.required, Validators.email]],
      invitarEmpleado: obj.invitarEmpleado,
      nacionalidadId: [obj.nacionalidadId?.nacionalidadId, [Validators.required]],
      estadoCivil: obj.estadoCivil,
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      tieneHijos: obj.tieneHijos == undefined?"false":obj.tieneHijos,
      numeroHijos: { value: obj.numeroHijos, disabled: true },
      url: obj.urlLinkedin,
      contactoEmergenciaNombre: [obj.contactoEmergenciaNombre, [Validators.required]],
      contactoEmergenciaApellidoPaterno: [obj.contactoEmergenciaApellidoPaterno, [Validators.required]],
      contactoEmergenciaApellidoMaterno: obj.contactoEmergenciaApellidoMaterno,
      contactoEmergenciaParentesco: obj.parentescoId?.parentescoId,
      celular: [obj.celular, [Validators.required]],
      contactoEmergenciaEmail: [obj.contactoEmergenciaEmail, [Validators.email]],
      contactoEmergenciaTelefono: [obj.contactoEmergenciaTelefono, [Validators.required]],
      nss: [obj.nss, [validacionesForms.nssValido]],
      rfc: [obj.rfc, [Validators.required, Validators.pattern('^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})?$')]],
      curp: [obj.curp, [Validators.required, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)]]
    });

  }


  public guardar() {
    this.enviado.emit({ type: "informacion", valor: true });
  }

  public validarfechNacimiento(fecha:any){

    debugger;

      var x=new Date();
      var fecha = fecha.split("-");
      x.setFullYear(fecha[0],fecha[1]-1,fecha[2]);
      var today = new Date();
 
      if (x > today){
        
        this.modalPrd.showMessageDialog(false, 'La fecha debe ser igual o menor a la fecha actual')
        .then(()=> {
          this.myform.controls.fechaNacimiento.setValue("");
        });
      }
  }

  public cancelar() {

    this.routerPrd.navigate(['/empleados']);

  }


  public enviarFormulario() {



    this.submitEnviado = true;

    let noesRFC: boolean = (this.myform.controls.tieneCurp.value == null || this.myform.controls.tieneCurp.value == false);

    if (this.myform.invalid) {
      let invalido: boolean = true;
      if (noesRFC) {
        for (let item in this.myform.controls) {

          if (item == "rfc" || item == "curp")
            continue;

          if (this.myform.controls[item].invalid) {
            invalido = true;
            break;
          }
          invalido = false;
        }
      }

      if (invalido) {
        this.modalPrd.showMessageDialog(this.modalPrd.error);
        return;
      }
    }


    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas guardar cambios?").then(valor => {

      if (valor) {
        this.guardarCambios();
      }

    });

  }

  public guardarCambios() {
    let obj = this.myform.value;

    let fechanacimiento = '';


    if (this.myform.controls.fechaNacimiento.value != null && this.myform.controls.fechaNacimiento.value != '') {
      const fecha1 = new Date(this.myform.controls.fechaNacimiento.value).toUTCString().replace("GMT", "");
      fechanacimiento = `${new Date(fecha1).getTime()}`;
    }


    let objenviar = {
      nombre: obj.nombre,
      apellidoPaterno: obj.apellidoPaterno,
      apellidoMaterno: obj.apellidoMaterno,
      genero: obj.genero,
      fechaNacimiento: fechanacimiento,
      tieneCurp: obj.tieneCurp,
      contactoInicialEmailPersonal: obj.contactoInicialEmailPersonal,
      emailCorporativo: obj.emailCorporativo,
      invitarEmpleado: obj.invitarEmpleado,
      nacionalidadId: {
        nacionalidadId: obj.nacionalidadId
      },
      estadoCivil: obj.estadoCivil,
      contactoInicialTelefono: obj.contactoInicialTelefono,
      celular: obj.celular,
      tieneHijos: obj.tieneHijos,
      numeroHijos: obj.numeroHijos,
      urlLinkedin: obj.url,
      contactoEmergenciaNombre: obj.contactoEmergenciaNombre,
      contactoEmergenciaApellidoPaterno: obj.contactoEmergenciaApellidoPaterno,
      contactoEmergenciaApellidoMaterno: obj.contactoEmergenciaApellidoMaterno,
      parentescoId: {
        parentescoId: obj.contactoEmergenciaParentesco
      },
      contactoEmergenciaEmail: obj.contactoEmergenciaEmail,
      contactoEmergenciaTelefono: obj.contactoEmergenciaTelefono,
      centrocClienteId: {
        centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
      },
      curp: obj.curp,
      rfc: obj.rfc,
      nss: obj.nss
    }


    console.log("Parentezco y nss", JSON.stringify(objenviar));

    this.enviado.emit({ type: "informacion", datos: objenviar })

  }

  public get f() {
    return this.myform.controls;
  }

  public cambiaValorHijos() {

    if (this.myform.controls.tieneHijos.value == "true") {
      this.myform.controls.numeroHijos.enable();
    } else {
      this.myform.controls.numeroHijos.disable();
    }
  }


}
