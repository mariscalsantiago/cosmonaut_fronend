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


  public cargandoEmpresa: boolean = false;
  public cargandoEmpresaCompania:boolean = false;
  public arregloCompanias: any = [];
  public arregloEmpresas: any = [];

  public empresaSeleccionada:any;
  public companiaSeleccionada:any;

  constructor(public formBuilder: FormBuilder, private routerPrd: Router,
    private companiaPrd: SharedCompaniaService,private usuarioSistemaPrd:UsuarioSistemaService,
    private modalPrd:ModalService) {
    let obj = {};
    this.myForm = this.createMyForm(obj);




    this.cargandoEmpresa = true;
    this.companiaPrd.getAllCompany().subscribe(datos => {
      this.cargandoEmpresa = false;
      console.log(datos.datos);
      this.arregloCompanias = datos.datos;
    });

  }

  ngOnInit(): void {

    $('#modalshare').modal('show');
  }

  public createMyForm(obj: any) {
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }


  public enviarformulario() {
    let form = this.myForm.value;

    console.log("Lo que se envia", form);

    this.cargando = true;


    setTimeout(() => {

      this.cargando = false;
      this.correcto = true;

      setTimeout(() => {
        this.routerPrd.navigate(['/inicio']);

      }, 2000);
    }, 3000);
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
      console.log("Datos de mi empresa", datos.datos);
      this.arregloEmpresas = datos.datos;
      this.cargandoEmpresaCompania = false;
    });


  }

  public seleccionarempresaCompania(elemento: any) {
    for (let item of this.arregloEmpresas)
      item.seleccionado = false;

    elemento.seleccionado = true;

    console.log("mi empresa es",elemento);

    this.empresaSeleccionada = elemento;

  }


  public finalizadoSeleccion(){
    if(this.empresaSeleccionada== undefined && this.companiaSeleccionada == undefined){
        alert("no se ha seleccionado compañia o empresa");
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


}
