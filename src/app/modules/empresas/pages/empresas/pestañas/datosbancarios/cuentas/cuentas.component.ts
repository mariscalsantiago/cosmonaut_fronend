import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() datos: any;


  public mostrartooltip: boolean = false;
  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public id_empresa: number = 0;
  public esInsert: boolean = true;
  public cuenta: any;
  public cuentasBancarias: any;
  public objdsede: any = [];
  public peticion: any = [];
  public obj: any = [];
  public habcontinuarSede: boolean = false;
  public insertarMof: boolean = false;
  public funcionCuenta: any = [];


  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private cuentasPrd: CuentasbancariasService,
    private catalogosPrd: CatalogosService, private modalPrd: ModalService) { }

  ngOnInit(): void {

    this.datos.activarGuardaMod = true;
    this.objdsede = this.datos.idModificar;
    if (this.datos.insertar) {
      this.obj = {
        bancoId: { bancoId: 0 },
        funcionCuentaId: { funcionCuentaId: 0 }
      };
      this.myForm = this.createForm(this.obj);
    }
    else if (!this.datos.insertar && this.objdsede != undefined) {
      this.esInsert = false;
      this.objdsede = this.datos.idModificar;
      this.myForm = this.createForm(this.objdsede);

    } else {

      let obj: any = {};
      this.myForm = this.createForm(obj);

    }


    this.catalogosPrd.getCuentasBanco(true).subscribe(datos => {
      this.cuentasBancarias = datos.datos;
    });

    this.catalogosPrd.getFuncionCuenta(true).subscribe(datos => {
      this.funcionCuenta = datos.datos;
    });

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
      esActivo: [{ value: (this.esInsert) ? true : obj.esActivo, disabled: this.esInsert }, [Validators.required]]
    });

  }



  public enviarFormulario() {

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
        this.cuentasPrd.getListaCuentaBancaria(clabe).subscribe(datos => {

          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
            if (datos.resultado) {
              this.myForm.controls.idbanco.setValue(datos.datos.bancoId);
              this.myForm.controls.clabe.setValue(clabe);
            }
          });

        });

      }

    }

  }

  public activarCancel() {

    this.habcontinuarSede = true;
  }


  get f() {
    return this.myForm.controls;
  }

  guardar() {

    let obj = this.myForm.value;

    this.peticion = {
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
    if (this.datos.inserta) {
      this.cuentasPrd.save(this.peticion).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        
      });
    }
    else {
      this.peticion.cuentaBancoId = this.objdsede.cuentaBancoId;
      this.cuentasPrd.modificar(this.peticion).subscribe(datos => {
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      });
    }


  }


}
