import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ventana-percepciones',
  templateUrl: './ventana-percepciones.component.html',
  styleUrls: ['./ventana-percepciones.component.scss']
})
export class VentanaPercepcionesComponent implements OnInit {
  public myForm!: FormGroup;
  public esInsert: boolean = false;
  public obj: any = [];
  public submitEnviado: boolean = false;
  public arregloTipoMonto: any = [];
  public estandar: boolean = false;
  public periodica: boolean = true;
  public monto: number = 0;
  public numPeriodo: number = 0;
  public montoPercepcion: any = [];
  public nombrePercepcion: any = [];
  public fijo: boolean = false;
  public porcentual: boolean = true;
  public empresa: number = 0;
  public empleado: number = 0;
  public conceptoPercepcionId: number = 0;
  public objEnviar: any = [];
  public politica: number = 0;
  public nombrePer: string = "";
  public nomPercepcion: number = 0;

  @Input() public datos: any;


  @Output() salida = new EventEmitter<any>();


  constructor(private modalPrd: ModalService, private formBuild: FormBuilder, private catalogosPrd: CatalogosService,
    private bancosPrd: CuentasbancariasService) { }

  ngOnInit(): void {


    if (this.datos.idEmpleado != undefined) {
      this.empresa = this.datos.idEmpresa;
      this.empleado = this.datos.idEmpleado;
      this.politica = this.datos.idPolitica;
    } else {
      this.empresa = this.datos.centrocClienteId?.centrocClienteId;
      this.empleado = this.datos.personaId?.personaId;
      this.politica = this.datos.politicaId?.politicaId;
    }

    this.catalogosPrd.getTipoBaseCalculo(true).subscribe(datos => this.arregloTipoMonto = datos.datos);

    if (this.datos.idEmpleado != undefined) {
      this.datos = {};
      this.esInsert = true;
      this.myForm = this.createForm(this.datos);

    } else {

      this.esInsert = false;
      this.datos = {
        ...this.datos,
        tipoPercepcion: this.datos.tipoPercepcionId?.tipoPercepcionId + "-" + this.datos.conceptoPercepcionId?.conceptoPercepcionId
      };

      this.myForm = this.createForm(this.datos);
      let tipo = (this.datos.conceptoPercepcionId?.tipoPeriodicidad == 'P') ? '1' : '2'
      this.validarTipoPercepcion(tipo);

    }
    this.myForm.clearValidators();
    this.myForm.updateValueAndValidity();
    

    this.suscripciones();


  }

  public suscripciones() {

    this.myForm.value;

    this.myForm.controls.montoPercepcion.valueChanges.subscribe(valor => {
      this.validarMonto(valor)
    });

    this.myForm.controls.numeroPeriodos.valueChanges.subscribe(valor => {
      this.validarNumPeriodo(valor)
    });

    this.myForm.controls.tipoPeriodicidadId.valueChanges.subscribe(valor => {
      this.validarTipoPercepcion(valor)
    });
    this.myForm.controls.nomPercepcion.valueChanges.subscribe(valor => {
      this.validarPercepcion(valor);
    });

    this.myForm.controls.baseCalculoId.valueChanges.subscribe(valor => {
      this.validarNomMonto(valor);
    });
  }

  public createForm(obj: any) {

    let datePipe = new DatePipe("en-MX");
    if (!this.esInsert) {
      obj.tipoPeriodicidadId = (obj.conceptoPercepcionId?.tipoPeriodicidad == 'P') ? '1' : '2';
    }

    return this.formBuild.group({

      //numeroCargo: [obj.numeroPeriodos],
      numeroPeriodos: [obj.numeroPeriodos],
      tipoPeriodicidadId: [obj.tipoPeriodicidadId, Validators.required],
      baseCalculoId: [obj.baseCalculoId?.baseCalculoId],
      porcentaje: [obj.valor],
      montoPorPeriodo: [obj.montoPorPeriodo],
      fechaInicio: [datePipe.transform(obj.fechaInicio, 'yyyy-MM-dd'), Validators.required],
      montoPercepcion: [obj.montoTotal],
      nomPercepcion: [{ value: obj.tipoPercepcion, disabled: !Boolean(obj.tipoPercepcion) }, Validators.required],
      referencia: [obj.referencia],
      esActivo: [(!this.esInsert) ? obj.esActivo : { value: "true", disabled: true }, Validators.required]

    });

  }

