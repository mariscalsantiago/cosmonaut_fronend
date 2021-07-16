import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpresasService } from '../../services/empresas.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent implements OnInit {

  public modal: boolean = false;



  public activado = [
    { tab: true, form: true, enable: true, seleccionado: true },
    { tab: false, form: false, enable: false, seleccionado: false },
    { tab: false, form: false, enable: false, seleccionado: false },
    { tab: false, form: false, enable: false, seleccionado: false },
    { tab: false, form: false, enable: false, seleccionado: false },
    { tab: false, form: false, enable: false, seleccionado: false }
  ];

  public guardarDom: boolean = false;
  public cuentaBanco: boolean = false;
  public continuarDom: boolean = false;
  public continuarBancos: boolean = false;
  public continuarSede: boolean = false;
  public continuarCuentas: boolean = false;
  public activarGuardaMod: boolean = true;
  public insertar: boolean = false;
  public activarList: boolean = false;
  public activarForm: boolean = true;
  public arregloactivos: any = [];
  public activos: any = [];
  public objModificar: any = [];




  public datosempresa: any = {
    clienteId: this.usuarioSistemaPrd.getIdEmpresa()
  };



  constructor(private usuarioSistemaPrd: UsuarioSistemaService, private routerPrd: Router, private routerActivePrd: ActivatedRoute, private empresasProd: EmpresasService, public configuracionPrd: ConfiguracionesService) {

  }

  ngOnInit(): void {
    this.datosempresa.empresa = history.state.data == undefined ? {} : history.state.data;
    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      this.datosempresa.insertar = this.insertar;
      if (!this.insertar) {
        this.datosempresa.activarForm = false;
        this.datosempresa.activarList = true;
        this.empresasProd.getActivos(this.datosempresa.empresa.centrocClienteId).subscribe(datos => {
          this.activarPestaniasEmpresa(datos);
          console.log(datos);
        });
      }
    });
    console.log("Datos de la empresa ",this.datosempresa);
  }

  public activarPestaniasEmpresa(datos: any) {
    console.log(datos);
    
    this.activado[1].tab = true;
    this.activado[1].enable = true;
    if (datos.banco) {
      this.activado[2].tab = true;
      this.activado[2].enable = true;
    }
    if (datos.imss) {
      this.activado[3].tab = true;
      this.activado[3].enable = true;
    }
  }

  public seleccionar(numero: number) {
    console.log(this.activado[numero]);
    if (!this.activado[numero].enable)
      return;

    console.log("Se va activar paps");

    for (let item of this.activado) {
      item.form = false;
      item.seleccionado = false;
    }

    this.activado[numero].form = true;
    this.activado[numero].seleccionado = true;
  }



  public recibir(elemento: any) {


    switch (elemento.type) {
      case "informacion":

        this.activado[1].tab = true;
        this.activado[1].form = true;
        this.activado[1].enable = true;
        this.activado[1].seleccionado = true;
        this.activado[0].form = false;
        this.activado[0].seleccionado = false;
        break;
      case "domicilio":

        this.activado[2].tab = true;
        this.activado[2].form = true;
        this.activado[2].enable = true;
        this.activado[1].form = false;
        break;
      case "domicilioSede":

        this.guardarDom = true;
        break;
      case "domicilioCont":

        this.continuarDom = true;
        break;
      case "sedeCont":

        this.continuarSede = true;
        break;
      case "cuentasCont":

        this.continuarCuentas = true;
        break;
      case "bancosCont":

        this.continuarBancos = true;
        break;
      case "cuentasBancarias":

        this.cuentaBanco = true;
        break;
      case "datosbancarios":

        this.activado[3].tab = true;
        this.activado[3].form = true;
        this.activado[3].enable = true;
        this.activado[2].form = false;
        break;
      case "sede":

        this.activado[1].tab = true;
        this.activado[4].form = true;
        this.activado[4].enable = true;
        this.activado[1].form = false;
        break;
      case "sedeDom":

        this.activado[1].tab = true;
        this.activado[1].form = true;
        this.activado[1].enable = true;
        this.activado[4].form = false;
        break;
      case "cuentas":

        this.activado[2].tab = true;
        this.activado[5].form = true;
        this.activado[5].enable = true;
        this.activado[2].form = false;
        break;
      case "cuentaDatosBancarios":

        this.activado[2].tab = true;
        this.activado[2].form = true;
        this.activado[2].enable = true;
        this.activado[5].form = false;
        break;
    }

  }

}

