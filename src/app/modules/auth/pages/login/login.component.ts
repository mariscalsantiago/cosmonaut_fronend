import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService,usuarioClass } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';


declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public myForm: FormGroup;

  public error: boolean = false;
  public cargando: boolean = false;
  public correcto: boolean = false;
  public ventanapass: boolean = false;
  public aparecerCheck: boolean = false;
  public aparecerListaempresas:boolean = false;
  public cargandoLogin:boolean = false;


  public cargandoEmpresa: boolean = false;
  public cargandoEmpresaCompania:boolean = false;
  public arregloCompanias: any = [{seleccionado:false},{seleccionado:false},{seleccionado:false},{seleccionado:false},{seleccionado:false},{seleccionado:false}];
  public arregloEmpresas: any = [];

  public empresaSeleccionada:any;
  public companiaSeleccionada:any;

  public login:boolean = true;
  public multiempresa:boolean = false;

  public empresaSeleccionadaBool:boolean = true;

  constructor(public formBuilder: FormBuilder, private routerPrd: Router,
    private companiaPrd: SharedCompaniaService,private usuarioSistemaPrd:UsuarioSistemaService,
    private modalPrd:ModalService) {
    let obj = {};
    this.myForm = this.createMyForm(obj);




    this.cargandoEmpresa = true;
    // this.companiaPrd.getAllCompany().subscribe(datos => {
    //   this.cargandoEmpresa = false;
    
    //   this.arregloCompanias = datos.datos;
    // });

  }

  ngOnInit(): void {

    this.cargandoLogin = true;
    setTimeout(() => {
     this.cargandoLogin = false;
    }, 4000);
    //$('#modalshare').modal('show');
  }

  public createMyForm(obj: any) {
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  public enviarformulario() {   

    this.usuarioSistemaPrd.login(this.myForm.value).subscribe(datos =>{
        if(datos.resultado) {
            if(datos.datos == undefined){
                alert("Usuario invalido");
                this.cargando = false;
            }else{
              if(!this.myForm.value.email.includes(this.myForm.value.password)){

                alert("Contraseña invalida");
               
                this.cargando = false;
                this.correcto = false;
  
                return;
              }

              this.cargando = false;
              this.correcto = true;

              

              let objRecibido = datos.datos[0];
              const usuario:usuarioClass = new usuarioClass(objRecibido.centrocClienteId.centrocClienteId,objRecibido.personaId);
              usuario.setDatosEmpleado(objRecibido);
              this.usuarioSistemaPrd.setUsuario(usuario);

              setTimeout(() => {
                this.routerPrd.navigate(['/inicio']);        
              }, 2000);
            }
        }
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


  public finalizadoSeleccion(){
    if(this.empresaSeleccionada== undefined && this.companiaSeleccionada == undefined){
        alert("no se ha seleccionado el cliente");
        return;
    }
    $('#modalshare').modal('hide');

    let usuario:usuarioClass;
    if(!this.aparecerListaempresas){
        usuario = new usuarioClass(this.companiaSeleccionada.centrocClienteId,1);
    }else{
      if(this.empresaSeleccionada == undefined){
        usuario = new usuarioClass(this.companiaSeleccionada.centrocClienteId,1);
      }else{
        usuario = new usuarioClass(this.empresaSeleccionada.centrocClienteId,1);
      }
    }


    this.usuarioSistemaPrd.setUsuario(usuario);

  }


  public seleccionadoCompania(item:any){

    for(let item of this.arregloCompanias){
       item.seleccionado = false;  
    } 

    item.seleccionado = true;

    this.empresaSeleccionadaBool = false;
  }


}
