import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-informacionbasica',
  templateUrl: './informacionbasica.component.html',
  styleUrls: ['./informacionbasica.component.scss']
})
export class InformacionbasicaComponent implements OnInit {

  @Output() enviado = new EventEmitter();



  public myform!: FormGroup;

  public submitEnviado: boolean = false;

  public arreglonacionalidad: any = [];
  public mostrarRfc: boolean = false;


  constructor(private formBuilder: FormBuilder, private catalogosPrd: CatalogosService,
    private empleadosPrd: EmpleadosService, private usuarioSistemaPrd: UsuarioSistemaService,
    private routerPrd: Router,private modalPrd:ModalService) { }

  ngOnInit(): void {
    this.myform = this.createForm({});

    this.catalogosPrd.getNacinalidades().subscribe(datos => this.arreglonacionalidad = datos.datos);

  }


  public createForm(obj: any) {
    return this.formBuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: [obj.apellidoMaterno],
      genero: [obj.genero],
      fechaNacimiento: [obj.fechaNacimiento],
      tieneCurp: [obj.tieneCurp],
      contactoInicialEmailPersonal: [obj.contactoInicialEmailPersonal, [Validators.required, Validators.email]],
      emailCorporativo: [obj.emailCorporativo],
      invitarEmpleado: obj.invitarEmpleado,
      nacionalidadId: [obj.nacionalidadId?.nacionalidadId, [Validators.required]],
      estadoCivil: obj.estadoCivil,
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      tieneHijos: "false",
      numeroHijos: {value:obj.numeroHijos,disabled:true},
      url: obj.medioContacto?.url,
      contactoEmergenciaNombre: [obj.contactoEmergenciaNombre, [Validators.required]],
      contactoEmergenciaApellidoPaterno: [obj.contactoEmergenciaApellidoPaterno, [Validators.required]],
      contactoEmergenciaApellidoMaterno: obj.contactoEmergenciaApellidoMaterno,
      contactoEmergenciaParentesco: obj.contactoEmergenciaParentesco,
      contactoEmergenciaEmail: [obj.contactoEmergenciaEmail, [Validators.email]],
      contactoEmergenciaTelefono: obj.contactoEmergenciaTelefono,
      nss: obj.nss,
      rfc: [obj.rfc, [Validators.required, Validators.pattern('[A-Za-z,ñ,Ñ,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Za-z,0-9]?[A-Za-z,0-9]?[0-9,A-Za-z]?')]],
      curp: [obj.curp, [Validators.required, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)]]
    });
  }


  public guardar() {
    this.enviado.emit({ type: "informacion", valor: true });
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

  
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas guardar cambios?").then(valor =>{

      if(valor){
          this.guardarCambios();
      }

    });

  }

  public guardarCambios(){
    let obj = this.myform.value;

    let fechanacimiento = '';

    if (this.myform.controls.fechaNacimiento.value != null && this.myform.controls.fechaNacimiento.value != '') {
      let date: Date = new Date(`${obj.fechaNacimiento}T12:00-0600`);
      let dia = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
      let mes = (date.getMonth() + 1) < 10 ? `0${date.getMonth()}` : `${date.getMonth()}`;
      let anio = date.getFullYear();
      fechanacimiento = `${dia}/${mes}/${anio}`;
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
      tieneHijos: obj.tieneHijos,
      numeroHijos: obj.numeroHijos,
      medioContacto: {
        url: obj.url
      },
      contactoEmergenciaNombre: obj.contactoEmergenciaNombre,
      contactoEmergenciaApellidoPaterno: obj.contactoEmergenciaApellidoPaterno,
      contactoEmergenciaApellidoMaterno: obj.contactoEmergenciaApellidoMaterno,
      contactoEmergenciaParentesco: obj.contactoEmergenciaParentesco,
      contactoEmergenciaEmail: obj.contactoEmergenciaEmail,
      contactoEmergenciaTelefono: obj.contactoEmergenciaTelefono,
      centrocClienteId: {
        centrocClienteId: this.usuarioSistemaPrd.getIdEmpresa()
      },
      curp: obj.curp,
      rfc: obj.rfc,
      nns: obj.nns
    }


    this.empleadosPrd.save(objenviar).subscribe(datos => {

     
      this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
        if(datos.resultado){
          this.enviado.emit({type:"informacion",datos:datos.datos})
        }
      });
    });

  }

  public get f() {
    return this.myform.controls;
  }

  public cambiaValorHijos(){
    
    if(this.myform.controls.tieneHijos.value == "true"){
      this.myform.controls.numeroHijos.enable();
    }else{
      this.myform.controls.numeroHijos.disable();
    }
  }


}