  public cancelar() {
    this.salida.emit({ type: "cancelar" });
  }

  public validarPercepcion(tipo: any) {

    let split = tipo.split("-");
    tipo = split[1];

    for (let item of this.nombrePercepcion) {
      if (item.conceptoPercepcionId == tipo) {
        this.conceptoPercepcionId = item.conceptoPercepcionId;
      }
    }


  }

  public validarTipoPercepcion(tipo: any) {
    debugger;
    this.myForm.clearValidators();
    this.myForm.updateValueAndValidity();
/*     
    if(!this.esInsert){
      this.myForm.controls.nomPercepcion.enable();
    }else{
    this.myForm.controls.nomPercepcion.disable();
    } */


    if (Boolean(tipo)) {
      
      if (tipo == 1) {
        
        this.myForm.controls.baseCalculoId.setValidators([Validators.required]);
        this.myForm.controls.baseCalculoId.updateValueAndValidity();
        this.myForm.controls.montoPercepcion.setValidators([Validators.required]);
        this.myForm.controls.montoPercepcion.updateValueAndValidity();
        this.myForm.controls.numeroPeriodos.setValidators([Validators.required]);
        this.myForm.controls.numeroPeriodos.updateValueAndValidity();
        this.myForm.controls.montoPorPeriodo.setValidators([Validators.required]);
        this.myForm.controls.montoPorPeriodo.updateValueAndValidity();


        this.myForm.controls.porcentaje.setValue('');
        this.myForm.controls.porcentaje.setValidators([]);
        this.myForm.controls.porcentaje.updateValueAndValidity();

        this.nombrePer = "P";
        this.periodica = true;
        this.estandar = false;
        this.myForm.controls.baseCalculoId.disable();
        this.myForm.controls.baseCalculoId.setValue(2);
        if(this.esInsert){
          this.myForm.controls.nomPercepcion.setValue('');
          this.myForm.controls.nomPercepcion.updateValueAndValidity();
        }

        if (this.politica) {

          this.bancosPrd.getObtenerPoliticaPeriodicidad(this.empresa, this.nombrePer).subscribe(datos => {
            if(datos.datos != undefined){
              for (let item of datos.datos) {
                item.tipoPercepcion = item.tipoPercepcionId.tipoPercepcionId + "-" + item.conceptoPercepcionId;
              }
              this.nombrePercepcion = datos.datos;
              this.myForm.controls.nomPercepcion.enable();
            }else{
              this.myForm.controls.nomPercepcion.enable();
              this.myForm.controls.nomPercepcion.setValidators([Validators.required]);
              this.myForm.controls.nomPercepcion.updateValueAndValidity();
            }

          });

        } else {
          
          this.bancosPrd.getObtenerPeriodicidad(this.empresa, this.nombrePer).subscribe(datos => {
            if(datos.datos != undefined){
              for (let item of datos.datos) {
                item.tipoPercepcion = item.tipoPercepcionId.tipoPercepcionId + "-" + item.conceptoPercepcionId;

              }
              this.nombrePercepcion = datos.datos;
              this.myForm.controls.nomPercepcion.enable();
            }else{
              this.myForm.controls.nomPercepcion.enable();
              this.myForm.controls.nomPercepcion.setValidators([Validators.required]);
              this.myForm.controls.nomPercepcion.updateValueAndValidity();
            } 
          });
        }
      } else {
        this.myForm.controls.porcentaje.setValidators([Validators.required]);
        this.myForm.controls.baseCalculoId.setValidators([Validators.required]);
        this.myForm.controls.baseCalculoId.updateValueAndValidity();

        this.myForm.controls.baseCalculoId.setValue('');
        this.myForm.controls.montoPercepcion.setValue('');
        this.myForm.controls.numeroPeriodos.setValue('');
        this.myForm.controls.montoPorPeriodo.setValue('');

        this.myForm.controls.montoPercepcion.setValidators([]);
        this.myForm.controls.montoPercepcion.updateValueAndValidity();
        this.myForm.controls.numeroPeriodos.setValidators([]);
        this.myForm.controls.numeroPeriodos.updateValueAndValidity();
        this.myForm.controls.montoPorPeriodo.setValidators([]);
        this.myForm.controls.montoPorPeriodo.updateValueAndValidity();

        this.nombrePer = "E";
        this.myForm.controls.baseCalculoId.enable();
        if (!this.esInsert) {
          let tipoMonto = this.datos.baseCalculoId?.baseCalculoId;
          this.myForm.controls.baseCalculoId.setValue(tipoMonto);
          this.validarNomMonto(tipoMonto);
        } else {
            this.myForm.controls.nomPercepcion.setValue('');
            this.myForm.controls.nomPercepcion.updateValueAndValidity();

          this.myForm.controls.baseCalculoId.setValue("");
        }
        this.periodica = false;
        this.estandar = true;
        if(Boolean(this.politica)) {
          this.bancosPrd.getObtenerPoliticaPeriodicidad(this.empresa, this.nombrePer).subscribe(datos => {
            if(datos.datos != undefined){
              for (let item of datos.datos) {
                item.tipoPercepcion = item.tipoPercepcionId.tipoPercepcionId + "-" + item.conceptoPercepcionId;

              }

              this.nombrePercepcion = datos.datos;
              this.myForm.controls.nomPercepcion.enable();
            }else{
              this.myForm.controls.nomPercepcion.enable();
              this.myForm.controls.nomPercepcion.setValidators([Validators.required]);
              this.myForm.controls.nomPercepcion.updateValueAndValidity();
            }  

          });
        } else {
          
          this.bancosPrd.getObtenerPeriodicidad(this.empresa, this.nombrePer).subscribe(datos => {
          if(datos.datos != undefined){  
            for (let item of datos.datos) {
              item.tipoPercepcion = item.tipoPercepcionId.tipoPercepcionId + "-" + item.conceptoPercepcionId;

            }
            this.myForm.controls.nomPercepcion.enable();
            this.nombrePercepcion = datos.datos;
          }else{
            this.myForm.controls.nomPercepcion.enable();
            this.myForm.controls.nomPercepcion.setValidators([Validators.required]);
            this.myForm.controls.nomPercepcion.updateValueAndValidity();
          } 
          });

        }
      }
    }
  }

