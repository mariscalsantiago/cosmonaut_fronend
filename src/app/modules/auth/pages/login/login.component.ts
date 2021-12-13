import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ValidarPasswordService } from 'src/app/shared/services/configuracion/validar-password.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { UsuarioSistemaService, usuarioClass } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';


declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild("emailrestablecer") correo!: ElementRef;



  public myForm: FormGroup;
  public myFormPassword!: FormGroup;

  public error: boolean = false;
  public cargando: boolean = false;
  public correcto: boolean = false;
  public ventanapass: boolean = false;
  public aparecerCheck: boolean = false;
  public aparecerListaempresas: boolean = false;
  public cargandoLogin: boolean = false;
  public mensajeSucess: string = "Contraseña actualizada correctamente";
  public restablecer:boolean = false;
  

  public usuarioObj: any;

  public incorrectoback: boolean = false;


  public cargandoEmpresa: boolean = false;
  public cargandoEmpresaCompania: boolean = false;
  public arregloCompanias: any = [{ seleccionado: false }, { seleccionado: false }, { seleccionado: false }, { seleccionado: false }, { seleccionado: false }, { seleccionado: false }];
  public arregloEmpresas: any = [];

  public empresaSeleccionada: any;
  public companiaSeleccionada: any;

  public login: boolean = true;
  public multiempresa: boolean = false;

  public empresaSeleccionadaBool: boolean = true;

  public cambiarPassword: boolean = false;

  public invalidapassword: boolean = false;
  public mensajesuccess: boolean = false;
  public mensajeerror: boolean = false;
  public mensajeDanger: string = "";
  public clienteSeleccionado: any;

  constructor(public formBuilder: FormBuilder, private routerPrd: Router,
    private companiaPrd: SharedCompaniaService, public usuarioSistemaPrd: UsuarioSistemaService, private authPrd: AuthService,
    private authUsuarioPrd: UsuariosauthService, private modalPrd:ModalService) {
    let obj = {};
    this.myForm = this.createMyForm(obj);




    this.cargandoEmpresa = true;
    // this.companiaPrd.getAllCompany().subscribe(datos => {
    //   this.cargandoEmpresa = false;

    //   this.arregloCompanias = datos.datos;
    // });


  }

  ngOnInit(): void {

    this.ocultandoChatBoot();

    this.myFormPassword = this.createFormPassword();
    this.suscribirse();

    this.cargandoLogin = this.usuarioSistemaPrd.introActivado;
    setTimeout(() => {
      this.cargandoLogin = false;
      this.usuarioSistemaPrd.introActivado = false;
    }, 4000);
    //$('#modalshare').modal('show');


  }

  public createFormPassword() {
    return this.formBuilder.group({
      password1: ['', [Validators.required, ValidarPasswordService.validarPassword, Validators.minLength(8)]],
      password2: ['', [Validators.required]],
      oldpassword: ['', Validators.required]
    });
  }

  public createMyForm(obj: any) {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  public suscribirse() {
    this.myFormPassword.controls.password1.valueChanges.subscribe(valor => {
      this.invalidapassword = valor !== this.f.password2.value;
    });

    this.myFormPassword.controls.password2.valueChanges.subscribe(valor => {
      this.invalidapassword = valor !== this.f.password1.value;
    });


    this.myForm.controls.password.valueChanges.subscribe(() => {
      this.incorrectoback = false;
    });

    this.myForm.controls.username.valueChanges.subscribe(() => {
      this.incorrectoback = false;
    });
  }

  public enviarformulario() {
    
    this.restablecer = false;
    this.myForm.value.username = this.myForm.value.username?.toLowerCase();
    this.authPrd.login(this.myForm.value).subscribe(datos => {
      let username = datos.username;
      this.usuarioSistemaPrd.getInformacionAdicionalUser(encodeURIComponent(username)).subscribe(valorusuario => {
        this.cargando = false;
        this.correcto = true;
        this.mensajesuccess = false;
        this.mensajeerror = false;





        this.usuarioObj = valorusuario.datos.usuario;

        if (valorusuario.datos.usuario.passwordProvisional) {
          this.cambiarPassword = true;
          this.incorrectoback = false;
        } else {


          let objRecibido = valorusuario.datos.clientes[0];
          console.log("Cliente actual",objRecibido);
          const usuario: usuarioClass = new usuarioClass();
          usuario.centrocClienteId = objRecibido.centrocClienteId;
          usuario.correo = encodeURIComponent(username);
          usuario.nombreEmpresa = objRecibido.razonSocial;
          usuario.usuarioId = this.usuarioObj.usuarioId;
          usuario.nombre = this.usuarioObj.nombre;
          usuario.apellidoPat = this.usuarioObj.apellidoPat;
          usuario.email = this.usuarioObj.email?.toLowerCase();
          usuario.fechaAlta = this.usuarioObj.fechaAlta;
          usuario.passwordProvisional = this.usuarioObj.passwordProvisional;
          usuario.rolId = this.usuarioObj.rolId?.rolId;
          usuario.nombreRol = this.usuarioObj.rolId?.nombreRol;
          usuario.submodulosXpermisos = valorusuario.datos.submodulosXpermisos;
          usuario.multiempresa = objRecibido.multiempresa;
          usuario.esCliente = !Boolean(objRecibido.centroCostosCentrocClienteId);
          usuario.esRecursosHumanos = false;
          usuario.centrocClienteIdPadre = (usuario.esCliente) ? 0 : objRecibido.centroCostosCentrocClienteId.centrocClienteId;
/*           usuario.listaColores = valorusuario.datos.coloresDefecto;
          if(usuario.listaColores){
            usuario.coloresSistema = usuario.listaColores.find(o=> o.clienteId == (usuario.centrocClienteIdPadre == 0 ? usuario.centrocClienteId : usuario.centrocClienteIdPadre))
          } */

          
          this.usuarioSistemaPrd.setUsuario(usuario);
          console.log(usuario);
          this.authUsuarioPrd.getVersionByEmpresa(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => {
            let obj = datos.datos;

            console.log("VERSION COSMONAUT",obj.versionCosmonautId?.versionCosmonautId);
            this.usuarioSistemaPrd.setVersionSistema(obj.versionCosmonautId?.versionCosmonautId);

          });

          if (valorusuario.datos.clientes.length > 1) {
            this.multiempresa = true;
            this.login = false;
            this.correcto = false;

            this.arregloCompanias = valorusuario.datos.clientes;

            for (let item of this.arregloCompanias) {
              item.seleccionado = false;
            }

          } else {
            setTimeout(() => {
              this.routerPrd.navigate(['/inicio']);
            }, 2000);
          }



        }


      });



    }, (err) => {
      this.cargando = false

      this.incorrectoback = err.status == 401;

     
      this.mensajesuccess = false;
      this.mensajeerror = false;


      if(err.status == 401){
        
        if(!err.error.message.includes("Credenciales") && !err.error.message.includes("Crdenciales invalidas")){
            this.mensajeerror = true;
            this.incorrectoback = false;
            this.mensajeDanger = err.error.message;
            this.restablecer = !err.error.message.includes("El usuario se encuentra dado de baja");
            let rolInactivo = err.error.message.includes("Usuario sin accesso al sistema");
            
            if(rolInactivo){
              this.restablecer = false;
            }            
        }
      }

    });

    this.cargando = true;


  }

  public mostrarContrasena(){
    
    let elemento: any = document.getElementById("loginpassword")

    if(elemento.type == "password"){
      elemento.type = "text";
      $('.icon').removeClass('fa fa-eye-slash').addClass('fa fa-eye');
    }else{
      elemento.type = "password";
      $('.icon').removeClass('fa fa-eye').addClass('fa fa-eye-slash');
    }

  }



  public seleccionarEmpresa(elemento: any) {
    for (let item of this.arregloCompanias)
      item.seleccionado = false;

    elemento.seleccionado = true;


    this.aparecerCheck = true;
    this.empresaSeleccionada = undefined;
    this.companiaSeleccionada = elemento;


    this.cargandoEmpresaCompania = true;

    this.companiaPrd.getAllEmp(elemento.centrocClienteId).subscribe(datos => {

      this.arregloEmpresas = datos.datos;
      this.cargandoEmpresaCompania = false;
    });


  }

  public seleccionarempresaCompania(elemento: any) {
    for (let item of this.arregloEmpresas)
      item.seleccionado = false;

    elemento.seleccionado = true;



    this.empresaSeleccionada = elemento;

  }


  public finalizadoSeleccion() {
    if (this.empresaSeleccionada == undefined && this.companiaSeleccionada == undefined) {
      alert("no se ha seleccionado el cliente");
      return;
    }
    $('#modalshare').modal('hide');

    let usuario: usuarioClass;
    if (!this.aparecerListaempresas) {
      // usuario = new usuarioClass(this.companiaSeleccionada.centrocClienteId, 1);
    } else {
      if (this.empresaSeleccionada == undefined) {
        // usuario = new usuarioClass(this.companiaSeleccionada.centrocClienteId, 1);
      } else {
        //usuario = new usuarioClass(this.empresaSeleccionada.centrocClienteId, 1);
      }
    }


    //   this.usuarioSistemaPrd.setUsuario(usuario);

  }


  public seleccionadoCompania(item: any) {

    for (let item of this.arregloCompanias) {
      item.seleccionado = false;
    }

    item.seleccionado = true;

    this.empresaSeleccionadaBool = false;

    this.clienteSeleccionado = item;
  }


  public cambiarContrasenias() {

    if (this.myFormPassword.invalid || this.invalidapassword) {
      Object.values(this.myFormPassword.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }


    this.restablecerContraseña();


  }

  public restablecerContraseña() {


    let obj = this.myFormPassword.value;
    let objEnviar = {
      usuarioId: this.usuarioObj.usuarioId,
      oldPwd: obj.oldpassword,
      newPwd: obj.password1
    }

    this.cargando = true;
    this.usuarioSistemaPrd.resetPasword(objEnviar).subscribe(datos => {

      if (datos.resultado) {
        this.usuarioSistemaPrd.logout().subscribe(() => {
          this.regresar();
          this.cargando = false;
          this.mensajesuccess = true;
          this.authPrd.eliminarTokens();
          this.mensajeerror = false;
          this.correcto = false;
          this.myForm.controls.username.setValue("");
          this.myForm.controls.password.setValue("");
          this.mensajeSucess = "Contraseña actualizada correctamente"

        });
      } else {
        this.mensajeDanger = datos.mensaje;
        this.mensajeerror = true;
        this.cargando = false;
      }

    });





  }

  public get f() {
    return this.myFormPassword.controls;
  }

  public regresar() {
    this.cargando = false;
    this.mensajesuccess = false;
    this.cambiarPassword = false;
    this.ventanapass = false;
    this.login = true;


  }

  public olvidastetupassword(valor:any) {
    
    
    if (this.correo?.nativeElement.value || Boolean(valor)) {
      let objenviar = {
        username: (!Boolean(valor))? this.correo.nativeElement.value?.toLowerCase():this.myForm.value.username?.toLowerCase()
      }


      
      
      this.cargando = true;
      //let mensaje = "Se ha enviado un correo electrónico con su contraseña de recuperación";
      //this.modalPrd.showMessageDialog(this.modalPrd.error,mensaje);
      this.usuarioSistemaPrd.enviarCorreorecuperacion(objenviar).subscribe(datos => {
        this.cargando = false;
        
        if (datos.resultado) {
          this.mensajeerror = false;
          this.restablecer = false;
          this.regresar();
          if(Boolean(this.correo)){
            this.correo.nativeElement.value = "";
          }

          
          //this.modalPrd.showMessageDialog(this.modalPrd.error,"Se ha enviado un correo electrónico con su contraseña de recuperación");
          this.mensajeSucess = !Boolean(valor)? "Se ha enviado un correo electrónico con su contraseña de recuperación":valor;

          this.mensajesuccess = true;
          this.mensajeerror = false;
          this.correcto = false;
          this.myForm.controls.username.setValue("");
          this.myForm.controls.password.setValue("");
        } else {
          this.mensajesuccess = false;
          this.mensajeerror = true;
          this.mensajeDanger = datos.mensaje;

        }
      })
    }
    
  }


  public seleccionarcompaniaFinal() {

    let usuario: usuarioClass = this.usuarioSistemaPrd.getUsuario();
    usuario.centrocClienteId = this.clienteSeleccionado.centrocClienteId;
    usuario.nombreEmpresa = this.clienteSeleccionado.razonSocial;
    usuario.esCliente = !Boolean(this.clienteSeleccionado.centroCostosCentrocClienteId)
    usuario.centrocClienteIdPadre = (usuario.esCliente) ? 0 : this.clienteSeleccionado?.centroCostosCentrocClienteId?.centrocClienteId;
    usuario.multiempresa = this.clienteSeleccionado.multiempresa;
/*     if(usuario.listaColores){
      usuario.coloresSistema = usuario.listaColores.find(o=> o.clienteId == (usuario.centrocClienteIdPadre == 0 ? usuario.centrocClienteId : usuario.centrocClienteIdPadre))
    } */


    this.usuarioSistemaPrd.setUsuario(usuario);
    this.cargando = true;


    this.authUsuarioPrd.getVersionByEmpresa(this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos => {
      let obj = datos.datos;
      this.cargando = false;
      this.correcto = true;

      this.usuarioSistemaPrd.setVersionSistema(obj.versionCosmonautId?.versionCosmonautId);
      setTimeout(() => {
        this.routerPrd.navigate(['/inicio']);
      }, 2000);

    });






  }

  public ocultandoChatBoot(){


  
    let mm = interval(100).subscribe(() => {
      try {
        let side : any= window;
        side.myLandbot.close();
        let mm: any = document.getElementsByClassName("LandbotLivechat");

        mm[0].style.display = "none";
 

        
        
        
        
      } catch {
      }
      mm.unsubscribe();
    });
  }


  public reenviarContrasenialnk(){
      
      this.olvidastetupassword("Se ha enviado un correo electrónico con sus nuevas credenciales de acceso");
  }


}
