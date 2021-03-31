import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { CuentasbancariasService } from '../../services/cuentasbancarias.service';

@Component({
  selector: 'app-detallecuentasbancarias',
  templateUrl: './detallecuentasbancarias.component.html',
  styleUrls: ['./detallecuentasbancarias.component.scss']
})
export class DetallecuentasbancariasComponent implements OnInit {
  @ViewChild("nombre") public nombre!: ElementRef;

  public mostrartooltip: boolean = false;
  public myForm!: FormGroup;
  public id_empresa: number = 0;
  public esInsert: boolean = false;
  public cuenta: any;
  public objCuenta: any = [];
  public cuentasBancarias: any;
  public submitInvalido: boolean = false;
  public peticion: any = [];

 
  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private cuentasPrd: CuentasbancariasService,
    private catalogosPrd: CatalogosService, private modalPrd: ModalService) { }

  ngOnInit(): void {
    debugger;
    this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];
      if (datos["tipoinsert"] == "nuevo") {
        this.esInsert = true;
      } else if (datos["tipoinsert"] == "editar") {
        this.esInsert = false;
      } else {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'cuentasbancarias']);
      }
    });


    this.objCuenta = { bancoId: { bancoId: 0 } };

    if (!this.esInsert) {//Solo cuando es modificar
      this.objCuenta = history.state.data;
      if (this.objCuenta == undefined) this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'cuentasbancarias']);

    }


    this.myForm = this.createForm(this.objCuenta);


    this.catalogosPrd.getCuentasBanco(true).subscribe(datos => {
      this.cuentasBancarias = datos.datos;
    });

  }

  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }
  public validarBanco(clabe:any){
    debugger;
    this.myForm.controls.idbanco.setValue("");
    this.myForm.controls.clabe.setValue("");

    if(this.myForm.controls.clabe.errors?.pattern === undefined ){


    if(clabe == '' || clabe == null || clabe == undefined){
 
      this.myForm.controls.idbanco.setValue("");
      this.myForm.controls.clabe.setValue("");
    }else{
    this.cuentasPrd.getListaCuentaBancaria(clabe).subscribe(datos => {
      if (datos.resultado) {
 
        this.myForm.controls.idbanco.setValue( datos.datos.bancoId);
        this.myForm.controls.clabe.setValue( clabe);

      }
      else{
     
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
      }
 
  });

    }
  
}

  }

  public createForm(obj: any) {



    return this.formBuild.group({

      numeroCuenta: [obj.numeroCuenta, [Validators.required]],
      nombreCuenta: [obj.nombreCuenta, [Validators.required]],
      idbanco: [obj.bancoId.bancoId, [Validators.required]],
      descripcion: [obj.descripcion],
      num_informacion: [obj.numInformacion],
      clabe: [obj.clabe, [Validators.required, Validators.pattern(/^\d{18}$/)]],
      num_sucursal: [obj.numSucursal],
      esActivo: [(!this.esInsert) ? obj.esActivo : { value: "true", disabled: true }]

    });

  }



  public enviarPeticion() {


    this.submitInvalido = true;
    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;

    }

    let titulo = this.esInsert ? "¿Deseas registrar la cuenta bancaria?" : "¿Deseas actualizar los datos de la cuenta bancaria?";


    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo)
      .then(valor => {
debugger;

        if (valor) {

          let obj = this.myForm.value;


          this.peticion = {
            numeroCuenta: obj.numeroCuenta,
            nombreCuenta: obj.nombreCuenta,
            descripcion: obj.descripcion,
            numInformacion: obj.num_informacion,
            clabe: obj.clabe,
            numSucursal: obj.num_sucursal,
            esActivo: obj.esActivo,
            nclCentrocCliente: {
              centrocClienteId: this.id_empresa
            },
            bancoId: {
              bancoId: obj.idbanco
            }
          };





          if (this.esInsert) {

            this.cuentasPrd.save(this.peticion).subscribe(datos => {

              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
                .then(() => {
                  if (datos.resultado) {
                    this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'cuentasbancarias']);
                  }
                });

            });
          } else {
            
            this.peticion.clabe = this.myForm.controls.clabe.value;
            this.peticion.cuentaBancoId = this.objCuenta.cuentaBancoId;
            this.cuentasPrd.modificar(this.peticion).subscribe(datos => {

              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
                .then(() => {
                  if (datos.resultado) {
                    this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'cuentasbancarias']);
                  }
                });

            });

          }

        }


      });


  }


  public cancelar() {
    this.routerPrd.navigate(['/empresa/detalle', this.id_empresa, 'cuentasbancarias']);
  }


  get f() {
    return this.myForm.controls;
  }


  
  


}
