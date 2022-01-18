import { Component, HostListener, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
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
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {
  lineBreak = '\n\r\xa0\xa0\xa0\xa0\xa0\xa0\n\r';


  public arreglopintar: any = [false, false, false, false, false];

  public metodopagobool: boolean = false;
  public detallecompensacionbool: boolean = false;
  public detallecompensacionboolNew: boolean = false;
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
  public sueldoBruto: boolean = false;
  public sueldoNeto: boolean = false;

  public myFormMetodoPago!: FormGroup;

  public arreglotablaDed: any = [];
  public arreglotablaPer: any = [];
  public datoscuenta: any = [];
  public respoContrato: any = [];
  public arreglotablaPert: any = {
    columnas: [],
    filas: []
  };


  public arreglotablaDedt: any = {
    columnas: [],
    filas: []
  };

  public esKiosko: boolean = false;

  public primeraVez: boolean = false;
  public calculoEfectuado: boolean = false;


  constructor(private modalPrd: ModalService, private catalogosPrd: CatalogosService, private ventana: VentanaemergenteService, private usuariosSistemaPrd: UsuarioSistemaService,
    private formbuilder: FormBuilder, private router: ActivatedRoute, private routerPrd: Router, private contratoColaboradorPrd: ContratocolaboradorService,
    private bancosPrd: CuentasbancariasService, private calculoPrd: CalculosService,
    private navparams: ActivatedRoute, private empleadoPrd: EmpleadosService) {

  }

  ngOnInit(): void {

    debugger;
    this.esKiosko = this.routerPrd.url.includes("/kiosko/perfil");
    this.navparams.params.subscribe(param => {
      this.idEmpleado = param["id"];
    });

    if(!this.esKiosko){
    this.arreglogrupoNomina = this.router.snapshot.data.gruponomina;
 
    this.empleado = this.router.snapshot.data.contratoColaborador;

    this.idEmpleado = this.empleado.personaId.personaId;
    this.primeraVez = true;
    this.myFormCompensacion = this.createFormCompensacion(this.empleado);

    if (this.empleado.metodoPagoId.metodoPagoId == 4) {
      this.detalleCuenta = true;
    } else {
      this.detalleCuenta = false;
    }


    this.cambiarGrupoNomina();

    }

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


    this.myFormMetodoPago = this.formbuilder.group({});
    this.catalogosPrd.getAllMetodosPago(true).subscribe(datos => this.arregloMetodosPago = datos.datos);
    this.catalogosPrd.getCompensacion(true).subscribe(datos => this.arregloCompensacion = datos.datos);
    this.catalogosPrd.getCuentasBanco(true).subscribe(datos => this.arreglobancos = datos.datos);



  }


  public crearTablaPercepcion(datos: any) {

    this.arreglotablaPer = datos.datos;
    let columnas: Array<tabla> = [

      new tabla("nombre", "Nombre de percepción"),
      new tabla("fechaInicioPer", 'Fecha inicio percepción'),
      new tabla("tipoMonto", "Tipo de monto"),
      new tabla("valorMonto", 'Valor (porcentaje/monto)'),
      new tabla("activo", "Estatus de percepción")
    ]

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })


    this.arreglotablaPert = {
      columnas: [],
      filas: []
    }
    if (this.arreglotablaPer !== undefined) {
      for (let item of this.arreglotablaPer) {
        if (item.fechaInicio !== undefined) {
          item.fechaInicio = (new Date(item.fechaInicio).toUTCString()).replace(" 00:00:00 GMT", "");
          let datepipe = new DatePipe("es-MX");
          item.fechaInicioPer = datepipe.transform(item.fechaInicio, 'dd-MMM-y')?.replace(".", "");
        }

        item.nombre = item.conceptoPercepcionId?.nombre;

        item.tipoMonto = (item.baseCalculoId?.baseCalculoId == '1') ? 'Porcentual' : 'Fijo';

        if (item.esActivo) {
          item.activo = 'Activo';
        }
        if (!item.esActivo) {
          item.activo = 'Inactivo';
        }
        if (item.tipoPercepcionId?.noEditable !== undefined) {
          item.tipoPercepcionId.noEditable = false;
        }
        if (item.tipoPercepcionId?.porDefecto !== undefined) {
          item.tipoPercepcionId.porDefecto = false;
        }
        if (item.valor !== undefined) {
          if (item.baseCalculoId?.baseCalculoId == '1')
              item.valorMonto = item.valor + '%';
          else
              item.valorMonto = formatter.format(item.valor);

        }
        else if (item.montoTotal !== undefined) {
          item.valorMonto = formatter.format(item.montoTotal);
        }
      }
    }


    this.arreglotablaPert.columnas = columnas;
    this.arreglotablaPert.filas = this.arreglotablaPer;
    this.cargandoPer = false;
  }



  public crearTablaDeduccion(datos: any) {


    this.arreglotablaDed = datos.datos;


    let columnas: Array<tabla> = [
      new tabla("nombre", "Nombre de deducción"),
      new tabla("fechaInicioDesctoDed", 'Fecha inicio de descuento'),
      //new tabla("", "Tipo de descuento"),
      new tabla("valorMonto", 'Valor (porcentaje/monto)'),
      new tabla("activo", "Estatus de deducción")
    ]

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })

    this.arreglotablaDedt = {
      columnas: [],
      filas: []
    }


    if (this.arreglotablaDed !== undefined) {

      for (let item of this.arreglotablaDed) {
        if (item.fechaInicioDescto !== undefined) {
          item.fechaInicioDescto = (new Date(item.fechaInicioDescto).toUTCString()).replace(" 00:00:00 GMT", "");
          let datepipe = new DatePipe("es-MX");
          item.fechaInicioDesctoDed = datepipe.transform(item.fechaInicioDescto, 'dd-MMM-y')?.replace(".", "");
        }
        item.nombre = item.conceptoDeduccionId?.nombre;

        if (item.tipoDeduccionId.noEditable == true) {
          item.tipoDeduccionId.noEditable = false;
        }

        if (item.esActivo) {
          item.activo = 'Activo';
        }
        if (!item.esActivo) {
          item.activo = 'Inactivo';
        }

        if (item.tipoPercepcionId?.noEditable !== undefined) {
          item.tipoPercepcionId.noEditable = false;
        }
        if (item.tipoPercepcionId?.porDefecto !== undefined) {
          item.tipoPercepcionId.porDefecto = false;
        }
        if (item.valor !== undefined) {
            if (item.baseCalculoId?.baseCalculoId == '1'){
              item.valorMonto = item.valor + '%';
            }else{
              item.valorMonto = formatter.format(item.valor);
            }
        }
        else if (item.montoTotal !== undefined) {
          item.valorMonto = item.montoTotal
        }
        else if (item.interesPorcentaje !== undefined) {
          item.valorMonto = item.interesPorcentaje
        }
      }
    }

    this.arreglotablaDedt.columnas = columnas;
    this.arreglotablaDedt.filas = this.arreglotablaDed;
    this.cargandoDed = false;
  }


  public cambiarStatus(valor: any) {

    if (!(!!this.arreglogrupoNomina)) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "Esperar, cargando cátalogos necesarios");
      return;
    } else if (this.arreglogrupoNomina.length == 0) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "Esperar, cargando cátalogos necesarios");
      return;
    }





    for (let x = 0; x < this.arreglopintar.length; x++) {

      if (x == valor) {
        continue;
      }

      this.arreglopintar[x] = false;

    }
    this.arreglopintar[valor] = !this.arreglopintar[valor];

    if (valor) {
      this.cambiarGrupoNomina();
    }
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


  public editandoMetodoPagoNew(obj: any) {


    if (obj == undefined) {
      this.indexMetodoSeleccionado = this.empleado.metodoPagoId?.metodoPagoId;
    }
    this.bancosPrd.getByEmpleado(this.idEmpleado).subscribe(datos => {

        if (datos.resultado) {
          this.datoscuenta = datos.datos;

          let datosEnv : any = {
            metodoPagoId: this.indexMetodoSeleccionado,
            idEmpleado: this.idEmpleado,
            idEmpresa: this.empleado.centrocClienteId.centrocClienteId,
            datoscuenta: this.datoscuenta
          };

          this.ventana.showVentana(this.ventana.detallecuenta,{datos:datosEnv}).then(valor =>{

            if(valor.datos){
                this.enviandoMetodoPagoNew(valor.datos);
            }
          });

        }

      });

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


  public enviandoMetodoPagoNew(objEn : any) { //Método guardar transferencia bancaría...


        let objContrato = {
          ...this.empleado,
          metodoPagoId: {
            metodoPagoId: Number(objEn.idMetodoPago)
          }
        }
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.contratoColaboradorPrd.update(objContrato).subscribe((respContrato) => {

          if (respContrato.resultado) {
            this.empleado = respContrato.datos;
            if (Number(objEn.idMetodoPago) != 4) {
                  this.modalPrd.showMessageDialog(respContrato.resultado,respContrato.mensaje);
                  this.cancelar();
                  return;
            }

            if (!Boolean(objEn.cuentaBancoId)) {
              delete objEn.idMetodoPago;
              delete objEn.cuentaBancoId;
              this.bancosPrd.save(objEn).subscribe(datos => {
                this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
                  if (datos.resultado) {
                    this.bancosPrd.getByEmpleado(this.idEmpleado).subscribe(datos => {
                      this.cuentaBanco = datos.datos;

                      this.cancelar();
                      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

                    });

                  } else {
                    this.modalPrd.showMessageDialog(datos.resultado);
                  }
                });

              });
            } else {
              delete objEn.idMetodoPago;
              objEn.cuentaBancoId = objEn.cuentaBancoId;
              objEn.esActivo = true;
              this.bancosPrd.modificar(objEn).subscribe(datos => {
                this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
                  this.bancosPrd.getByEmpleado(this.idEmpleado).subscribe(datos => {
                    this.cuentaBanco = datos.datos;

                    this.cancelar();
                    this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

                  });
                });

              });
            }

          } else {
            this.modalPrd.showMessageDialog(respContrato.resultado, respContrato.mensaje)
          }
        });

  }

  public cancelar() {

    if (this.empleado.metodoPagoId.metodoPagoId == 4) {
      this.detalleCuenta = true;
    }else{
      this.detalleCuenta = false;
    }
    this.metodopagobool = false;
    this.detallecompensacionbool = false;
  }

