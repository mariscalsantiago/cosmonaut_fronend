import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DomicilioService } from 'src/app/modules/empleados/services/domicilio.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ObservadorEmpleadosService } from 'src/app/modules/empleados/services/observador-empleados.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { validacionesForms } from 'src/app/shared/validaciones/validaciones';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  public myForm!: FormGroup;
  public submitEnviado: boolean = false;

  public domicilioCodigoPostal: any = [];
  public insertarDomicilio: boolean = false;



  public editarcampos: boolean = false;
  public empleado: any = {
    nacionalidadId: { descripcion: "" }
  };
 


  public idEmpleado: number = -1;

  public arreglonacionalidad?: Promise<any>;
  public arregloParenteesco?: Promise<any>;
  public domicilioArreglo: any = [{}];
  public nombreEstado: string = "";
  public idEstado: number = 0;
  public nombreMunicipio: string = "";
  public idMunicipio: number = 0;
  public noCoincide = '';
  public esKiosko:boolean = false;
  public generoName: string = '';
  public cambioFotoPerfil!:Subscription;

  constructor(private formBuilder: FormBuilder,
    private navparams: ActivatedRoute, private empleadoPrd: EmpleadosService,
    private catalogosPrd: CatalogosService, private usuarioSistemaPrd: UsuarioSistemaService,
    private modalPrd: ModalService, private domicilioPrd: DomicilioService,private router:Router,
    private usuarioAuthPrd:UsuariosauthService,private cambioFotoPerfilPrd:ObservadorEmpleadosService) { }

  ngOnInit(): void {
    this.esKiosko = this.router.url.includes("/kiosko/perfil");
    this.myForm = this.createForm({});
    this.navparams.params.subscribe(param => {

      this.idEmpleado = param["id"];
      this.traerInformacionDelEmpleado();

    });



    this.arreglonacionalidad = this.catalogosPrd.getNacinalidades(true).toPromise();

    this.arregloParenteesco = this.catalogosPrd.getCatalogoParentezco(true).toPromise();


  this.cambioFotoPerfil =   this.cambioFotoPerfilPrd.CambioFotoPerfil().subscribe(dato =>{
      if(dato){
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.traerInformacionDelEmpleado();
      }
    });
  }


  public traerInformacionDelEmpleado(){
    this.empleadoPrd.getEmpleadoById(this.idEmpleado).subscribe(datoscontrato => {


        
      this.empleado = datoscontrato.datos;
      this.parsearInformacion();
      this.domicilioPrd.getDomicilioPorEmpleadoNativo(this.idEmpleado).subscribe(datosnativo => {
        this.domicilioArreglo = datosnativo?.datos == undefined ?undefined:datosnativo?.datos[0];
      });

      this.domicilioPrd.getDomicilioPorEmpleado(this.idEmpleado).subscribe(datosdomicilio => {
        
        if (datosdomicilio.datos !== undefined) {

          
          for (let llave in datosdomicilio.datos[0]) {
            this.empleado[llave] = datosdomicilio.datos[0][llave];
          }
          this.myForm = this.createForm(this.empleado);
          this.buscar(undefined);

          
        } else {
         this.myForm =  this.createForm(this.empleado);
        }

        this.insertarDomicilio = datosdomicilio.datos == undefined;

        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      });





    });
  }





  public buscar(obj: any) {

    this.myForm.controls.estado.setValue("");
    this.myForm.controls.municipio.setValue("");
    this.noCoincide = '';

    let valor: string = this.myForm.controls.codigo.value;

    if (this.myForm.controls.codigo.errors?.pattern === undefined && valor !== null) {
      if (valor.trim() !== "") {

        this.catalogosPrd.getAsentamientoByCodigoPostal(valor).subscribe(datos => {

          if (datos.resultado) {
            this.domicilioCodigoPostal = datos.datos;

            for (let item of datos.datos) {

              this.nombreEstado = item.dedo;
              this.nombreMunicipio = item.dmnpio;
              this.idEstado = item.edo.estadoId;
              this.idMunicipio = item.catmnpio.cmnpio;

              this.myForm.controls.municipio.setValue(this.nombreMunicipio);
              this.myForm.controls.estado.setValue(this.nombreEstado);


            }


            this.myForm.controls.asentamientoId.enable();
            this.myForm.controls.numExterior.enable();
            this.myForm.controls.numInterior.enable();
            this.myForm.controls.calle.enable();
          } else {
            this.noCoincide= 'El código postal no fue encontrado';
            this.myForm.controls.asentamientoId.disable();
            this.myForm.controls.numExterior.disable();
            this.myForm.controls.numInterior.disable();
            this.myForm.controls.calle.disable();
            this.nombreEstado = "";
            this.nombreMunicipio = "";
            this.idEstado = -1;
            this.idMunicipio = -1;
            this.domicilioCodigoPostal = []

          }
        });

      }
    }
  }



  public parsearInformacion() {
    
      switch (this.empleado.estadoCivil) {
        case "S":
          this.empleado.estadoCivilDescripcion = "Soltero(a)";
          break;
        case "C":
          this.empleado.estadoCivilDescripcion = "Casado(a)";
          break;
        case "D":
          this.empleado.estadoCivilDescripcion = "Divorciado(a)";
          break;
        case "V":
          this.empleado.estadoCivilDescripcion = "Viudo(a)";
          break;
      }

    
  }

  public cambiaCurp(){
    
    if(this.myForm.controls.curp.valid){
      const datePipe = new DatePipe("es-MX");
        let genero = this.myForm.value.curp.slice(10,11);
        this.myForm.controls.genero.setValue(genero=="M"?"F":"M");

        let anio:number = this.myForm.value.curp.slice(4,6);
        let mes:number = this.myForm.value.curp.slice(6,8);
        let dia:number = this.myForm.value.curp.slice(8,10);

        let anioactual = new Date();
        let anioCalculado = new Date(anioactual.getFullYear()-70,anioactual.getMonth(),anioactual.getDate());
        let anioCalculado_year:number = Number(datePipe.transform(anioCalculado,"yy"))
        


        const anioNacimiento:Date = (anio <= anioCalculado_year)?new Date(Number(anio)+Number(2000),mes-1,dia):new Date(anio,mes-1,dia);

        
        this.myForm.controls.fechaNacimiento.setValue(datePipe.transform(anioNacimiento,"yyyy-MM-dd"));


    }else{  
      this.myForm.controls.genero.setValue("");
      this.myForm.controls.fechaNacimiento.setValue("");
    }
  }


