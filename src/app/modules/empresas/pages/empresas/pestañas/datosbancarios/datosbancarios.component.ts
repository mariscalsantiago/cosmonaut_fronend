import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { CuentasbancariasService } from 'src/app/modules/empresas/services/cuentasbancarias/cuentasbancarias.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';


@Component({
  selector: 'app-datosbancarios',
  templateUrl: './datosbancarios.component.html',
  styleUrls: ['./datosbancarios.component.scss']
})
export class DatosbancariosComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() datos: any;


  public myForm!: FormGroup;

  public submitEnviado: boolean = false;
  public habcontinuar: boolean = false;
  public habGuardar: boolean = false;
  public actguardar: boolean = false;
  public id_empresa: number = 0;
  public listaCuentaNuevo: boolean = true;
  public listaCuentaModificar: boolean = false;
  public cargando: Boolean = false;
  public arregloListaCuenta: any = [];
  public obj: any = [];
  public objenviar: any = [];
  public insertarMof: boolean = false;
  public mostrarSTP: boolean = false;

  public verDetalleBanco: boolean = false;

  public cuentaSeleccionada:any;

  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public arreglotablaDesglose: any = {
    columnas: [],
    filas: []
  };

  constructor(private formBuilder: FormBuilder, private cuentasPrd: CuentasbancariasService,
    private routerPrd: Router, private modalPrd: ModalService) { }

  ngOnInit(): void {

    console.log("Esto es datos de empresa",this.datos);
    this.id_empresa = this.datos.empresa.centrocClienteId;

    this.cargando = true;
    this.cuentasPrd.getAllByEmpresa(this.id_empresa).subscribe(datos => {

      let columnas: Array<tabla> = [
        new tabla("nombreCuenta", "Nombre cuenta"),
        new tabla("numeroCuenta", "Número de cuenta"),
        new tabla("nombrebanco", "Nombre banco"),
        new tabla("clabe", "Cuenta CLABE"),
        new tabla("esActivo", "Estatus")
      ];



      if (datos.datos) {
        datos.datos.forEach((part: any) => {
          part.nombrebanco = part.bancoId?.nombreCorto;
        });
      }


      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = datos.datos;
      this.cargando = false;

    });
    this.myForm = this.createForm(this.obj);

  }

  public createForm(obj: any) {
    if (!this.datos.insertar && obj.usaStp) {
      this.activar();
      obj.usaStp = true;

    }
    return this.formBuilder.group({
      usaStp: obj.usaStp,
      cuentaStp: [obj.cuentaStp, [Validators.required, Validators.pattern('[0-9]+')]],
      clabeStp: [obj.clabeStp, [Validators.required, Validators.pattern(/^\d{18}$/)]],

    });

  }


  public cancelar() {
    this.routerPrd.navigate(['/listaempresas']);
  }

  public activar() {

    if (!this.actguardar) {
      this.habGuardar = true;
      this.actguardar = true;
    } else {
      this.habGuardar = false;
      this.actguardar = false;
    }
  }

  public continuar() {
    this.enviado.emit({type:'datosbancarios'});
  }

  public recibirTabla(obj: any) {
    switch (obj.type) {
      case "editar":
        this.verdetalle(obj.datos);
        break;
      case "desglosar":
        let item = obj.datos;
        this.cuentasPrd.getAllByEmpresa(this.id_empresa).subscribe(datos => {
          let temp = datos.datos;
          if (temp) {
            for (let llave in temp) {
              item[llave] = temp[llave];
            }
          }
          let columnas: Array<tabla> = [
            new tabla("descripcion", "Descripcion"),
            new tabla("funcionCuenta", "Función de la cuenta "),
            new tabla("numInformacion", "Número de información"),
            new tabla("numSucursal", "Número de sucursal")
          ];
          item.funcionCuenta = item.funcionCuentaId?.descripcion;
          this.arreglotablaDesglose.columnas = columnas;
          this.arreglotablaDesglose.filas = item;
          item.cargandoDetalle = false;
        });

        break;

    }
  }

  public enviarFormulario() {

    this.submitEnviado = true;

    if (!this.habcontinuar) {
      if (this.myForm.invalid) {
        this.modalPrd.showMessageDialog(this.modalPrd.error);
        return;
      }

      this.modalPrd.showMessageDialog(this.modalPrd.warning, '¿Deseas guardar los cambios?').then(valor => {
        if (valor) {
          this.guardar();
        }
      });;

    } else {
      this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas continuar?").then(valor => {
        if (valor) {
          this.enviado.emit({
            type: "bancosCont"
          });
        }
      });
    }
  }

  public verdetalle(obj: any) {
    this.cuentaSeleccionada = obj;
    this.verDetalleBanco = true;
  }

  public get f() {
    return this.myForm.controls;
  }


  public guardar() {

    let obj = this.myForm.value;

    if (!this.datos.insertar && this.obj.cuentaBancoId == undefined) {
      this.insertarMof = true;
    }

    this.objenviar =
    {

      usaStp: true,
      cuentaStp: obj.cuentaStp,
      clabeStp: obj.clabeStp,
      nclCentrocCliente: {
        centrocClienteId: this.datos.empresa.centrocClienteId
      }

    }

    if (this.datos.insertar) {
      this.cuentasPrd.save(this.objenviar).subscribe(datos => {

        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {

          if (datos.resultado) {
            if (this.insertarMof) {
              this.mostrarSTP = true;
              this.enviado.emit({
                type: "cuentasBancarias"
              });
            } else {
              this.enviado.emit({
                type: "cuentasBancarias"
              });

              this.mostrarSTP = true;

              this.habcontinuar = true;
              this.habGuardar = false;
            }
          }
        });
      });
    } else {
      this.objenviar.cuentaBancoId = this.obj.cuentaBancoId;
      this.cuentasPrd.modificar(this.objenviar).subscribe(datos => {

        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
          if (datos.resultado) {
            this.mostrarSTP = true;
            this.enviado.emit({
              type: "cuentasBancarias"
            });
            this.habcontinuar = true;
            this.habGuardar = false;
          }
        });
      });
    }
  }

  public salidaCuentasBancariasDetalle(obj:any){
    console.log("Detalle cuenta bancaria",obj);
    this.verDetalleBanco = false;
    switch(obj.type){
        case 'guardar':
            this.ngOnInit();
          break;
    }
  }

}
