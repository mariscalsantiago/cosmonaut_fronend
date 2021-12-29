import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { CalculosService } from 'src/app/shared/services/nominas/calculos.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-ventana-detallecompesacion',
  templateUrl: './ventana-detallecompesacion.component.html',
  styleUrls: ['./ventana-detallecompesacion.component.scss']
})
export class VentanaDetalleCompensacionComponent implements OnInit {

  public myForm!: FormGroup;
  public nomDocumento: boolean = false;
  public objEnviar: any = [];
  public sueldoBruto: boolean = false;
  public sueldoNeto: boolean = false;
  public esTransferencia: boolean = true; 
  public id_empresa!: number;
  public recalcular: boolean = false;

  public grupoNominaSeleccionado: any = {
    pagoComplementario: false
  };

  public arreglogruponominas: any = [];
  public arregloCompensacion: any = [];


  public typeppp: boolean = false;

  @Input() public datos:any;
  @Output() salida = new EventEmitter<any>();

  constructor(private modalPrd:ModalService, private formBuild: FormBuilder, 
    private catalogosPrd: CatalogosService, private bancosPrd: CuentasbancariasService, 
    private gruponominaPrd: GruponominasService, private calculoPrd: CalculosService) 
  { }

  ngOnInit(): void {
    debugger;

    this.typeppp = this.datos.typeppp;
    this.gruponominaPrd.getAll(this.datos.idEmpresa).subscribe(datos => {
      this.arreglogruponominas = datos.datos;
      this.cambiarGrupoNomina(true);

      if (this.typeppp) {
        //this.myForm.controls.sueldonetomensualppp.setValue(this.tabsDatos[3].pppSnm || 0);
        //this.myForm.controls.salarioDiarioIntegrado.setValue(this.tabsDatos[3].sbc);
        //this.myForm.controls.salarioNetoMensualImss.setValue(this.tabsDatos[3].sueldoNetoMensual);
        //this.myForm.controls.pagoComplementario.setValue(this.tabsDatos[3].pppMontoComplementario);

      }
    });
    this.catalogosPrd.getCompensacion(true).subscribe(datos => this.arregloCompensacion = datos.datos);
    

    if(this.datos.datoscompensacion !== undefined){
      this.myForm = this.createForm(this.datos.datoscompensacion);
      }else{
        let obj= {};
        this.myForm = this.createForm(obj);
  
      }

      this.cambiarSueldoField();

  }


  public createForm(obj: any) {
    return this.formBuild.group({

      grupoNominaId: [obj.grupoNominaId?.grupoNominaId, [Validators.required]],
      tipoCompensacionId: [obj.tipoCompensacionId?.tipoCompensacionId, [Validators.required]],
      sueldoBrutoMensual: [obj.sueldoBrutoMensual, [Validators.required]],
      sueldoNetoMensual: obj.sueldoNetoMensual,
      salarioDiario: [{ value: obj.salarioDiario, disabled: true }, []],
      tiposueldo: ['b', [Validators.required]],
      sbc: [{ value: obj.sbc, disabled: true }],
      salarioDiarioIntegrado: [obj.salarioDiarioIntegrado, []],
      salarioNetoMensualImss: [obj.salarioNetoMensualImss],
      pagoComplementario: [obj.pagoComplementario],
      sueldonetomensualppp: [obj.pppSnm],
      sueldoBrutoMensualPPP: [{ value: obj.pppSalarioBaseMensual, disabled: true }]

    });

  }

  public calcularSueldoNew() {
    debugger;
    if (!this.grupoNominaSeleccionado.pagoComplementario) {
      this.cambiasueldobruto(this.f.tiposueldo.value == 'b');
    } else {
      this.cambiassueldoPPP();
    }

  }

  public validarBanco(clabe: any) {
    

    this.myForm.controls.csBanco.setValue("");
    if (this.myForm.controls.clabe.errors?.pattern === undefined) {


      if (clabe == '' || clabe == null || clabe == undefined) {

        this.myForm.controls.csBanco.setValue("");
        this.myForm.controls.clabe.setValue("");
      } else {
        if(clabe.length == 18){
          this.bancosPrd.getListaCuentaBancaria(clabe).subscribe(datos => {
            if (datos.resultado) {
              this.myForm.controls.csBanco.setValue( datos.datos.bancoId);
              this.myForm.controls.clabe.setValue(clabe);
              this.myForm.controls.numeroCuenta.setValue(datos.datos.numeroCuenta);
            }
            else {
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
            }
          });
        }else{
          this.modalPrd.showMessageDialog(this.modalPrd.error, "La cuenta clabe debe ser a 18 dijitos");
          this.myForm.controls.csBanco.setValue("");
          this.myForm.controls.numeroCuenta.setValue("");
        }  
      }

    }

  }



