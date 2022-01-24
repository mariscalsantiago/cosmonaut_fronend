import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
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
    private routerPrd: Router, private modalPrd: ModalService, public configuracionPrd:ConfiguracionesService,
    private usuariosAuth:UsuariosauthService) { }

  ngOnInit(): void {
    if(!Boolean(this.datosPersona[0].personaId)){
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
      fechaNacimiento: [{value: new DatePipe("es-MX").transform(obj.fechaNacimiento, 'yyyy-MM-dd')?.replace(".", "") || "",disabled:true}],
      tieneCurp: [true],
      contactoInicialEmailPersonal: [obj?.contactoInicialEmailPersonal?.toLowerCase(), [ Validators.email]],
      emailCorporativo: [obj?.emailCorporativo?.toLowerCase(), [Validators.required, Validators.email]],
      invitarEmpleado: obj.invitarEmpleado,
      nacionalidadId: [obj.nacionalidadId?.nacionalidadId, [Validators.required]],
      estadoCivil: obj.estadoCivil,
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      tieneHijos: obj.tieneHijos || "false",
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
      rfc: [obj.rfc, [Validators.required, Validators.pattern(ConfiguracionesService.regexRFCFisica)]],
      curp: [obj.curp, [Validators.required, Validators.pattern(ConfiguracionesService.regexCurp)]]
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
    let obj = {
      perfilesPendientes: true
    }
    this.configuracionPrd.breadcrum.permisos.push(obj);
    this.routerPrd.navigate(['/empleados']);

  }


  public enviarFormulario() {



    this.submitEnviado = true;


    if (this.myform.invalid) {


      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    let moralFiscia = this.myform.controls.rfc.value.substr(10,12).length;
    if(moralFiscia === 3){
      let rfcFisica = this.myform.controls.rfc.value.substr(0,10);
      let curp = this.myform.controls.curp.value.substr(0,10);
      if(curp !== rfcFisica){
        this.modalPrd.showMessageDialog(this.modalPrd.error,"Los datos de RFC y CURP no corresponden");
  
        return;
      }
    }


    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas guardar cambios?").then(valor => {

      if (valor) {
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
       
        
        if(!Boolean(this.datosPersona[0].tieneContrato)){
          this.usuarioSistemaPrd.getInformacionAdicionalUser(encodeURIComponent(this.myform.controls.emailCorporativo.value)).subscribe(datos =>{
            if(Boolean(datos.datos)){
              this.modalPrd.showMessageDialog(this.modalPrd.error,"No es posible registrar como cuenta de usuario, el correo empresarial ya existe");
                return;
            }
  
            this.guardarCambios();
          });
        }else{
          this.guardarCambios(true);
        }
      }

    });

  }

  public guardarCambios(cambiaUsuarioSistema:boolean = false) {
    
    
    let obj = this.myform.getRawValue();
    obj.fechaNacimiento = new DatePipe("es-MX").transform(new Date(obj.fechaNacimiento), 'yyyy-MM-dd');

    let objenviar:any = {
      nombre: obj.nombre,
      apellidoPaterno: obj.apellidoPaterno,
      apellidoMaterno: obj.apellidoMaterno,
      genero: obj.genero,
      fechaNacimiento: obj.fechaNacimiento,
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


    if(!Boolean(obj.contactoEmergenciaParentesco)){
      delete objenviar.parentescoId;
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
  
        if(cambiaUsuarioSistema){
          this.usuarioSistemaPrd.getInformacionAdicionalUser(encodeURIComponent(this.datosPersona[0].emailCorporativo)).subscribe(vv =>{
            this.guardaUsuarioSistema(datos.datos,obj.emailCorporativo,vv.datos);
          });
        }else{
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
            if (datos.resultado) {
              this.enviado.emit({ type: "informacion", datos: datos.datos });
            }
          });
        }
  
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
      this.myform.controls.numeroHijos.setValue("");
      this.myform.controls.numeroHijos.disable();
    }
  }


  public cambiaCurp(){
    debugger;
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
        

        let anioNacimiento:Date;
        let anyo;
        let mes1:any;
        let dia1:any;
        let fecha;
        let m = this.myform.value.curp.match( /^\w{4}(\w{2})(\w{2})(\w{2})/ );
        if(this.myform.value.curp.substring(16,17).match("[0-9]+")){
          
           //  anioNacimiento = (anio <= anioCalculado_year)?new Date(Number(anio)+Number(2000),mes-1,dia):new Date(anio,mes-1,dia);
            anyo = parseInt(m[1],10)+1900;
            if( anyo < 2000 ) 
              anyo -= 100;
           if( anyo < 1950 ) 
             anyo += 100;
           mes1 = parseInt(m[2], 10)-1;
            dia1 = parseInt(m[3], 10);
            fecha =new Date( anyo, mes1, dia1 );
        }else{
            anyo = parseInt(m[1],10)+1900;
            if( anyo < 2000 ) 
              anyo += 100;
            mes1 = parseInt(m[2], 10)-1;
            dia1 = parseInt(m[3], 10);
            fecha =new Date( anyo, mes1, dia1 );
            // anioNacimiento = (anio <= anioCalculado_year)?new Date(Number(anio)+Number(2000),mes-1,dia):new Date(anio,mes-1,dia);
        }
        //const anioNacimiento:Date = (anio <= anioCalculado_year)?new Date(Number(anio)+Number(2000),mes-1,dia):new Date(anio,mes-1,dia);      
        this.myform.controls.fechaNacimiento.setValue(datePipe.transform(fecha,"yyyy-MM-dd"));


    }else{
      this.myform.controls.genero.setValue("");
      this.myform.controls.fechaNacimiento.setValue("");
    }
  }

  private guardaUsuarioSistema(datos:any,email:string,vv2:any){
      let objAuthEnviar = {
        nombre: this.datosPersona[0].nombre,
        apellidoPat: this.datosPersona[0].apellidoPaterno,
        apellidoMat: this.datosPersona[0].apellidoMaterno,
        email: email,
        centrocClienteIds: [this.usuarioSistemaPrd.getIdEmpresa()],
        rolId: 2,
        version: this.usuarioSistemaPrd.getVersionSistema(),
        usuarioId:undefined,
        esActivo:undefined,
        esMulticliente:undefined
      }

      if(vv2){
        objAuthEnviar.usuarioId=vv2.usuario.usuarioId;
        objAuthEnviar.esActivo=vv2.usuario.esActivo;
        objAuthEnviar.esMulticliente=vv2.usuario.esMulticliente;
        this.usuariosAuth.modificar(objAuthEnviar).subscribe(vv => {
          this.modalPrd.showMessageDialog(vv.resultado, vv.mensaje);
          if (vv.resultado) {
            datos.tieneContrato = this.datosPersona[0].tieneContrato;
            datos.reactivarCuenta = this.datosPersona[0].reactivarCuenta;
            this.enviado.emit({ type: "informacion", datos: datos });
          }
        });
      }else{
        this.usuariosAuth.guardar(objAuthEnviar).subscribe(vv => {
          this.modalPrd.showMessageDialog(vv.resultado, vv.mensaje);
          if (vv.resultado) {
            datos.tieneContrato = this.datosPersona[0].tieneContrato;            
            datos.reactivarCuenta = this.datosPersona[0].reactivarCuenta;
            this.enviado.emit({ type: "informacion", datos: datos });
          }
        });
      }
  }

}

