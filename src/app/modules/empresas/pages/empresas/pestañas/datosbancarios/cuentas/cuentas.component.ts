import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';

@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {


  public mostrartooltip: boolean = false;
  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public id_empresa: number = 0;
  public esInsert: boolean = false;
  public cuenta: any;
  public cuentasBancarias: any;
  public objdsede: any = []; 
 


  @Input() enviarPeticion: any;
 

  public alerta = {

    modal: false,
    strTitulo: "",
    iconType: "",
    strsubtitulo: ""
  };

  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private cuentasPrd: CuentasbancariasService,
    private catalogosPrd:CatalogosService) { }

  ngOnInit(): void {
 
    /*this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];
      if (datos["tipoinsert"] == "nuevo") {
        this.esInsert = true;
      } else if (datos["tipoinsert"] == "editar") {
        this.esInsert = false;
      } else {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'cuentasbancarias']);
      }
    });*/

    this.objdsede = history.state.data == undefined ? {} : history.state.data ;
    this.esInsert = this.objdsede.insertar;
    let obj = { csBanco: { bancoId: 0 } };

    /*if (!this.esInsert) {//Solo cuando es modificar
      obj = history.state.data;
      if (obj == undefined) this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'cuentasbancarias']);

    }*/


    this.myForm = this.createForm(obj);


    this.catalogosPrd.getCuentasBanco().subscribe(datos => {
      this.cuentasBancarias = datos.datos;
    });

  }

  public createForm(obj: any) {

   return this.formBuild.group({

      numeroCuenta: [obj.numeroCuenta, [Validators.required]],
      nombreCuenta: [obj.nombreCuenta, [Validators.required]],
      idbanco: [obj.csBanco.bancoId, [Validators.required]],
      descripcion: [obj.descripcion],
      num_informacion: [obj.numInformacion],
      clabe: [obj.clabe, [Validators.required, Validators.pattern(/^\d{18}$/)]],
      num_sucursal: [obj.numSucursal]

    });

  }



  public enviarFormulario() {
    
    this.submitEnviado = true;
    if (!this.myForm.valid) {

      this.alerta.strTitulo = "Campos inválidos, Favor de verificar";
      this.alerta.strsubtitulo = "Algunos campos son incorrectos.";
      this.alerta.iconType = "error";
      this.alerta.modal = true;
      return;
    }

    this.alerta.iconType = "warning";
    this.alerta.strTitulo = (this.esInsert) ? "¿Deseas registrar la cuenta bancaria?" : "¿Deseas actualizar la cuenta bancaria?";
    this.alerta.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
    this.alerta.modal = true;


  }


  public cancelar() {
    this.routerPrd.navigate(["/listaempresas/empresas/nuevo"]);
  }


  get f() {
    return this.myForm.controls;
  }


  public recibir($event: any) {

   
    this.alerta.modal = false;


    if (this.alerta.iconType == "warning") {


      if ($event) {

        let obj = this.myForm.value;


        let peticion: any = {
          numeroCuenta: obj.numeroCuenta,
          nombreCuenta: obj.nombreCuenta,
          descripcion: obj.descripcion,
          numInformacion: obj.num_informacion,
          clabe: obj.clabe,
          numSucursal: obj.num_sucursal,
          nclCentrocCliente: {
            centrocClienteId: this.objdsede.centrocClienteId
          },
          bancoId: {
            bancoId: obj.idbanco
          }
        };

        if (this.esInsert) {

          this.cuentasPrd.save(peticion).subscribe(datos => {

            this.alerta.iconType = datos.resultado ? "success" : "error";

            this.alerta.strTitulo = datos.mensaje;
            this.alerta.strsubtitulo = datos.mensaje
            this.alerta.modal = true;


          });
        } else {

          /*this.cuentasPrd.modificar(peticion).subscribe(datos => {

            this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.strsubtitulo = datos.mensaje
            this.modal = true;

          });*/

        }

      }


    } else {
      this.alerta.modal = false;

      if (this.alerta.iconType == "success") {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'cuentasbancarias']);
      }
    }

  }


}
