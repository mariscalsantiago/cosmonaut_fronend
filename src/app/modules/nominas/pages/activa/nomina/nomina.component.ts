import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';



@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss']
})
export class NominaComponent implements OnInit {
  public activado = [
    { tab: true, form: true, disabled: false, seleccionado: true },
    { tab: false, form: false, disabled: false, seleccionado: false },
    { tab: false, form: false, disabled: false, seleccionado: false },
    { tab: false, form: false, disabled: false, seleccionado: false }];

  public nominaSeleccionada: any;
  public arreglo: any = [];

  public llave: string = "";


  public esRegistrar: boolean = false;
  public esCalcular: boolean = false;
  public esConsultar: boolean = false;
  public esConcluir: boolean = false;
  public esDispersar: boolean = false;
  public esEliminar: boolean = false;
  public esTimbrar: boolean = false;
  public esDescargar: boolean = false;


  public tabCalculada: boolean = false;
  public tabDispersada: boolean = false;
  public tabTimbrado: boolean = false;
  public tabConcluida: boolean = false;

  public modulo: string = "";
  public subModulo: string = "";


  public listadoEmpleadosExistentes = undefined;

  constructor(public configuracionPrd: ConfiguracionesService, private router: Router, 
    private modalPrd: ModalService, private usuariSistemaPrd: UsuarioSistemaService,
    private nominaOrdinariaPrd: NominaordinariaService) { }

  ngOnInit(): void {

    this.establecerPermisos();

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    this.nominaSeleccionada = history.state.datos == undefined ? {} : history.state.datos;;




    if (this.nominaSeleccionada.nominaOrdinaria) {
      this.llave = "nominaOrdinaria";
    } else if (this.nominaSeleccionada.nominaExtraordinaria) {
      this.llave = "nominaExtraordinaria";
    } else if (this.nominaSeleccionada.nominaLiquidacion) {
      this.llave = "nominaLiquidacion";
    } else if (this.nominaSeleccionada.nominaPtu) {
      this.llave = "nominaPtu";
    }

    this.tabCalculada = this.nominaSeleccionada[this.llave].estadoActualNomina === 'Calculada';
    this.tabDispersada = this.nominaSeleccionada[this.llave].estadoActualNomina === 'Pagada' || this.nominaSeleccionada[this.llave].estadoActualNomina === 'En proceso pago';
    this.tabTimbrado = this.nominaSeleccionada[this.llave].estadoActualNomina === 'Timbrada' || this.nominaSeleccionada[this.llave].estadoActualNomina === 'En proceso timbrado';
    this.tabConcluida = this.nominaSeleccionada[this.llave].estadoActualNomina === 'Pagada' && this.nominaSeleccionada[this.llave].estadoActualNomina === 'Timbrada';



    if (this.esCalcular) {
      this.activado[0].tab = true;
      this.activado[0].form = true;
      this.activado[0].seleccionado = true;
    } else if (this.esDispersar) {
      this.activado[0].tab = false;
      this.activado[0].form = false;
      this.activado[0].seleccionado = false;
      this.activado[1].tab = true;
      this.activado[1].form = true;
      this.activado[1].seleccionado = true;
    } else if (this.esTimbrar) {
      this.activado[0].tab = false;
      this.activado[0].form = false;
      this.activado[0].seleccionado = false;
      this.activado[2].tab = true;
      this.activado[2].form = true;
      this.activado[2].seleccionado = true;
    } else if (this.esConcluir) {
      this.activado[0].tab = false;
      this.activado[0].form = false;
      this.activado[0].seleccionado = false;
      this.activado[3].tab = true;
      this.activado[3].form = true;
      this.activado[3].seleccionado = true;
    }


    if (this.tabCalculada) {
      this.activado[0].tab = true;
    }
    if (this.tabDispersada) {
      this.activado[0].tab = true;
      this.activado[1].tab = true;
    }
    if (this.tabTimbrado) {
      this.activado[0].tab = true;
      this.activado[1].tab = true;
      this.activado[2].tab = true;
    }
    if (this.tabConcluida) {
      this.activado[0].tab = true;
      this.activado[1].tab = true;
      this.activado[2].tab = true;
      this.activado[3].tab = true;
    }
    



    if("nominaOrdinaria" == this.llave){
      this.nominaOrdinariaPrd.getUsuariosContempladosOtrasNominas(this.nominaSeleccionada[this.llave].nominaXperiodoId).subscribe(datos =>this.listadoEmpleadosExistentes = datos.datos);;
    }
   


  }

  public establecerPermisos() {
    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esCalcular = this.configuracionPrd.getPermisos("Calcular");
    this.esConsultar = this.configuracionPrd.getPermisos("Consultar");
    this.esConcluir = this.configuracionPrd.getPermisos("Concluir");
    this.esDispersar = this.configuracionPrd.getPermisos("Dispersar");
    this.esEliminar = this.configuracionPrd.getPermisos("Eliminar");
    this.esTimbrar = this.configuracionPrd.getPermisos("Timbrar");
    this.esDescargar = this.configuracionPrd.getPermisos("Descargar");

    
    


  }

  public inicio(){
    this.router.navigate(['/inicio']);
  }

  public regresarOrdinaria() {
    this.router.navigate(["/nominas/activas"]);
  }
  public regresarExtraordinaria() {
    this.router.navigate(["/nominas/nomina_extraordinaria"]);
  }
  public regresarLiquidacion() {
    this.router.navigate(["/nominas/finiquito_liquidacion"]);
  }
  public regresarPtu() {
    this.router.navigate(["/nominas/ptu"]);
  }

  public backTab(numero: number) {
    if (!this.activado[numero].tab) return;
    for (let item of this.activado) {
      item.seleccionado = false;
      item.form = false;
    }


    this.activado[numero].seleccionado = true;
    this.activado[numero].form = true;
  }


  public recibirComponente(obj: any) {




    if (!this.esDispersar && obj.type == "calcular") {
      if (this.esTimbrar) {
        obj.type = "dispersar";
      } else if (this.esConcluir) {
        obj.type = "timbrar";
      } else {
        return;
      }
    } else if (!this.esTimbrar && obj.type == "dispersar") {
      if (this.esConcluir) {
        obj.type = "timbrar";
      } else {
        return;
      }
    } else if (!this.esConcluir && obj.type == "timbrar") {
      return;
    }



    for (let item of this.activado) {
      item.seleccionado = false;
      item.form = false;
    }










    switch (obj.type) {
      case "inicio":
        this.activado[0].tab = true;
        this.activado[0].form = true;
        this.activado[0].seleccionado = true;
        break;
      case "calcular":
        this.activado[1].tab = true;
        this.activado[1].form = true;
        this.activado[1].seleccionado = true;
        break;
      case "dispersar":
        this.activado[2].tab = true;
        this.activado[2].form = true;
        this.activado[2].seleccionado = true;
        break;
      case "timbrar":
        this.activado[3].tab = true;
        this.activado[3].form = true;
        this.activado[3].seleccionado = true;
        break;
    }
  }



}