/*   public validarfechNacimiento(fecha: any) {



    var x = new Date();
    var fecha = fecha.split("-");
    x.setFullYear(fecha[0], fecha[1] - 1, fecha[2]);
    var today = new Date();

    if (x > today) {

      this.modalPrd.showMessageDialog(false, 'La fecha debe ser igual o menor a la fecha actual')
        .then(() => {
          this.myForm.controls.fechaNacimiento.setValue("");
        });
    }
  } */

  public createForm(obj: any) {

    
    //let genero = "";
    if (obj.genero == "F"){
      //genero = "true";
      this.generoName= 'Femenino';
    }  
    else if (obj.genero == "M"){
      //genero = "false";
      this.generoName= 'Masculino';
    }  
  
    return this.formBuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: obj.apellidoMaterno,
      genero: [{ value: obj.genero, disabled: true}],
      fechaNacimiento: [{ value: new DatePipe("es-MX").transform(obj.fechaNacimiento, 'yyyy-MM-dd'), disabled: true},Validators.required],
      rfc: [obj.rfc, [Validators.required, Validators.pattern(ConfiguracionesService.regexRFCFisica)]],
      curp: [obj.curp, [Validators.required, Validators.pattern(ConfiguracionesService.regexCurp)]],
      nss: [obj.nss,[Validators.required,validacionesForms.nssValido]],
      contactoInicialEmailPersonal: [obj.contactoInicialEmailPersonal?.toLowerCase(), [ Validators.email]],
      emailCorporativo: [{value:obj.emailCorporativo?.toLowerCase(),disabled:false}, [Validators.email,Validators.required]],
      nacionalidadId: [obj.nacionalidadId?.nacionalidadId || 1, [Validators.required]],
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      estadoCivil: obj.estadoCivil,
      numeroHijos: obj.numeroHijos,
      url: obj.urlLinkedin,
      contactoEmergenciaNombre: [obj.contactoEmergenciaNombre],
      contactoEmergenciaApellidoPaterno: [obj.contactoEmergenciaApellidoPaterno],
      contactoEmergenciaApellidoMaterno: [obj.contactoEmergenciaApellidoMaterno],
      contactoEmergenciaParentesco: obj.parentescoId?.parentescoId,
      contactoEmergenciaEmail: [obj.contactoEmergenciaEmail?.toLowerCase(), [Validators.email]],
      contactoEmergenciaTelefono: obj.contactoEmergenciaTelefono,
      codigo: [obj.codigo, [Validators.required, Validators.pattern('[0-9]+')]],
      estado: [{ value: obj.estado, disabled: true }, [Validators.required]],
      municipio: [{ value: obj.municipio, disabled: true }, [Validators.required]],
      asentamientoId: [{ value: obj.asentamientoId, disabled: true }, [Validators.required]],
      calle: [{ value: obj.calle, disabled: true }, [Validators.required]],
      numExterior: [{ value: obj.numExterior, disabled: true }, [Validators.required]],
      numInterior: { value: obj.numInterior, disabled: true },
      celular:[obj.celular],
      domicilioId:obj.domicilioId,
      imagen:obj.imagen

    });
  }


  public enviandoFormulario() {



    this.submitEnviado = true;


    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    let moralFiscia = this.myForm.controls.rfc.value.substr(10,12).length;
    if(moralFiscia === 3){
      let rfcFisica = this.myForm.controls.rfc.value.substr(0,10);
      let curp = this.myForm.controls.curp.value.substr(0,10);
      if(curp !== rfcFisica){
        this.modalPrd.showMessageDialog(this.modalPrd.error,"Los datos de RFC y CURP no corresponden");
  
        return;
      }
    }

   
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas modificar los datos el empleado?").then(valor => {
      if (valor) {

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.usuarioSistemaPrd.getInformacionAdicionalUser(encodeURIComponent(this.myForm.controls.emailCorporativo.value)).subscribe(datos =>{
          this.realizarOperacion(datos.datos);
        });

        

      }
    });
  }


  public realizarOperacion(esUsuario:any) {
    

    let obj = this.myForm.value;
    obj.genero = this.myForm.controls.genero.value;
    obj.fechaNacimiento = this.myForm.controls.fechaNacimiento.value;
    //obj.fechaNacimiento = new DatePipe("es-MX").transform(new Date(obj.fechaNacimiento), 'yyyy-MM-dd');

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
        nss: obj.nss,
        personaId:this.idEmpleado,
        imagen:obj.imagen
      }


      if(!Boolean(objenviar.imagen)){
          delete objenviar.imagen;
      }

      if(!obj.contactoEmergenciaParentesco){
        delete objenviar.parentescoId;
      }
  




