import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratocolaboradorService } from 'src/app/modules/empleados/services/contratocolaborador.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { CalculosService } from 'src/app/shared/services/nominas/calculos.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {

  public arreglopintar: any = [false, false, false, false, false];

  public metodopagobool: boolean = false;
  public detallecompensacionbool: boolean = false;
  public esTransferencia: boolean = false;
  public submitEnviado: boolean = false;
  public indexMetodoSeleccionado: number = 0;


  public arregloMetodosPago: any = [];
  public arreglogrupoNomina: any = [];
  public arregloCompensacion: any = [];
  public arreglobancos: any = [];
  public idEmpleado: number = -1;
  public cuentaBanco: any = [];
  public empleado: any = {};
  public cargando: boolean = false;
  public detalleCuenta: boolean = false;
  public cargandoPer: boolean = false;
  public cargandoDed: boolean = false;


  public myFormMetodoPago!: FormGroup;

  public arreglotablaDed: any = [];
  public arreglotablaPer: any = [];
  public arreglotablaPert: any = {
    columnas: [],
    filas: []
  };


  public arreglotablaDedt: any = {
    columnas: [],
    filas: []
  };


  constructor(private modalPrd: ModalService, private catalogosPrd: CatalogosService, private ventana: VentanaemergenteService,
    private gruponominaPrd: GruponominasService, private usuariosSistemaPrd: UsuarioSistemaService,
    private formbuilder: FormBuilder, private router: ActivatedRoute, private routerPrd: Router, private contratoColaboradorPrd: ContratocolaboradorService,
    private bancosPrd: CuentasbancariasService,private calculoPrd:CalculosService) {

  }

  ngOnInit(): void {

    this.myFormMetodoPago = this.formbuilder.group({});
    this.myFormCompensacion = this.createFormCompensacion({});

    this.catalogosPrd.getAllMetodosPago(true).subscribe(datos => this.arregloMetodosPago = datos.datos);
    this.gruponominaPrd.getAll(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arreglogrupoNomina = datos.datos);;
    this.catalogosPrd.getCompensacion(true).subscribe(datos => this.arregloCompensacion = datos.datos);
    this.catalogosPrd.getCuentasBanco(true).subscribe(datos => this.arreglobancos = datos.datos);


    this.router.params.subscribe(params => {
      this.idEmpleado = params["id"];

      this.contratoColaboradorPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datos => {


        


        this.empleado = datos.datos;
        if (this.empleado.metodoPagoId.metodoPagoId == 4) {
          this.detalleCuenta = true;
        } else {
          this.detalleCuenta = false;
        }
      });

      this.bancosPrd.getByEmpleado(this.idEmpleado).subscribe(datos => {

        this.cuentaBanco = datos.datos;

      });



      this.cargandoPer = true;
      this.bancosPrd.getListaPercepcionesEmpleado(this.idEmpleado, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
        this.crearTablaPercepcion(datos);
      });


      this.cargandoDed = true;
      this.bancosPrd.getListaDeduccionesEmpleado(this.idEmpleado, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
        this.crearTablaDeduccion(datos);
      });

    });


  }


  public crearTablaPercepcion(datos: any) {
debugger;
    this.arreglotablaPer = datos.datos;

    let columnas: Array<tabla> = [
      new tabla("nombre", "Nombre de percepción"),
      new tabla("fechaInicioPer", "Fecha inicio de percepción"),
      new tabla("tipoMonto", "Tipo de monto"),
      new tabla("valor", "Valor(porcentaje/monto)"),
      new tabla("esActivo", "Estatus")
    ]


    this.arreglotablaPert = {
      columnas: [],
      filas: []
    }
    if (this.arreglotablaPer !== undefined) {
      for (let item of this.arreglotablaPer) {
        if(item.fechaInicio !== undefined ){
        item.fechaInicio = (new Date(item.fechaInicio).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaInicioPer = datepipe.transform(item.fechaInicio, 'dd-MMM-y')?.replace(".", "");
        }

        item.nombre = item.conceptoPercepcionId?.nombre;

        item.tipoMonto = (item.baseCalculoId?.baseCalculoId == '1') ? 'Porcentual' : 'Fijo';

        if (item.esActivo) {
          item.esActivo = true;
        }
        if (!item.esActivo) {
          item.esActivo = false;
        }
      }
    }


    this.arreglotablaPert.columnas = columnas;
    this.arreglotablaPert.filas = this.arreglotablaPer;
    this.cargandoPer = false;
  }

  public crearTablaDeduccion(datos: any) {
    debugger;

    this.arreglotablaDed = datos.datos;


    let columnas: Array<tabla> = [
      new tabla("nombre", "Nombre de deducción"),
      new tabla("fechaInicioDesctoDed", "Fecha inicio de descuento"),
      //new tabla("", "Tipo de descuento"),
      new tabla("valor", "Valor(porcentaje/monto)"),
      new tabla("esActivo", "Estatus")
    ]


    this.arreglotablaDedt = {
      columnas: [],
      filas: []
    }


    if (this.arreglotablaDed !== undefined) {
      for (let item of this.arreglotablaDed) {
        if(item.fechaInicioDescto !== undefined ){
        item.fechaInicioDescto = (new Date(item.fechaInicioDescto).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaInicioDesctoDed = datepipe.transform(item.fechaInicioDescto, 'dd-MMM-y')?.replace(".", "");
        }
        item.nombre = item.conceptoDeduccionId?.nombre;

        if (item.esActivo) {
          item.esActivo = true
        }
        if (!item.esActivo) {
          item.esActivo = false
        }
      }
    }

    this.arreglotablaDedt.columnas = columnas;
    this.arreglotablaDedt.filas = this.arreglotablaDed;
    this.cargandoDed = false;
  }


  public cambiarStatus(valor: any) {

    for (let x = 0; x < this.arreglopintar.length; x++) {

      if (x == valor) {
        continue;
      }

      this.arreglopintar[x] = false;

    }
    this.arreglopintar[valor] = !this.arreglopintar[valor];
  }

  //*****************Métodos de pago******************* */





  public createMyFormMetodoPago(obj: any) {
    return this.formbuilder.group({
      numeroCuenta: [obj.numeroCuenta, [Validators.required]],
      clabe: [obj.clabe, [Validators.required]],
      csBanco: [obj.bancoId?.bancoId, [Validators.required]],
      numInformacion: obj.numInformacion,
      cuentaBancoId: obj.cuentaBancoId
    });
  }

  public editandoMetodoPago(obj: any) {
    this.detalleCuenta = false;
    this.myFormMetodoPago = this.createMyFormMetodoPago({});
    this.metodopagobool = true;
    if (obj == undefined) {
      this.indexMetodoSeleccionado = this.empleado.metodoPagoId?.metodoPagoId;
    }
    this.esTransferencia = this.indexMetodoSeleccionado == 4;

    if (this.esTransferencia) {
      this.bancosPrd.getByEmpleado(this.idEmpleado).subscribe(datos => {
        if (datos.resultado) {
          this.myFormMetodoPago = this.createMyFormMetodoPago(datos.datos);
        }
      });

    }

  }

  public verdetallecom(obj: any) {
    this.routerPrd.navigate(['company', 'detalle_company', 'nuevo'], { state: { datos: undefined } });
  }

  public agregarPer() {

    let datosPer: any = {
      idEmpleado: this.idEmpleado,
      idEmpresa: this.usuariosSistemaPrd.getIdEmpresa()
    };
    this.ventana.showVentana(this.ventana.percepciones, { datos: datosPer }).then(valor => {
      if (valor.datos) {

        this.agregarNuevaPercepcion(valor.datos);
      }
    });
  }
  public agregarDed() {
    let datosDed: any = {
      idEmpleado: this.idEmpleado,
      idEmpresa: this.usuariosSistemaPrd.getIdEmpresa()
    };
    this.ventana.showVentana(this.ventana.deducciones, { datos: datosDed }).then(valor => {
      if (valor.datos) {

        this.agregarNuevaDeduccion(valor.datos);
      }
    });
  }

  public agregarNuevaPercepcion(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.bancosPrd.savePercepcionEmpleado(obj).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      this.bancosPrd.getListaPercepcionesEmpleado(this.idEmpleado, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
        this.crearTablaPercepcion(datos);
      });

    });
  }

  public modificarPercepcion(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.bancosPrd.modificarPercepcionEmpleado(obj).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      this.bancosPrd.getListaPercepcionesEmpleado(this.idEmpleado, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
        this.crearTablaPercepcion(datos);
      });
    });
  }

  public agregarNuevaDeduccion(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.bancosPrd.saveDeduccionEmpleado(obj).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      this.bancosPrd.getListaDeduccionesEmpleado(this.idEmpleado, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
        this.crearTablaDeduccion(datos);
      });
    });
  }

  public modificarDeduccion(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    this.bancosPrd.modificarDeduccionEmpleado(obj).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      this.bancosPrd.getListaDeduccionesEmpleado(this.idEmpleado, this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
        this.crearTablaDeduccion(datos);
      });
    });
  }

  public recibirTablaPer(obj: any) {

    if (obj.type == "editar") {
      let datosPer = obj.datos;
      this.ventana.showVentana(this.ventana.percepciones, { datos: datosPer }).then(valor => {
        if (valor.datos) {

          this.modificarPercepcion(valor.datos);
        }
      });

    }
  }

  public recibirTablaDed(obj: any) {

    if (obj.type == "editar") {
      let datosDed = obj.datos;
      this.ventana.showVentana(this.ventana.deducciones, { datos: datosDed }).then(valor => {
        if (valor.datos) {

          this.modificarDeduccion(valor.datos);
        }
      });
    }
  }

  public guardandometodoPago() {//Solo guarda el método de pago metodopagoid
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas actualizar los datos del método de pago?").then(valor => {
      if (valor) {

        let objEnviar = {
          ...this.empleado,
          metodoPagoId: {
            metodoPagoId: this.indexMetodoSeleccionado
          }
        }
        this.contratoColaboradorPrd.update(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
            if (datos.resultado) {
              this.empleado = datos.datos;
              this.metodopagobool = false;
              this.detallecompensacionbool = false;
            }
          });
        });

      }
    });
  }

  public validarBanco(clabe: any) {

    this.myFormMetodoPago.controls.csBanco.setValue("");
    this.myFormMetodoPago.controls.clabe.setValue("");

    if (this.myFormMetodoPago.controls.clabe.errors?.pattern === undefined) {


      if (clabe == '' || clabe == null || clabe == undefined) {

        this.myFormMetodoPago.controls.csBanco.setValue("");
        this.myFormMetodoPago.controls.clabe.setValue("");
      } else {
        this.bancosPrd.getListaCuentaBancaria(clabe).subscribe(datos => {
          if (datos.resultado) {

            this.myFormMetodoPago.controls.csBanco.setValue(datos.datos.bancoId);
            this.myFormMetodoPago.controls.clabe.setValue(clabe);

          }
          else {

            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
          }

        });

      }

    }

  }

  public enviandoMetodoPago() { //Método guardar transferencia bancaría...
    this.submitEnviado = true;
    if (this.myFormMetodoPago.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas guardar los datos?").then(valor => {
      if (valor) {
        let obj = this.myFormMetodoPago.value;
        let objEnviar: any = {
          numeroCuenta: obj.numeroCuenta,
          clabe: obj.clabe,
          bancoId: {
            bancoId: obj.csBanco
          },
          numInformacion: obj.numInformacion,
          ncoPersona: {
            personaId: this.idEmpleado
          },
          nclCentrocCliente: {
            centrocClienteId: this.empleado.centrocClienteId.centrocClienteId
          },
          nombreCuenta: '  '

        };


        if (obj.cuentaBancoId == undefined) {

          this.bancosPrd.save(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                let objEnviar = {
                  ...this.empleado,
                  metodoPagoId: {
                    metodoPagoId: this.indexMetodoSeleccionado
                  }
                }
                this.contratoColaboradorPrd.update(objEnviar).subscribe((respContrato) => {
                  this.empleado = respContrato.datos;

                  this.cancelar();
                });

              }
            });

          });
        } else {


          objEnviar.cuentaBancoId = obj.cuentaBancoId;
          objEnviar.esActivo = true;
          this.bancosPrd.modificar(objEnviar).subscribe(datos => {

            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                let objEnviar = {
                  ...this.empleado,
                  metodoPagoId: {
                    metodoPagoId: this.indexMetodoSeleccionado
                  }
                }


                this.contratoColaboradorPrd.update(objEnviar).subscribe((requestContrato) => {
                  this.empleado = requestContrato.datos;

                  this.cancelar();
                });

                this.ngOnInit();

              }
            });

          });
        }

      }
    });
  }

  public cancelar() {
    this.metodopagobool = false;
    this.detallecompensacionbool = false;
  }

  public cambiaValorMetodo() {
    this.editandoMetodoPago("");
  }
  public get f() {
    return this.myFormMetodoPago.controls;
  }



  //*********************Termina métodos de pago***************** */


  //*************Empieza lo de detalle de compensacion****************

  public myFormCompensacion!: FormGroup;
  public grupoNominaSeleccionado:any = {
    pagoComplementario: false
  };