/*   public cancelarEspecial() {
    this.recalcular = false;
    this.primeraVez = true;
    // this.createFormCompensacion(this.empleado);
    this.myFormCompensacion.controls.grupoNominaId.setValue(this.empleado.grupoNominaId.grupoNominaId);
    this.cambiarGrupoNomina();
    this.myFormCompensacion = this.createFormCompensacion(this.empleado);
    this.detallecompensacionbool = false;
  } */

  public cancelarEspecial() {
    this.recalcular = false;
    this.primeraVez = true;
    //this.myFormCompensacion.controls.grupoNominaId.setValue(this.empleado.grupoNominaId.grupoNominaId);
    //this.cambiarGrupoNomina();
    this.detallecompensacionbool = false;
  }

  public get f() {
    return this.myFormMetodoPago.controls;
  }



  //*********************Termina métodos de pago***************** */


  //*************Empieza lo de detalle de compensacion****************

  public myFormCompensacion!: FormGroup;
  public grupoNominaSeleccionado: any = {
    pagoComplementario: false
  };
  ;
  public sueldoControlName: string = "";
  public typeppp: boolean = false;


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
      politicaId: [obj.politicaId?.politicaId],
      fechaAntiguedad: [obj.fechaAntiguedad],
      fecIniPeriodo: [],
      salarioNetoMensualImss: [obj.salarioNetoMensualImss],
      pagoComplementario: [{ value: obj.pagoComplementario, disabled: true }],
      sueldonetomensualppp: [obj.sueldonetomensualppp],
      sueldoBrutoMensualPPP: [{ value: obj.pppSalarioBaseMensual, disabled: true }]
    });
  }

  public get fc() {
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
    if (this.recalcular) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe calcular de nuevo el sueldo");
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas actualizar los datos del usuario?").then(valor => {
      if (valor) {
        this.enviarCompensacio();
      }
    });
  }

  public enviarCompensacio() {
    const obj = this.myFormCompensacion.getRawValue();
    const objEnviar = {
      ...this.empleado,
      grupoNominaId: { grupoNominaId: obj.grupoNominaId },
      tipoCompensacionId: { tipoCompensacionId: obj.tipoCompensacionId },
      sbc: obj.sbc,
      sueldoNetoMensual: obj.sueldoNetoMensual,
      sueldoBrutoMensual: obj.sueldoBrutoMensual,
      salarioDiario: obj.salarioDiario,

    }
    if (this.grupoNominaSeleccionado.pagoComplementario) {
      objEnviar.sueldoNetoMensual = obj.salarioNetoMensualImss; //Pago imss
      delete obj.salarioNetoMensualImss;
      objEnviar.pppMontoComplementario = obj.pagoComplementario; //Pago complementario
      objEnviar.sbc = obj.salarioDiarioIntegrado; //Sañario integrado
      delete obj.salarioDiarioIntegrado;
      objEnviar.pppSalarioBaseMensual = obj.sueldoBrutoMensualPPP;//sueldo menusal ppp
      objEnviar.pppSnm = obj.sueldonetomensualppp;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.contratoColaboradorPrd.updateCmpensacionKardex(objEnviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
        if (datos.resultado) {
          this.empleado = datos.datos;
          this.cancelarEspecial();
          this.ngOnInit();
        }
      });
    });
  }

  public enviarCompensacioNew(objcompe : any) {


    this.sueldoBruto = objcompe.sueldoBruto;
    this.sueldoNeto = objcompe.sueldoNeto;
    this.typeppp = objcompe.typeppp;
    delete objcompe.sueldoBruto;
    delete objcompe.sueldoNeto;
    delete objcompe.typeppp;

    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.contratoColaboradorPrd.updateCmpensacionKardex(objcompe).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
        if (datos.resultado) {
          this.empleado = datos.datos;
          this.cancelarEspecial();
          //this.ngOnInit();
        }
      });
    });
  }
  public cambiassueldoPPP() {

    if (this.myFormCompensacion.controls.salarioDiario.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe ingresar el salario diario");
      return;
    }


    let objenviar: any = {
      clienteId: this.usuariosSistemaPrd.getIdEmpresa(),
      politicaId: this.myFormCompensacion.controls.politicaId.value,
      grupoNomina: this.myFormCompensacion.controls.grupoNominaId.value,
      tipoCompensacion: this.myFormCompensacion.controls.tipoCompensacionId.value,
      pagoNeto: this.myFormCompensacion.controls.sueldonetomensualppp.value,
      fechaAntiguedad: this.myFormCompensacion.controls.fechaAntiguedad.value,
      fechaContrato: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd"),
      sdImss: this.myFormCompensacion.controls.salarioDiario.value
    }



    //*************calculo PPP *******************+ */

    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.calculoPrd.calculoSueldoNetoPPP(objenviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      let aux = datos.datos;
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      if (datos.datos !== undefined) {

        this.myFormCompensacion.controls.salarioDiarioIntegrado.setValue(aux.sbc);
        this.myFormCompensacion.controls.salarioNetoMensualImss.setValue(aux.sueldoNetoMensual);
        this.myFormCompensacion.controls.sueldoNetoMensual.setValue(aux.sueldoNetoMensual);
        this.myFormCompensacion.controls.sueldoBrutoMensual.setValue(aux.sueldoBrutoMensual);
        this.myFormCompensacion.controls.pagoComplementario.setValue(aux.pppMontoComplementario);
        this.myFormCompensacion.controls.sueldoBrutoMensualPPP.setValue(aux.pppSbm);
        this.recalcular = false;



      }
    });

  }




  public verDetalleCompensacion() {

    this.recalcular = false;
    this.detallecompensacionbool = true
    console.log("DETALLE COMPENSACION", this.typeppp);
    this.suscribirseCompensacion();
    if (this.typeppp) {
      this.myFormCompensacion.controls.sueldonetomensualppp.setValue(this.empleado.pppSnm || 0);
      this.myFormCompensacion.controls.salarioDiarioIntegrado.setValue(this.empleado.sbc);
      this.myFormCompensacion.controls.salarioNetoMensualImss.setValue(this.empleado.sueldoNetoMensual);
      this.myFormCompensacion.controls.pagoComplementario.setValue(this.empleado.pppMontoComplementario);

    }
  }

  public verDetalleCompensacionNew() {

    this.recalcular = false;

      let datosEnv : any = {
        idEmpleado: this.idEmpleado,
        idEmpresa: this.empleado.centrocClienteId.centrocClienteId,
        datoscompensacion: this.empleado,
        typeppp: this.typeppp,
        detallecompensacionbool: this.detallecompensacionboolNew = true,
        sueldoBruto : this.sueldoBruto,
        sueldoNeto : this.sueldoNeto
      };
      this.ventana.showVentana(this.ventana.detallecompesacion,{datos:datosEnv}).then(valor =>{
        if(valor.datos){
            this.enviarCompensacioNew(valor.datos);
        }
      });


  }


  public recalcular: boolean = false;

  public suscribirseCompensacion() {
    this.cambiarSueldoField();

    this.myFormCompensacion.controls.sueldoBrutoMensual.valueChanges.subscribe(valor => {
      if (this.myFormCompensacion.controls.tiposueldo.value == 'b') {
        this.recalcular = true;
      }
    })
    this.myFormCompensacion.controls.sueldoNetoMensual.valueChanges.subscribe(valor => {
      if (this.myFormCompensacion.controls.tiposueldo.value == 'n') {
        this.recalcular = true;
      }
    })

    this.myFormCompensacion.controls.sueldonetomensualppp.valueChanges.subscribe(valor =>{
      if(this.detallecompensacionbool && this.typeppp){
        this.recalcular = true;
      }
    });

  }






  public cambiarGrupoNomina() {




    const gruponominaId = this.myFormCompensacion.controls.grupoNominaId.value;
    console.log(gruponominaId);


    this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);


    let aux = this.verificandoGruponomina(gruponominaId);




    if (!this.primeraVez) {

      this.limpiarMontos()
    }
    this.primeraVez = false;
    this.grupoNominaSeleccionado = aux;
    //this.grupoNominaSeleccionado.pagoComplementario = true;






    if (this.grupoNominaSeleccionado.pagoComplementario) {

      this.typeppp = true;


      this.myFormCompensacion.controls.sueldonetomensualppp.setValidators([Validators.required]);
      this.myFormCompensacion.controls.sueldonetomensualppp.updateValueAndValidity();

      this.myFormCompensacion.controls.salarioNetoMensualImss.disable();
      this.myFormCompensacion.controls.pagoComplementario.disable();


      this.myFormCompensacion.controls.tiposueldo.disable();
      this.myFormCompensacion.controls.tiposueldo.setValue('n');


      this.myFormCompensacion.controls.tipoCompensacionId.setValue(2);


      this.myFormCompensacion.controls.salarioDiario.enable();
      this.myFormCompensacion.controls.salarioDiarioIntegrado.disable();

      this.myFormCompensacion.controls.salarioDiario.setValidators([Validators.required]);
      this.myFormCompensacion.controls.salarioDiario.updateValueAndValidity();
      this.myFormCompensacion.controls.salarioDiarioIntegrado.setValidators([Validators.required]);
      this.myFormCompensacion.controls.salarioDiarioIntegrado.updateValueAndValidity();



    } else {

      this.typeppp = false;

      this.myFormCompensacion.controls.sueldonetomensualppp.clearValidators();
      this.myFormCompensacion.controls.sueldonetomensualppp.updateValueAndValidity();
      this.myFormCompensacion.controls.salarioDiario.setValidators([]);
      this.myFormCompensacion.controls.salarioDiario.updateValueAndValidity();
      this.myFormCompensacion.controls.salarioDiarioIntegrado.setValidators([]);
      this.myFormCompensacion.controls.salarioDiarioIntegrado.updateValueAndValidity();


      this.myFormCompensacion.controls.tiposueldo.enable();
      this.myFormCompensacion.controls.salarioDiario.disable();

    }

    this.cambiarSueldoField();

  }

  public verificandoGruponomina(gruponominaId: number) {
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
    return aux;
  }

  public limpiarMontos() {
    this.myFormCompensacion.controls.tipoCompensacionId.setValue("");
    this.myFormCompensacion.controls.tiposueldo.setValue("b");
    this.myFormCompensacion.controls.sueldoNetoMensual.setValue("");
    this.myFormCompensacion.controls.sueldoBrutoMensual.setValue("");
    this.myFormCompensacion.controls.sueldonetomensualppp.setValue("");
    this.myFormCompensacion.controls.salarioDiario.setValue("");
    this.myFormCompensacion.controls.salarioDiarioIntegrado.setValue("");
    this.myFormCompensacion.controls.sbc.setValue("");
    this.myFormCompensacion.controls.salarioNetoMensualImss.setValue("");
    this.myFormCompensacion.controls.pagoComplementario.setValue("");
    this.myFormCompensacion.controls.sueldoBrutoMensualPPP.setValue("");

  }


  public cambiarSueldoField() {



    this.sueldoBruto = this.myFormCompensacion.controls.tiposueldo.value == 'b';
    this.sueldoNeto = this.myFormCompensacion.controls.tiposueldo.value == 'n';




    this.myFormCompensacion.controls.sueldoNetoMensual.setValidators([]);
    this.myFormCompensacion.controls.sueldoNetoMensual.updateValueAndValidity();
    this.myFormCompensacion.controls.sueldoBrutoMensual.setValidators([]);
    this.myFormCompensacion.controls.sueldoBrutoMensual.updateValueAndValidity();

    this.myFormCompensacion.controls.sueldoBrutoMensual.disable();
    this.myFormCompensacion.controls.sueldoNetoMensual.disable();

    if (this.sueldoNeto) {


      this.myFormCompensacion.controls.sueldoNetoMensual.setValidators([Validators.required]);
      this.myFormCompensacion.controls.sueldoNetoMensual.updateValueAndValidity();

      this.myFormCompensacion.controls.sueldoNetoMensual.enable();
    }

    if (this.sueldoBruto) {
      this.myFormCompensacion.controls.sueldoBrutoMensual.enable();
      this.myFormCompensacion.controls.sueldoBrutoMensual.setValidators([Validators.required]);
      this.myFormCompensacion.controls.sueldoBrutoMensual.updateValueAndValidity();
    }


  }


  public cambiasueldobruto(esBruto: boolean) {

    if (this.verificaCambiosNecesarios()) return;




    if (this.grupoNominaSeleccionado.pagoComplementario) {
      if (this.myFormCompensacion.controls.salarioDiario.invalid) {

        this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe ingresar el salario diario");
        return;
      }
    } else {
      if (this.myFormCompensacion.controls.sueldoBrutoMensual.invalid) {
        this.modalPrd.showMessageDialog(this.modalPrd.error, "Falta sueldo bruto mensual");
        return;
      }
    }

    let objenviar = {
      clienteId: this.usuariosSistemaPrd.getIdEmpresa(),
      politicaId: this.myFormCompensacion.controls.politicaId.value,
      grupoNomina: this.myFormCompensacion.controls.grupoNominaId.value,
      tipoCompensacion: this.myFormCompensacion.controls.tipoCompensacionId.value,
      sbmImss: this.myFormCompensacion.controls.sueldoBrutoMensual.value,
      fechaAntiguedad: this.myFormCompensacion.controls.fechaAntiguedad.value,
      fecIniPeriodo: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd")
    }

    this.modalPrd.showMessageDialog(this.modalPrd.loading, "Calculando");


    if (esBruto) {
      this.calculoPrd.calculoSueldoBruto(objenviar).subscribe(datos => {


        let aux = datos.datos;
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        if (datos.datos) {


          this.myFormCompensacion.controls.salarioDiario.setValue(aux.salarioDiario);
          this.myFormCompensacion.controls.sbc.setValue(aux.salarioBaseDeCotizacion);
          this.myFormCompensacion.controls.sueldoNetoMensual.setValue(aux.salarioNetoMensual);
          this.recalcular = false;
        } else {
          this.modalPrd.showMessageDialog(this.modalPrd.error, datos.mensaje);
          return;
        }
      });
    } else {
      console.warn("SE VA A CALCULAR EL SUELDO NETO MENSUAL A BRUTO MENSUAL");

      let objenviarMensual = {
        centroClienteId: this.usuariosSistemaPrd.getIdEmpresa(),
        politicaId: this.fc.politicaId.value,
        grupoNominaId: this.fc.grupoNominaId.value,
        periodicidadId: "05",
        sueldoNeto: this.fc.sueldoNetoMensual.value,
        fechaAntiguedad: this.fc.fechaAntiguedad.value,
        fechaInicio: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd")
      };
      this.calculoPrd.calculoSueldoNetoabruto(objenviarMensual).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        let aux = datos.datos;
        if (datos.resultado) {
          if (datos.datos !== undefined) {
            this.myFormCompensacion.controls.salarioDiario.setValue(aux.salarioDiario);
            this.myFormCompensacion.controls.sbc.setValue(aux.salarioBaseDeCotizacion);
            this.myFormCompensacion.controls.sueldoBrutoMensual.setValue(aux.salarioBrutoMensual);
            this.recalcular = false;
          }
        } else {
          this.modalPrd.showMessageDialog(this.modalPrd.error, datos.mensaje);
          return;
        }
      });
    }

  }


  public verificaCambiosNecesarios(): boolean {
    let variable: boolean = false;


    if (this.myFormCompensacion.controls.grupoNominaId.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar un grupo de  nómina");
      variable = true;
    }
    if (this.myFormCompensacion.controls.tipoCompensacionId.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar la compensación");
      variable = true;
    }
    return variable;
  }



  public calcularSueldo() {

    if (!this.grupoNominaSeleccionado.pagoComplementario) {
      this.cambiasueldobruto(this.fc.tiposueldo.value == 'b');
    } else {
      this.cambiassueldoPPP();
    }
  }


  //*******************************Termina detalle compensación */

}
