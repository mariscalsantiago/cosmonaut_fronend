import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {

  @Output() emitirEnviado = new EventEmitter();
  @Input() datos: any;
  @Input() cuenta:any;
  mostrartooltip = false;

  public arregloBancos:any = [];
  public arregloCuentas:any = [];
  public myForm!:FormGroup;
  public submitEnviado:boolean = false;

  constructor(private formBuild: FormBuilder, private routerPrd: Router,private cuentasPrd: CuentasbancariasService,
    private catalogosPrd: CatalogosService, private modalPrd: ModalService) { }

  ngOnInit(): void {
    
    this.myForm =  this.createForm(this.cuenta || {});
    if(this.cuenta?.cuentaBancoId){
        this.myForm.controls.esActivo.enable();
    }
    this.catalogosPrd.getCuentasBanco(true).subscribe(datos => this.arregloBancos = datos.datos);
    this.catalogosPrd.getFuncionCuenta(true).subscribe(datos => this.arregloCuentas = datos.datos);

  }

  public createForm(obj: any) {
    
    

    return this.formBuild.group({

      numeroCuenta: [obj.numeroCuenta, [Validators.required]],
      nombreCuenta: [obj.nombreCuenta, [Validators.required]],
      idbanco: [obj.bancoId?.bancoId, [Validators.required]],
      funcionCuentaId: [obj.funcionCuentaId?.funcionCuentaId, [Validators.required]],
      descripcion: [obj.descripcion],
      num_informacion: [obj.numInformacion],
      clabe: [obj.clabe, [Validators.required, Validators.pattern(/^\d{18}$/)]],
      num_sucursal: [obj.numSucursal],
      esActivo: [{ value:  obj.esActivo == undefined ? true:obj.esActivo , disabled: Boolean(obj) }, [Validators.required]]
    });

  }



  public enviarFormulario() {
    this.submitEnviado = true;

    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    let titulo = "¿Deseas guardar los datos?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {

        this.guardar();

      }
    });

  }

  public validarBanco(clabe: any) {

    this.myForm.controls.idbanco.setValue("");
    this.myForm.controls.clabe.setValue("");

    if (this.myForm.controls.clabe.errors?.pattern === undefined) {
      if (!Boolean(clabe)) {
        this.myForm.controls.idbanco.setValue("");
        this.myForm.controls.clabe.setValue("");
      } else {
        if(clabe.length == 18){
          this.cuentasPrd.getListaCuentaBancaria(clabe).subscribe(datos => {
            
            this.myForm.controls.idbanco.setValue( datos.datos.bancoId);
            this.myForm.controls.clabe.setValue(clabe);
            this.myForm.controls.numeroCuenta.setValue(datos.datos.numeroCuenta);
            this.myForm.controls.num_sucursal.setValue(datos.datos.sucursal);

          });
        }else{
          this.myForm.controls.clabe.setValue("");
          this.myForm.controls.idbanco.setValue("");
          this.myForm.controls.numeroCuenta.setValue("");
          this.myForm.controls.num_sucursal.setValue("");
        }  

      }

    }

  }

  public cancelar() {
    
      this.emitirEnviado.emit({type:'cancelar'});
  }


  get f() {
    return this.myForm.controls;
  }

  guardar() {
    let obj = this.myForm.value;
    let objEnviar:any = {
      numeroCuenta: obj.numeroCuenta,
      nombreCuenta: obj.nombreCuenta,
      descripcion: obj.descripcion,
      numInformacion: obj.num_informacion,
      clabe: obj.clabe,
      numSucursal: obj.num_sucursal,
      funcionCuentaId: { funcionCuentaId: obj.funcionCuentaId },
      esActivo: obj.esActivo,
      nclCentrocCliente: {
        centrocClienteId: this.datos.empresa.centrocClienteId
      },
      bancoId: {
        bancoId: obj.idbanco
      }
    };
    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    if (!Boolean(this.cuenta?.cuentaBancoId)) {
      this.cuentasPrd.save(objEnviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        this.emitirEnviado.emit({type:'guardar'});
      });
    }
    else {
      objEnviar.cuentaBancoId = this.cuenta.cuentaBancoId;
      
      this.cuentasPrd.modificar(objEnviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        this.emitirEnviado.emit({type:'guardar'});
      });
    }
  }
  activarCancel(){
    this.mostrartooltip = false;
  }
}
