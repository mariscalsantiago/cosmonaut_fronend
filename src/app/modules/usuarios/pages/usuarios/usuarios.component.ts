import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';


//Importamos para el lenguaje en mis fechas (SAMV)
import localeEn from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { UsuariosauthService } from 'src/app/shared/services/usuariosauth/usuariosauth.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import {Utilidades} from '../../../../shared/utilidades/utilidades';
registerLocaleData(localeEn, 'es-MX');

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  public cargando: Boolean = false;
  public tipoguardad: boolean = false;

  /*
    Directivas de filtros
  */
  public id_company: string = "";
  public idUsuario: any = "";
  public nombre: any = "";
  public apellidoPat: any = "";
  public apellidoMat: any = "";
  public fechaRegistro: any = null;
  public correoempresarial: string = "";
  public activo: number = 0;
  public cargandoBotones:boolean = false;
  //public peticion: any = [];

  /*

    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arregloCompany: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;

  public esClienteEmpresa: boolean = false;
  public arreglotabla: any = {
    columnas: [],
    filas: [],
    totalRegistros:0
  };


  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;



  public elementos:number = 0;
  public pagina:number = 0;

  public modulo: string = "";
  public subModulo: string = "";

  public activarMultiseleccion: boolean = false;
  public primeraVez:boolean = false;


  constructor(private routerPrd: Router, public configuracionPrd:ConfiguracionesService,
    private companiPrd: SharedCompaniaService, private modalPrd: ModalService, private usuariosSistemaPrd: UsuarioSistemaService,
    private empresasProd: EmpresasService, private usuariosAuthPrd: UsuariosauthService) { }

  ngOnInit(): void {

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    this.establecerPermisos();

    this.esClienteEmpresa = this.routerPrd.url.includes("/cliente/usuarios");


    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;
    this.cargando = true;



    if (this.esClienteEmpresa) {
      this.companiPrd.getAllCompany().subscribe(datos => {
        this.arregloCompany = datos.datos
        console.log(this.arregloCompany);
        this.filtrar();
      });
    } else {
      if(this.usuariosSistemaPrd.esCliente()){
        this.empresasProd.getAllEmp(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {

          if(Boolean(datos.datos)){
            this.arregloCompany = datos.datos;
            this.arregloCompany.unshift({centrocClienteId:this.usuariosSistemaPrd.getIdEmpresa(),nombre:this.usuariosSistemaPrd.usuario.nombreEmpresa+"("+"Cliente)",razonSocial:this.usuariosSistemaPrd.usuario.nombreEmpresa+"("+"Cliente)"})
          }else{
            this.arregloCompany = datos.datos;
          }
          this.filtrar();

        });
      }else{
        this.empresasProd.getEmpresaById(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
          this.arregloCompany = [datos.datos];
          this.filtrar();
        });
      }
    }




  }



  public establecerPermisos(){

    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionPrd.getPermisos("Consultar");
    this.esEditar = this.configuracionPrd.getPermisos("Editar");
  }

  public procesarTabla() {
    let columnas: Array<tabla> = [
      new tabla("usuarioId", "ID"),
      new tabla("nombre", "Nombre"),
      new tabla("apellidoPat", "Primer apellido"),
      new tabla("apellidoMat", "Segundo apellido"),
      new tabla("email", "Correo electrónico"),
      new tabla("nameRol", "Rol"),
      ((this.esClienteEmpresa) ? new tabla("esMulticliente", "Multicliente") : new tabla("empresa", "empresa")),
      new tabla("activo", "Estatus ")
    ];

    columnas.splice(6,1);


    if (this.arreglo !== undefined) {
      for (let item of this.arreglo) {
        item["nameRol"] = item?.rolId?.nombreRol;
        item["esMulticliente"] = item?.esMulticliente? "Sí":"No";
        if(item.esActivo){
          item.activo = 'Activo'
         }
         if(!item.esActivo){
          item.activo = 'Inactivo'
         }
      }
    }
    this.arreglotabla = {
      columnas: columnas,
      filas: this.arreglo,
      totalRegistros:this.arreglotabla.totalRegistros
    }
  }





  public verdetalle(obj: any) {
    if (obj == undefined) {
      this.cargandoBotones = true;
      this.routerPrd.navigate([(this.esClienteEmpresa) ? "cliente" : "", 'usuarios', 'detalle_usuario'], { state: { company: this.arregloCompany, usuario: obj } });
    } else {
      this.modalPrd.showMessageDialog(this.modalPrd.loading);
      this.routerPrd.navigate([(this.esClienteEmpresa) ? "cliente" : "", 'usuarios', 'detalle_usuario'], { state: { company: this.arregloCompany, usuario: obj } });
    }
  }







  public guardarMultiseleccion(tipoguardad: boolean) {


    this.tipoguardad = tipoguardad;
    let mensaje = `¿Deseas ${tipoguardad ? "activar" : "desactivar"} estos usuarios?`;

    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {
        let arregloUsuario: any = [];

        for (let item of this.arreglo) {

          if (item["seleccionado"]) {

            arregloUsuario.push( item["usuarioId"]);

          }
        }

        let objEnviar = {
          ids:arregloUsuario,
          esActivo: tipoguardad
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        this.usuariosAuthPrd.usuariosActivarDesactivar(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(valor => {
            if (valor) {
              for (let item of arregloUsuario) {
                for (let item2 of this.arreglo) {
                  if (item2.usuarioId === item) {
                    item2["esActivo"] = tipoguardad;
                    item2["seleccionado"] = false;
                    break;
                  }
                }
              }

              this.activarMultiseleccion = false;

               this.cargando = true;
              if (this.esClienteEmpresa) {
                this.companiPrd.getAllCompany().subscribe(datos => {
                  this.arregloCompany = datos.datos
                  this.filtrar();
                });
              } else {
                if(this.usuariosSistemaPrd.esCliente()){
                  this.empresasProd.getAllEmp(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {

                    if(Boolean(datos.datos)){
                      this.arregloCompany = datos.datos;
                      this.arregloCompany.unshift({centrocClienteId:this.usuariosSistemaPrd.getIdEmpresa(),nombre:this.usuariosSistemaPrd.usuario.nombreEmpresa+"("+"Cliente)",razonSocial:this.usuariosSistemaPrd.usuario.nombreEmpresa+"("+"Cliente)"})
                    }else{
                      this.arregloCompany = datos.datos;
                    }
                    this.filtrar();

                  });
                }else{
                  this.empresasProd.getEmpresaById(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
                    this.arregloCompany = [datos.datos];
                    this.filtrar();

                  });
                }
              }
            }

          });
        });
      }
    });



  }





  public filtrar(repetir:boolean = false,desdeFiltrado:boolean = false) {

    const util = new Utilidades();
    let arregloenviar = [];

    if(!Boolean(this.id_company)){
      arregloenviar.push(this.usuariosSistemaPrd.getIdEmpresa());
      if(this.arregloCompany !== undefined){
        for(let item of this.arregloCompany){
          arregloenviar.push(item.centrocClienteId);
      }
      }
    }else{
      arregloenviar.push(this.id_company);
    }


    if(this.correoempresarial !== ''){
      this.correoempresarial?.toLowerCase();
    };

    let peticion = {
      idUsuario: this.idUsuario || null,
      nombre: this.nombre || null,
      apellidoPat: this.apellidoPat || null,
      apellidoMat: this.apellidoMat || null,
      fechaAlta: this.fechaRegistro || null,

      email: this.correoempresarial || null,
      idClientes: arregloenviar,
      esActivo: this.activo == 0? null:this.activo == 1
    };

    this.nombre = util.quitarAcentosYEspacios(this.nombre);
    this.apellidoPat = util.quitarAcentosYEspacios(this.apellidoPat);
    this.apellidoMat = util.quitarAcentosYEspacios(this.apellidoMat);
    this.correoempresarial = util.quitarAcentosYEspacios(this.correoempresarial);

    this.cargando = true;
    if(!desdeFiltrado){
      this.usuariosAuthPrd.filtrarUsuariosPaginado(peticion,this.elementos,this.pagina).subscribe(datos => {
        if(datos.datos){
          let arreglo:Array<any> = datos.datos.usuarios;
          console.log("ARREGLO RECIBIDO FILTRANDO",arreglo);
          if(arreglo)
             if(!repetir)
                arreglo.forEach(o => this.arreglo.push(o));
              else
                this.arreglo = arreglo;


              console.log("Arreglo total",this.arreglo);


          this.arreglotabla.totalRegistros = datos.datos.totalRegistros;
        }
        this.procesarTabla();
        this.cargando = false;
      });
    }else{
      this.arreglotabla = {
        reiniciar:desdeFiltrado || undefined
      };

      this.cargando = true;
      this.primeraVez = true;
    }
  }


  public recibirTabla(obj: any) {


    switch (obj.type) {
      case "editar":
        this.verdetalle(obj.datos);
        break;
      case "filaseleccionada":
        this.activarMultiseleccion = obj.datos;
        break;
      case "llave":
        this.generarllave(obj.datos);
        break;
      case "paginado_cantidad":
        this.elementos = obj.datos.elementos;
        this.pagina = obj.datos.pagina;
        if(!this.cargando || this.primeraVez){
          this.primeraVez = false;
          this.filtrar(obj.nuevos);
        }
        break;
    }

  }


  public generarllave(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas resetear y reenviar la clave de este usuario?").then((valor) => {
      if (valor) {
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        let objenviar = {
          username: obj.email?.toLowerCase()
        }

        this.usuariosSistemaPrd.enviarCorreorecuperacion(objenviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        });

      }
    });
  }



}