  public cambiasueldobruto(esBruto: boolean) {

    if (this.verificaCambiosNecesarios()) return;
    if (this.grupoNominaSeleccionado.pagoComplementario) {
      if (this.myForm.controls.salarioDiario.invalid) {

        this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe ingresar el salario diario");
        return;
      }
    } else {
      if (this.myForm.controls.sueldoBrutoMensual.invalid) {
        this.modalPrd.showMessageDialog(this.modalPrd.error, "Falta sueldo bruto mensual");
        return;
      }
    }

    let objenviar = {
      clienteId: this.datos.idEmpresa,
      politicaId: this.datos.datoscompensacion.politicaId?.politicaId,
      grupoNomina: this.myForm.controls.grupoNominaId.value,
      tipoCompensacion: this.myForm.controls.tipoCompensacionId.value,
      sbmImss: this.myForm.controls.sueldoBrutoMensual.value,
      fechaAntiguedad: this.datos.datoscompensacion.fechaAntiguedad,
      fecIniPeriodo: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd")
    }

    this.modalPrd.showMessageDialog(this.modalPrd.loading, "Calculando");


    if (esBruto) {
      this.calculoPrd.calculoSueldoBruto(objenviar).subscribe(datos => {


        let aux = datos.datos;
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        if (datos.datos) {


          this.myForm.controls.salarioDiario.setValue(aux.salarioDiario);
          this.myForm.controls.sbc.setValue(aux.salarioBaseDeCotizacion);
          this.myForm.controls.sueldoNetoMensual.setValue(aux.salarioNetoMensual);
          this.recalcular = false;
        } else {
          this.modalPrd.showMessageDialog(this.modalPrd.error, datos.mensaje);
          return;
        }
      });
    } else {

      let objenviarMensual = {
        centroClienteId: this.datos.idEmpresa,
        politicaId: this.f.politicaId.value,
        grupoNominaId: this.f.grupoNominaId.value,
        periodicidadId: "05",
        sueldoNeto: this.f.sueldoNetoMensual.value,
        fechaAntiguedad: this.f.fechaAntiguedad.value,
        fechaInicio: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd")
      };
      this.calculoPrd.calculoSueldoNetoabruto(objenviarMensual).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        let aux = datos.datos;
        if (datos.resultado) {
          if (datos.datos !== undefined) {
            this.myForm.controls.salarioDiario.setValue(aux.salarioDiario);
            this.myForm.controls.sbc.setValue(aux.salarioBaseDeCotizacion);
            this.myForm.controls.sueldoBrutoMensual.setValue(aux.salarioBrutoMensual);
            this.recalcular = false;
          }
        } else {
          this.modalPrd.showMessageDialog(this.modalPrd.error, datos.mensaje);
          return;
        }
      });
    }

  }

  public cambiassueldoPPP() {

    if (this.myForm.controls.salarioDiario.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe ingresar el salario diario");
      return;
    }

    if (this.myForm.controls.sueldonetomensualppp.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe ingresar el sueldo neto mensual mixto");
      return;
    }


    let objenviar: any = {
      clienteId: this.datos.idEmpresa,
      politicaId: this.datos.datoscompensacion.politicaId?.politicaId,
      grupoNomina: this.myForm.controls.grupoNominaId.value,
      tipoCompensacion: this.myForm.controls.tipoCompensacionId.value,
      pagoNeto: this.myForm.controls.sueldonetomensualppp.value,
      fechaAntiguedad: this.datos.datoscompensacion.fechaAntiguedad,
      fechaContrato: new DatePipe("es-MX").transform(new Date(), "yyyy-MM-dd"),
      sdImss: this.myForm.controls.salarioDiario.value
    }



    //*************calculo PPP *******************+ */

    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    this.calculoPrd.calculoSueldoNetoPPP(objenviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      let aux = datos.datos;
      this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
      if (datos.datos !== undefined) {

        this.myForm.controls.salarioDiarioIntegrado.setValue(aux.sbc);
        this.myForm.controls.salarioNetoMensualImss.setValue(aux.sueldoNetoMensual);
        this.myForm.controls.sueldoNetoMensual.setValue(aux.sueldoNetoMensual);
        this.myForm.controls.sueldoBrutoMensual.setValue(aux.sueldoBrutoMensual);
        this.myForm.controls.pagoComplementario.setValue(aux.pppMontoComplementario);
        this.myForm.controls.sueldoBrutoMensualPPP.setValue(aux.pppSbm);
        this.recalcular = false;



      }
    });

  }

  public verificaCambiosNecesarios(): boolean {
    let variable: boolean = false;


    if (this.myForm.controls.grupoNominaId.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar un grupo de  nómina");
      variable = true;
    }
    if (this.myForm.controls.tipoCompensacionId.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe seleccionar la compensación");
      variable = true;
    }
    return variable;
  }

  

  public cambiarGrupoNomina(noRestablecer: boolean) {
    debugger;
    const gruponominaId = this.myForm.controls.grupoNominaId.value;
    let aux = this.pagoComplementario(gruponominaId);
    if (!noRestablecer) {
      this.limpiarMontos();

    }

    this.grupoNominaSeleccionado = aux;

    if (this.grupoNominaSeleccionado.pagoComplementario) {

      this.myForm.controls.sueldonetomensualppp.setValidators([Validators.required]);
      this.myForm.controls.sueldonetomensualppp.updateValueAndValidity();

      this.typeppp = true;
      this.myForm.controls.salarioNetoMensualImss.disable();
      this.myForm.controls.pagoComplementario.disable();
      this.myForm.controls.tiposueldo.disable();
      this.myForm.controls.tiposueldo.setValue('n');


      this.myForm.controls.tipoCompensacionId.setValue(2);


      this.myForm.controls.salarioDiario.enable();

      this.myForm.controls.salarioDiario.setValidators([Validators.required]);
      this.myForm.controls.salarioDiario.updateValueAndValidity();
      this.myForm.controls.salarioDiarioIntegrado.setValidators([Validators.required]);
      this.myForm.controls.salarioDiarioIntegrado.updateValueAndValidity();
      this.myForm.controls.salarioDiarioIntegrado.disable();

      this.cambiarSueldoField();
    } else {


      this.myForm.controls.sueldonetomensualppp.clearValidators();
      this.myForm.controls.sueldonetomensualppp.updateValueAndValidity();
      this.typeppp = false;
      this.myForm.controls.salarioDiario.setValidators([]);
      this.myForm.controls.salarioDiario.updateValueAndValidity();
      this.myForm.controls.salarioDiarioIntegrado.setValidators([]);
      this.myForm.controls.salarioDiarioIntegrado.updateValueAndValidity();


      this.myForm.controls.tiposueldo.enable();
      this.myForm.controls.salarioDiario.disable();

    }



  }

  public limpiarMontos() {
    debugger;
    this.myForm.controls.tipoCompensacionId.setValue("");
    this.myForm.controls.tiposueldo.setValue("b");
    this.myForm.controls.sueldoNetoMensual.setValue("");
    this.myForm.controls.sueldoBrutoMensual.setValue("");
    this.myForm.controls.sueldonetomensualppp.setValue("");
    this.myForm.controls.salarioDiario.setValue("");
    this.myForm.controls.salarioDiarioIntegrado.setValue("");
    this.myForm.controls.sbc.setValue("");
    this.myForm.controls.salarioNetoMensualImss.setValue("");
    this.myForm.controls.pagoComplementario.setValue("");
    this.myForm.controls.sueldoBrutoMensualPPP.setValue("");

    this.cambiarSueldoField();

  }

  public pagoComplementario(gruponominaId: number) {
    debugger;
    let aux;
    for (let item of this.arreglogruponominas) {
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


  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }
  

  public cambiarSueldoField() {

    this.sueldoBruto = this.myForm.controls.tiposueldo.value == 'b';
    this.sueldoNeto = this.myForm.controls.tiposueldo.value == 'n';

    this.myForm.controls.sueldoNetoMensual.setValidators([]);
    this.myForm.controls.sueldoNetoMensual.updateValueAndValidity();
    this.myForm.controls.sueldoBrutoMensual.setValidators([]);
    this.myForm.controls.sueldoBrutoMensual.updateValueAndValidity();

    if (this.sueldoNeto) {

      this.myForm.controls.sueldoNetoMensual.setValidators([Validators.required]);
      this.myForm.controls.sueldoNetoMensual.updateValueAndValidity();


    }

    if (this.sueldoBruto) {
      this.myForm.controls.sueldoBrutoMensual.setValidators([Validators.required]);
      this.myForm.controls.sueldoBrutoMensual.updateValueAndValidity();
    }


  }
  public cambiarSueldoFieldEdit() {

    this.sueldoBruto = this.myForm.controls.tiposueldo.value == 'b';
    this.sueldoNeto = this.myForm.controls.tiposueldo.value == 'n';

    this.myForm.controls.sueldoNetoMensual.setValidators([]);
    this.myForm.controls.sueldoNetoMensual.updateValueAndValidity();
    this.myForm.controls.sueldoBrutoMensual.setValidators([]);
    this.myForm.controls.sueldoBrutoMensual.updateValueAndValidity();

    if (this.sueldoNeto) {

      this.myForm.controls.sbc.setValue('');
      this.myForm.controls.salarioDiario.setValue('');
      this.myForm.controls.sueldoBrutoMensualPPP.setValue('');
      this.myForm.controls.sueldoBrutoMensual.setValue('');

      this.myForm.controls.sueldoNetoMensual.setValidators([Validators.required]);
      this.myForm.controls.sueldoNetoMensual.updateValueAndValidity();


    }

    if (this.sueldoBruto) {

      this.myForm.controls.sbc.setValue('');
      this.myForm.controls.salarioDiario.setValue('');
      this.myForm.controls.sueldoBrutoMensualPPP.setValue('');
      this.myForm.controls.sueldoNetoMensual.setValue('');
      this.myForm.controls.sueldoBrutoMensual.setValidators([Validators.required]);
      this.myForm.controls.sueldoBrutoMensual.updateValueAndValidity();
    }


  }




  public enviarPeticion(){
    debugger;
    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }

    if (this.recalcular) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "Se debe calcular de nuevo el sueldo");
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas actualizar los datos del usuario?").then(valor => {
      if (valor) {
        const obj = this.myForm.getRawValue();
        this.objEnviar = {
          ...this.datos.datoscompensacion,
          grupoNominaId: { grupoNominaId: obj.grupoNominaId },
          tipoCompensacionId: { tipoCompensacionId: obj.tipoCompensacionId },
          sbc: obj.sbc,
          sueldoNetoMensual: obj.sueldoNetoMensual,
          sueldoBrutoMensual: obj.sueldoBrutoMensual,
          salarioDiario: obj.salarioDiario,
    
        }
        if (this.grupoNominaSeleccionado.pagoComplementario) {
          this.objEnviar.sueldoNetoMensual = obj.salarioNetoMensualImss; //Pago imss
          delete obj.salarioNetoMensualImss;
          this.objEnviar.pppMontoComplementario = obj.pagoComplementario; //Pago complementario
          this.objEnviar.sbc = obj.salarioDiarioIntegrado; //Sañario integrado
          delete obj.salarioDiarioIntegrado;
          this.objEnviar.pppSalarioBaseMensual = obj.sueldoBrutoMensualPPP;//sueldo menusal ppp
          this.objEnviar.pppSnm = obj.sueldonetomensualppp;
        }
    
        this.salida.emit({type:"guardar",datos:this.objEnviar});
      }
    });


  }

  public suscribirseCompensacion() {
    this.cambiarSueldoField();

    this.myForm.controls.sueldoBrutoMensual.valueChanges.subscribe(valor => {
      if (this.myForm.controls.tiposueldo.value == 'b') {
        this.recalcular = true;
      }
    })
    this.myForm.controls.sueldoNetoMensual.valueChanges.subscribe(valor => {
      if (this.myForm.controls.tiposueldo.value == 'n') {
        this.recalcular = true;
      }
    })

    this.myForm.controls.sueldonetomensualppp.valueChanges.subscribe(valor =>{
      if(this.myForm && this.typeppp){
        this.recalcular = true;
      }
    });

  }

  public get f() {
    return this.myForm.controls;
  }

}
