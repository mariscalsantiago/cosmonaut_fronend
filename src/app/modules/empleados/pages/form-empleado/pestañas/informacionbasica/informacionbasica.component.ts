import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { validacionesForms } from 'src/app/shared/validaciones/validaciones';

@Component({
  selector: 'app-informacionbasica',
  templateUrl: './informacionbasica.component.html',
  styleUrls: ['./informacionbasica.component.scss']
})
export class InformacionbasicaComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() datosPersona: any;



  public myform!: FormGroup;

  public submitEnviado: boolean = false;

  public arreglonacionalidad: any = [];
  public mostrarRfc: boolean = false;
  public arregloParentezco: any = [];
  public constNacionalidad: number = 1;




  constructor(private formBuilder: FormBuilder, private catalogosPrd: CatalogosService,
    private empleadosPrd: EmpleadosService, private usuarioSistemaPrd: UsuarioSistemaService,
    private routerPrd: Router, private modalPrd: ModalService) { }

  ngOnInit(): void {
    if(this.datosPersona[0].insertar === undefined){
     let obj = {
        nacionalidadId: {}
      };
      this.myform = this.createForm(obj);
    }else{

    this.myform = this.createForm(this.datosPersona[0]);
    }

    this.catalogosPrd.getNacinalidades(true).subscribe(datos => this.arreglonacionalidad = datos.datos);
    this.catalogosPrd.getCatalogoParentezco(true).subscribe(datos => this.arregloParentezco = datos.datos);

  }




  public createForm(obj: any) {
    const pipe = new DatePipe("es-MX");

    if(obj.nacionalidadId.nacionalidadId === undefined){
      obj.nacionalidadId.nacionalidadId = this.constNacionalidad;
      }


    return this.formBuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: [obj.apellidoMaterno],
      genero: [{value:obj.genero,disabled:true}],
      fechaNacimiento: [{value:(obj.fechaNacimiento !== undefined && obj.fechaNacimiento !== "") ? pipe.transform(new Date(Number(obj.fechaNacimiento)), "yyyy-MM-dd") : obj.fechaNacimiento,disabled:true}],
      tieneCurp: [true],
      contactoInicialEmailPersonal: [obj?.contactoInicialEmailPersonal?.toLowerCase(), [ Validators.email]],
      emailCorporativo: [obj?.emailCorporativo?.toLowerCase(), [Validators.required, Validators.email]],
      invitarEmpleado: obj.invitarEmpleado,
      nacionalidadId: [obj.nacionalidadId?.nacionalidadId, [Validators.required]],
      estadoCivil: obj.estadoCivil,
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      tieneHijos: obj.tieneHijos == undefined ? "false" : `${obj.tieneHijos}`,
      numeroHijos: { value: obj.numeroHijos, disabled: true },
      url: obj.urlLinkedin,
      contactoEmergenciaNombre: [obj.contactoEmergenciaNombre],
      contactoEmergenciaApellidoPaterno: [obj.contactoEmergenciaApellidoPaterno],
      contactoEmergenciaApellidoMaterno: obj.contactoEmergenciaApellidoMaterno,
      contactoEmergenciaParentesco: obj.parentescoId?.parentescoId,
      celular: [obj.celular, []],
      contactoEmergenciaEmail: [obj.contactoEmergenciaEmail?.toLowerCase(), [Validators.email]],
      contactoEmergenciaTelefono: [obj.contactoEmergenciaTelefono, []],
      nss: [obj.nss, [validacionesForms.nssValido,Validators.required]],
      rfc: [obj.rfc, [Validators.required, Validators.pattern('^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])([A-Z]|[0-9]){2}([A]|[0-9]){1})?$')]],
      curp: [obj.curp, [Validators.required, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)]]
    });

  }


  public guardar() {
    this.enviado.emit({ type: "informacion", valor: true });
  }

  public validarfechNacimiento(fecha: any) {

    

    var x = new Date();
    var fecha = fecha.split("-");
    x.setFullYear(fecha[0], fecha[1] - 1, fecha[2]);
    var today = new Date();

    if (x > today) {

      this.modalPrd.showMessageDialog(false, 'La fecha debe ser igual o menor a la fecha actual')
        .then(() => {
          this.myform.controls.fechaNacimiento.setValue("");
        });
    }
  }

  public cancelar() {

    this.routerPrd.navigate(['/empleados']);

  }


  public enviarFormulario() {



    this.submitEnviado = true;

    console.log(this.myform.getRawValue());


    if (this.myform.invalid) {


      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }


    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas guardar cambios?").then(valor => {

      if (valor) {
        this.guardarCambios();
      }

    });

  }

  public guardarCambios() {
    let obj = this.myform.getRawValue();

  

    let fechanacimiento = '';


    if (this.myform.controls.fechaNacimiento.value != null && this.myform.controls.fechaNacimiento.value != '') {
      const fecha1 = new Date(this.myform.controls.fechaNacimiento.value).toUTCString().replace("GMT", "");
      fechanacimiento = `${new Date(fecha1).getTime()}`;
    }


    let objenviar:any = {
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
      contactoEmergenciaEmail: obj.contactoEmergenciaEmail?.toLowerCase(),
      contactoEmergenciaTelefono: obj.contactoEmergenciaTelefono,
      centrocClienteId: {
        centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
      },
      curp: obj.curp,
      rfc: obj.rfc,
      nss: obj.nss
    }


    
    
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    if(this.datosPersona[0].personaId == undefined){

      this.empleadosPrd.save(objenviar).subscribe(datos => {

       

        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
  
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
          if (datos.resultado) {
            this.enviado.emit({ type: "informacion", datos: datos.datos });
          }
        });
  
      });
    }else{
      objenviar.personaId = this.datosPersona[0].personaId;
      this.empleadosPrd.update(objenviar).subscribe(datos => {

        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
  
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
          if (datos.resultado) {
            this.enviado.emit({ type: "informacion", datos: datos.datos });
          }
        });
  
      });
    }

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


  public cambiaCurp(){
    if(this.myform.controls.curp.valid){
      const datePipe = new DatePipe("es-MX");
        let genero = this.myform.value.curp.slice(10,11);
        this.myform.controls.genero.setValue(genero=="M"?"F":"M");

        let anio:number = this.myform.value.curp.slice(4,6);
        let mes:number = this.myform.value.curp.slice(6,8);
        let dia:number = this.myform.value.curp.slice(8,10);

        let anioactual = new Date();
        let anioCalculado = new Date(anioactual.getFullYear()-70,anioactual.getMonth(),anioactual.getDate());
        let anioCalculado_year:number = Number(datePipe.transform(anioCalculado,"yy"))
        


        const anioNacimiento:Date = (anio <= anioCalculado_year)?new Date(Number(anio)+Number(2000),mes-1,dia):new Date(anio,mes-1,dia);

        
        this.myform.controls.fechaNacimiento.setValue(datePipe.transform(anioNacimiento,"yyyy-MM-dd"));


    }else{
      this.myform.controls.genero.setValue("");
      this.myform.controls.fechaNacimiento.setValue("");
    }
  }


}