;
  public sueldoBruto:boolean = false;
  public sueldoNeto:boolean = false;
  public sueldoControlName:string = "";


  public createFormCompensacion(obj: any) {
    return this.formbuilder.group({
      grupoNominaId: [obj.grupoNominaId?.grupoNominaId, [Validators.required]],
      tipoCompensacionId: [obj.tipoCompensacionId?.tipoCompensacionId, [Validators.required]],
      sueldoBrutoMensual: [obj.sueldoBrutoMensual, [Validators.required]],
      sueldoNetoMensual: obj.sueldoNetoMensual,
      salarioDiario: [{ value: obj.salarioDiario, disabled: true }, []],
      sbc: [{ value: obj.sbc, disabled: true }],
      salarioDiarioIntegrado: [obj.salarioDiarioIntegrado, []],
      tiposueldo: ['b', [Validators.required]],
      politicaId:[],
      fechaAntiguedad: [],
      fecIniPeriodo:[]
    });
  }

  public get fc(){
    return this.myFormCompensacion.controls;
  }

  public guardarDetalleCompensacion() {


    if (this.myFormCompensacion.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      Object.values(this.myFormCompensacion.controls).forEach(control => {
        control.markAsTouched();
      })
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas actualizar los datos del usuario?").then(valor => {
      if (valor) {

      }
    });
  }

  public enviarCompensacio() {
    if (this.myFormCompensacion.invalid) {
      Object.values(this.myFormCompensacion.controls).forEach(control =>{
        control.markAsTouched();
      });
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }


    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas actualizar los datos del empleado?").then(valor => {
      if (valor) {

        const obj = this.myFormCompensacion.value;
        const objEnviar = {
          ...this.empleado,
          grupoNominaId: { grupoNominaId: obj.grupoNominaId },
          tipoCompensacionId: { tipoCompensacionId: obj.tipoCompensacionId },
          sbc: obj.sbc
        }

        this.contratoColaboradorPrd.update(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(datos.resultados, datos.mensaje).then(() => {
            if (datos.resultado) {
              this.empleado = datos.datos;
              this.cancelar();
            }
          });
        });

      }
    });
  }


  public verDetalleCompensacion() {
    this.myFormCompensacion = this.createFormCompensacion(this.empleado);
    this.detallecompensacionbool = true
    this.suscribirseCompensacion();


    setTimeout(() => {
      this.myFormCompensacion.controls.sueldoBrutoMensual.setValue(2342.34);
      
    }, 3000);
  }


  public suscribirseCompensacion(){
  }



  public cambiarGrupoNomina() {
    
    const gruponominaId = this.myFormCompensacion.controls.grupoNominaId.value;

    let aux;

    for (let item of this.arreglogrupoNomina) {
      if (item.id == gruponominaId) {
        aux = item;
        break;
      }

      aux = {
        pagoComplementario: false
      };
    }

    this.grupoNominaSeleccionado = aux;
    //this.grupoNominaSeleccionado.pagoComplementario = true;

    if (this.grupoNominaSeleccionado.pagoComplementario) {


      this.myFormCompensacion.controls.tiposueldo.disable();
      this.myFormCompensacion.controls.tiposueldo.setValue('n');

      
      this.myFormCompensacion.controls.tipoCompensacionId.setValue(2);


      this.myFormCompensacion.controls.salarioDiario.enable();

      this.myFormCompensacion.controls.salarioDiario.setValidators([Validators.required]);
      this.myFormCompensacion.controls.salarioDiario.updateValueAndValidity();
      this.myFormCompensacion.controls.salarioDiarioIntegrado.setValidators([Validators.required]);
      this.myFormCompensacion.controls.salarioDiarioIntegrado.updateValueAndValidity();
      this.myFormCompensacion.controls.salarioDiarioIntegrado.disable();

      this.cambiarSueldoField();
    }else{
      this.myFormCompensacion.controls.salarioDiario.setValidators([]);
      this.myFormCompensacion.controls.salarioDiario.updateValueAndValidity();
      this.myFormCompensacion.controls.salarioDiarioIntegrado.setValidators([]);
      this.myFormCompensacion.controls.salarioDiarioIntegrado.updateValueAndValidity();


      this.myFormCompensacion.controls.tiposueldo.enable();
      this.myFormCompensacion.controls.salarioDiario.disable();
      
    }



  }


  public cambiarSueldoField() {



    this.sueldoBruto = this.myFormCompensacion.controls.tiposueldo.value == 'b';
    this.sueldoNeto = this.myFormCompensacion.controls.tiposueldo.value == 'n';

    
    

    this.myFormCompensacion.controls.sueldoNetoMensual.setValidators([]);
    this.myFormCompensacion.controls.sueldoNetoMensual.updateValueAndValidity();
    this.myFormCompensacion.controls.sueldoBrutoMensual.setValidators([]);
    this.myFormCompensacion.controls.sueldoBrutoMensual.updateValueAndValidity();

    if (this.sueldoNeto) {


      this.myFormCompensacion.controls.sueldoNetoMensual.setValidators([Validators.required]);
      this.myFormCompensacion.controls.sueldoNetoMensual.updateValueAndValidity();


    }

    if (this.sueldoBruto) {
      this.myFormCompensacion.controls.sueldoBrutoMensual.setValidators([Validators.required]);
      this.myFormCompensacion.controls.sueldoBrutoMensual.updateValueAndValidity();
    }

    
  }


  public cambiasueldobruto(){
   let objenviar =  {
      clienteId: this.usuariosSistemaPrd.getIdEmpresa(),
      politicaId: this.myFormCompensacion.controls.politicaId.value,
      grupoNomina: this.myFormCompensacion.controls.grupoNominaId.value,
      tipoCompensacion: this.myFormCompensacion.controls.tipoCompensacionId.value,
      sbmImss: this.myFormCompensacion.controls.sueldoBrutoMensual.value,
      fechaAntiguedad: this.myFormCompensacion.controls.fechaAntiguedad.value,
      fecIniPeriodo: new DatePipe("es-MX").transform(new Date(),"yyyy-MM-dd")    
    }

    this.modalPrd.showMessageDialog(this.modalPrd.loading,"Calculando");

    this.calculoPrd.calculoSueldoBruto(objenviar).subscribe(datos =>{

      let aux = datos.datos;
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      if(datos.datos !== undefined){
    
        
          this.myFormCompensacion.controls.salarioDiario.setValue(aux.salarioDiario);
          this.myFormCompensacion.controls.sbc.setValue(aux.salarioBaseDeCotizacion);
          this.myFormCompensacion.controls.sueldoNetoMensual.setValue(aux.salarioNetoMensual);
      }
    });

  }


 
  

  //*******************************Termina detalle compensación */

}
