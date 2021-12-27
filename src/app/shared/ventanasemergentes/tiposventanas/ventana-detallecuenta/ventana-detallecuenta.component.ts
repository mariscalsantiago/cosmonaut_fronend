import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';


@Component({
  selector: 'app-ventana-detallecuenta',
  templateUrl: './ventana-detallecuenta.component.html',
  styleUrls: ['./ventana-detallecuenta.component.scss']
})
export class VentanaDetalleCuentaComponent implements OnInit {

  public myForm!: FormGroup;
  public nomDocumento: boolean = false;
  public objEnviar: any = [];
  public arregloMetodosPago: any = [];
  public arreglobancos: any = [];
  public metodoPago: boolean = false;

  @Input() public datos:any;
  @Output() salida = new EventEmitter<any>();

  constructor(private modalPrd:ModalService, private formBuild: FormBuilder, 
    private catalogosPrd: CatalogosService, private bancosPrd: CuentasbancariasService) 
  { }

  ngOnInit(): void {
    debugger;

    this.catalogosPrd.getAllMetodosPago(true).subscribe(datos => this.arregloMetodosPago = datos.datos);
    this.catalogosPrd.getCuentasBanco(true).subscribe(datos => this.arreglobancos = datos.datos);

    if(this.datos.datoscuenta !== undefined){
    this.myForm = this.createForm(this.datos.datoscuenta);
    }else{
      let obj= {};
      this.myForm = this.createForm(obj);

    }

    this.validarTipoPago(this.datos.metodoPagoId);

  }


  public createForm(obj: any) {
    return this.formBuild.group({

      idMetodoPago: [this.datos.metodoPagoId],
      numeroCuenta: [obj.numeroCuenta],
      clabe: [obj.clabe],
      csBanco: [obj.bancoId?.bancoId],
      numInformacion: obj.numInformacion,
      cuentaBancoId: obj.cuentaBancoId

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

  public validarTipoPago(idPago:any){
    debugger;
    if(Number(idPago) === 4){
      this.metodoPago = true;
      this.myForm.controls.clabe.setValidators([Validators.required]);
      this.myForm.controls.clabe.updateValueAndValidity();
      this.myForm.controls.csBanco.setValidators([Validators.required]);
      this.myForm.controls.csBanco.updateValueAndValidity();
      this.myForm.controls.numeroCuenta.setValidators([Validators.required]);
      this.myForm.controls.numeroCuenta.updateValueAndValidity();
    }else{
      this.metodoPago = false;
      this.myForm.controls.clabe.setValidators([]);
      this.myForm.controls.clabe.updateValueAndValidity();
      this.myForm.controls.csBanco.setValidators([]);
      this.myForm.controls.csBanco.updateValueAndValidity();
      this.myForm.controls.numeroCuenta.setValidators([]);
      this.myForm.controls.numeroCuenta.updateValueAndValidity();
    }

  }

  public validarTipoPagoSelct(idPago:any){
    debugger;
    if(Number(idPago) === 4){
      this.metodoPago = true;
      
      this.myForm.controls.clabe.setValue('');
      this.myForm.controls.numeroCuenta.setValue('');
      this.myForm.controls.csBanco.setValue('');
      this.myForm.controls.numInformacion.setValue('');
      this.myForm.controls.clabe.setValidators([Validators.required]);
      this.myForm.controls.clabe.updateValueAndValidity();
      this.myForm.controls.csBanco.setValidators([Validators.required]);
      this.myForm.controls.csBanco.updateValueAndValidity();
      this.myForm.controls.numeroCuenta.setValidators([Validators.required]);
      this.myForm.controls.numeroCuenta.updateValueAndValidity();
    }else{
      this.metodoPago = false;
      this.myForm.controls.clabe.setValidators([]);
      this.myForm.controls.clabe.updateValueAndValidity();
      this.myForm.controls.csBanco.setValidators([]);
      this.myForm.controls.csBanco.updateValueAndValidity();
      this.myForm.controls.numeroCuenta.setValidators([]);
      this.myForm.controls.numeroCuenta.updateValueAndValidity();
    }

  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
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