  public validarMonto(monto:any) {
    
    this.monto = monto;
    if(!this.esInsert){
    this.numPeriodo = this.myForm.value.numeroPeriodos;
    }
    
    if (this.monto != null && this.numPeriodo != null) {
      this.bancosPrd.getObtenerMontoPercepcion(this.monto, this.numPeriodo).subscribe(datos => {
        this.montoPercepcion = datos.datos;
        var monto = this.montoPercepcion.toFixed(4);
        this.myForm.controls.montoPorPeriodo.setValue(monto);
      });

    }
  }

  public validarNomMonto(tipomonto: any) {

    if (tipomonto == 2) {
      this.porcentual = false;
      this.fijo = true;
    } else {
      this.porcentual = true;
      this.fijo = false;
    }

  }

  public validarNumPeriodo(periodo:any) {
    
    this.numPeriodo = periodo;

    if(!this.esInsert){
      this.monto = this.myForm.value.montoPercepcion;
    }

    if (periodo < '1') {
      
      //this.myForm.controls.numeroPeriodos.setValue([]);
      this.myForm.controls.montoPorPeriodo.setValue('');

    }
    else if (this.monto != null && periodo != null && periodo >= '1') {
      this.bancosPrd.getObtenerMontoPercepcion(this.monto, this.numPeriodo).subscribe(datos => {
        this.montoPercepcion = datos.datos;
        var monto = this.montoPercepcion.toFixed(4);
        this.myForm.controls.montoPorPeriodo.setValue(monto);
      });

    }
  }




