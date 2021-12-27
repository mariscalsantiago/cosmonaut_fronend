import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';


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

  public grupoNominaSeleccionado: any = {
    pagoComplementario: false
  };

  public arreglogruponominas: any = [];
  public arregloCompensacion: any = [];


  public typeppp: boolean = false;

  @Input() public datos:any;
  @Output() salida = new EventEmitter<any>();

  constructor(private modalPrd:ModalService, private formBuild: FormBuilder, 
    private catalogosPrd: CatalogosService, private bancosPrd: CuentasbancariasService, private gruponominaPrd: GruponominasService) 
  { }

  ngOnInit(): void {
    debugger;



    if(this.datos.datoscuenta !== undefined){
    this.myForm = this.createForm(this.datos.datoscuenta);
    }else{
      let obj= {};
      this.myForm = this.createForm(obj);

    }

    this.cambiarSueldoField();

    this.gruponominaPrd.getAll(this.id_empresa).subscribe(datos => {
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
    //this.catalogosPrd.getAllMetodosPago(true).subscribe(datos => this.arregloMetodosPago = datos.datos);


  }


  public createForm(obj: any) {
    return this.formBuild.group({

      grupoNominaId: [obj.grupoNominaId?.grupoNominaId, [Validators.required]],
      tipoCompensacionId: [obj.tipoCompensacionId?.tipoCompensacionId, [Validators.required]],
      sueldoBrutoMensual: [obj.sueldoBrutoMensual, [Validators.required]],
      sueldoNetoMensual: obj.sueldoNetoMensual,
      salarioDiario: [{ value: obj.salarioDiario, disabled: true }, []],

    });

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

  public calcularsueldo() {

    if (!this.grupoNominaSeleccionado.pagoComplementario) {
      //this.cambiasueldobruto(this.f.tiposueldo.value == 'b');
    } else {
      //this.cambiassueldoPPP();
    }
  }

  

  public cambiarGrupoNomina(noRestablecer: boolean) {
    const gruponominaId = this.myForm.controls.grupoNominaId.value;


    let aux = this.pagoComplementario(gruponominaId);



    if (!noRestablecer) {
      this.limpiarMontos();

    }

    this.grupoNominaSeleccionado = aux;
    //this.grupoNominaSeleccionado.pagoComplementario = true;

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


  public enviarPeticion(){
    
    if (this.myForm.invalid) {
      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas guardar los datos?").then(valor => {
      if (valor) {
          
          let  obj = this.myForm.getRawValue();

            this.objEnviar = {
              numeroCuenta: obj.numeroCuenta,
              clabe: obj.clabe,
              bancoId: {
                bancoId: obj.csBanco
              },
              numInformacion: obj.numInformacion,
              ncoPersona: {
                personaId: this.datos.idEmpleado
              },
              nclCentrocCliente: {
                centrocClienteId: this.datos.idEmpresa
              },
              nombreCuenta: '  ',
              idMetodoPago: obj.idMetodoPago,
              cuentaBancoId: obj.cuentaBancoId

            };
          
          this.salida.emit({type:"guardar",datos:this.objEnviar});
        }
      });
  }

  public get f() {
    return this.myForm.controls;
  }

}
