import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService, usuarioClass } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';


declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public myForm: FormGroup;
  public myFormPassword!:FormGroup;

  public error: boolean = false;
  public cargando: boolean = false;
  public correcto: boolean = false;
  public ventanapass: boolean = false;
  public aparecerCheck: boolean = false;
  public aparecerListaempresas: boolean = false;
  public cargandoLogin: boolean = false;

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

  public cambiarPassword:boolean = false;

  public invalidapassword:boolean = false;

  constructor(public formBuilder: FormBuilder, private routerPrd: Router,
    private companiaPrd: SharedCompaniaService, private usuarioSistemaPrd: UsuarioSistemaService, private authPrd: AuthService) {
    let obj = {};
    this.myForm = this.createMyForm(obj);




    this.cargandoEmpresa = true;
    // this.companiaPrd.getAllCompany().subscribe(datos => {
    //   this.cargandoEmpresa = false;

    //   this.arregloCompanias = datos.datos;
    // });

  }

  ngOnInit(): void {

    this.myFormPassword = this.createFormPassword();
    this.suscribirse();
    
    this.cargandoLogin = this.usuarioSistemaPrd.introActivado;
    setTimeout(() => {
      this.cargandoLogin = false;
      this.usuarioSistemaPrd.introActivado = false;
    }, 4000);
    //$('#modalshare').modal('show');


  }

  public createFormPassword(){
    return this.formBuilder.group({
      password1:['',[Validators.required]],
      password2:['',[Validators.required]]
    });
  }

  public createMyForm(obj: any) {
    return this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  public suscribirse(){
    this.myFormPassword.controls.password1.valueChanges.subscribe(valor =>{
        this.invalidapassword = valor !== this.f.password2.value;
    });

    this.myFormPassword.controls.password2.valueChanges.subscribe(valor =>{
      this.invalidapassword = valor !== this.f.password1.value;
  });
  }

  public enviarformulario() {

    this.authPrd.login(this.myForm.value).subscribe(datos => {
      let username = datos.username;
      this.usuarioSistemaPrd.getInformacionAdicionalUser(username).subscribe(valorusuario => {
        console.log("valorusuario", valorusuario);
        this.cargando = false;
        this.correcto = true;
        if(valorusuario.passwordProvisional){
            this.cambiarPassword = true;
            this.incorrectoback = false;
        }else{
          this.usuarioSistemaPrd.obtenerInfo(username).subscribe(valorfinal => {
            let objRecibido = valorfinal.datos[0];
            const usuario: usuarioClass = new usuarioClass(objRecibido.centrocClienteId.centrocClienteId, objRecibido.personaId);
            usuario.setDatosEmpleado(objRecibido);
            this.usuarioSistemaPrd.setUsuario(usuario);
            setTimeout(() => {
              this.routerPrd.navigate(['/inicio']);
            }, 2000);
          });
        }
     

      });



    }, (err) => {
      this.cargando = false

      this.incorrectoback = err.status == 401;

    });

    this.cargando = true;


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
      usuario = new usuarioClass(this.companiaSeleccionada.centrocClienteId, 1);
    } else {
      if (this.empresaSeleccionada == undefined) {
        usuario = new usuarioClass(this.companiaSeleccionada.centrocClienteId, 1);
      } else {
        usuario = new usuarioClass(this.empresaSeleccionada.centrocClienteId, 1);
      }
    }


    this.usuarioSistemaPrd.setUsuario(usuario);

  }


  public seleccionadoCompania(item: any) {

    for (let item of this.arregloCompanias) {
      item.seleccionado = false;
    }

    item.seleccionado = true;

    this.empresaSeleccionadaBool = false;
  }


  public cambiarContrasenias(){
  
    if(this.myFormPassword.invalid || this.invalidapassword ){
      Object.values(this.myFormPassword.controls).forEach(control =>{
        control.markAsTouched();
      });
      return;
    }

    
    this.restablecerContraseña();


  }

  public restablecerContraseña(){
    let obj = this.myFormPassword.value;
    let objEnviar={
      
    };
  }

  public get f(){
    return this.myFormPassword.controls;
  }


}