  public enviarPeticion() {
    this.submitEnviado = true;
    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;

    }
    let mensaje = this.esInsert ? "¿Deseas registrar la percepción" : "¿Deseas actualizar la percepción?";

    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {

      if (valor) {
        

        let obj = this.myForm.getRawValue();

        let split = obj.nomPercepcion.split("-");
        obj.nomPercepcion = split[0];
        if (obj.nomPercepcion !== undefined) {
          this.nomPercepcion = obj.nomPercepcion;
          if (this.conceptoPercepcionId == 0) {
            this.conceptoPercepcionId = split[1];
          }
        }

/*         let fechar = "";
        if (obj.fechaInicio != undefined || obj.fechaInicio != null) {

          if (obj.fechaInicio != "") {

            const fecha1 = new Date(obj.fechaInicio).toUTCString().replace("GMT", "");
            fechar = `${new Date(fecha1).getTime()}`;
          }
        } */

        if (this.esInsert) {

          if (this.politica !== undefined) {
            this.objEnviar = {
              tipoPercepcionId: {
                tipoPercepcionId: this.nomPercepcion
              },
              conceptoPercepcionId: {
                conceptoPercepcionId: this.conceptoPercepcionId
              },
              politicaId: {
                politicaId: this.politica
              },
              centrocClienteId: {
                centrocClienteId: this.empresa
              },
              valor: obj.porcentaje,
              baseCalculoId: {
                baseCalculoId: obj.baseCalculoId
              },
              esActivo: obj.esActivo,
              referencia: obj.referencia,
              fechaInicio: obj.fechaInicio,
              montoTotal: obj.montoPercepcion,
              numeroPeriodos: obj.numeroPeriodos,
              montoPorPeriodo: obj.montoPorPeriodo

            };
          } else {

            this.objEnviar = {
              tipoPercepcionId: {
                tipoPercepcionId: this.nomPercepcion
              },
              conceptoPercepcionId: {
                conceptoPercepcionId: this.conceptoPercepcionId
              },
              personaId: {
                personaId: this.empleado
              },
              centrocClienteId: {
                centrocClienteId: this.empresa
              },
              valor: obj.porcentaje,
              baseCalculoId: {
                baseCalculoId: obj.baseCalculoId
              },
              esActivo: obj.esActivo,
              referencia: obj.referencia,
              fechaInicio: obj.fechaInicio,
              montoTotal: obj.montoPercepcion,
              numeroPeriodos: obj.numeroPeriodos,
              montoPorPeriodo: obj.montoPorPeriodo

            };
          }

        } else {


          if (this.politica !== undefined) {
            this.objEnviar = {
              configuraPercepcionId: this.datos.configuraPercepcionId,
              tipoPercepcionId: {
                tipoPercepcionId: obj.nomPercepcion
              },
              conceptoPercepcionId: {
                conceptoPercepcionId: this.conceptoPercepcionId
              },
              politicaId: {
                politicaId: this.politica
              },
              centrocClienteId: {
                centrocClienteId: this.empresa
              },
              valor: obj.porcentaje,
              baseCalculoId: {
                baseCalculoId: obj.baseCalculoId
              },
              esActivo: obj.esActivo,
              referencia: obj.referencia,
              fechaInicio: obj.fechaInicio,
              montoTotal: obj.montoPercepcion,
              numeroPeriodos: obj.numeroPeriodos,
              montoPorPeriodo: obj.montoPorPeriodo

            };
          } else {

            this.objEnviar = {
              configuraPercepcionId: this.datos.configuraPercepcionId,
              tipoPercepcionId: {
                tipoPercepcionId: this.nomPercepcion
              },
              conceptoPercepcionId: {
                conceptoPercepcionId: this.conceptoPercepcionId
              },
              personaId: {
                personaId: this.empleado
              },
              centrocClienteId: {
                centrocClienteId: this.empresa
              },
              valor: obj.porcentaje,
              baseCalculoId: {
                baseCalculoId: obj.baseCalculoId
              },
              esActivo: obj.esActivo,
              referencia: obj.referencia,
              fechaInicio: obj.fechaInicio,
              montoTotal: obj.montoPercepcion,
              numeroPeriodos: obj.numeroPeriodos,
              montoPorPeriodo: obj.montoPorPeriodo

            };
          }

        }

        this.salida.emit({ type: "guardar", datos: this.objEnviar });
      }
    });
  }


  public get f() {
    return this.myForm.controls;
  }

}