//rh4
    this.empleadoPrd.update(objenviar).subscribe(datos => {
      //this.accionarCancelar();

      if (datos.resultado) {

        
        let objAuthEnviar:any = {
          nombre: obj.nombre,
          apellidoPat: obj.apellidoPaterno,
          apellidoMat: obj.apellidoMaterno,
          email: obj.emailCorporativo?.toLowerCase(),
          centrocClienteIds: [this.usuarioSistemaPrd.getIdEmpresa()],
          rolId: 2,
          esMulticliente:false,
          usuarioId:obj.usuarioId,
          version:this.usuarioSistemaPrd.getVersionSistema()
        }
        
        if(!Boolean(esUsuario)){
         
          
          delete objAuthEnviar.usuarioId;
          this.usuarioAuthPrd.guardar(objAuthEnviar).subscribe((datos) => {
            if(!datos.resultado){
                this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
            }else{
              
              this.empleado = datos.datos;
              this.parsearInformacion();
              this.actualizarDomicilio();
              this.editarcampos = false;
            }
          });
        }else{
          objAuthEnviar.nombre = esUsuario.usuario.nombre;
          objAuthEnviar.apellidoPat = esUsuario.usuario.apellidoPat;
          objAuthEnviar.apellidoMat = esUsuario.usuario.apellidoMat;
          objAuthEnviar.email = obj.emailCorporativo;
          objAuthEnviar.centrocClienteIds = [this.usuarioSistemaPrd.getIdEmpresa()];
          objAuthEnviar.rolId = 2;
          objAuthEnviar.esMulticliente = false;
          objAuthEnviar.usuarioId = esUsuario.usuario.usuarioId;
          objAuthEnviar.esActivo = true;
          

          this.usuarioAuthPrd.modificar(objAuthEnviar).subscribe(datos =>{
            if(!datos.resultado){
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
          }else{
            this.empleado = datos.datos;
            this.parsearInformacion();
            this.actualizarDomicilio();
            this.editarcampos = false;
          }
          });

        }

     
      }else{
        this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
      }

    });
  }

  public actualizarDomicilio() {


    let obj = this.myForm.value;
    

    let objenviar: any =
    {
      codigo: obj.codigo,
      municipio: this.idMunicipio,
      estado: this.idEstado,
      asentamientoId: obj.asentamientoId,
      calle: obj.calle,
      numExterior: obj.numExterior,
      numInterior: obj.numInterior,
      personaId: {
        personaId: this.idEmpleado
      }
    }

    

    if (this.insertarDomicilio) {
      this.domicilioPrd.save(objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(()=>{

          if(datos.resultado){
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.ngOnInit();
          }

        });
     
        this.myForm = this.createForm(this.empleado);
      });
    } else {


      
      objenviar.domicilioId = obj.domicilioId;

      this.domicilioPrd.update(objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(()=>{
          if(datos.resultado){
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.ngOnInit();
          }
        });
        this.myForm = this.createForm(this.empleado);
      });
    }




  }

  public cancelarOperacion() {
  }


  public get f() {
    return this.myForm.controls;
  }


  public accionarCancelar() {
    //this.myForm.controls.genero.disable();
    this.ngOnInit();
  }

  public ngOnDestroy(){
    if(this.cambioFotoPerfil){
        this.cambioFotoPerfil.unsubscribe();
    }
  }

}
