import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from '../../services/cuentasbancarias.service';

@Component({
  selector: 'app-detallecuentasbancarias',
  templateUrl: './detallecuentasbancarias.component.html',
  styleUrls: ['./detallecuentasbancarias.component.scss']
})
export class DetallecuentasbancariasComponent implements OnInit {
  @ViewChild("nombre") public nombre!:ElementRef;

  public mostrartooltip: boolean = false;
  public iconType: string = "";
  public myForm!: FormGroup;
  public modal: boolean = false;
  public strTitulo: string = "";
  public id_empresa: number = 0;
  public esInsert: boolean = false;
  public cuenta: any;
  public cuentasBancarias: any;
  public submitInvalido: boolean = false;
  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private cuentasPrd: CuentasbancariasService,
    private catalogosPrd: CatalogosService) { }

  ngOnInit(): void {

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


    let obj = { bancoId: { bancoId: 0 } };

    if (!this.esInsert) {//Solo cuando es modificar
      obj = history.state.data;
      if (obj == undefined) this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'cuentasbancarias']);

    }


    this.myForm = this.createForm(obj);


    this.catalogosPrd.getCuentasBanco().subscribe(datos => {
      this.cuentasBancarias = datos.datos;
    });

  }

  ngAfterViewInit(): void{

    this.nombre.nativeElement.focus();

  }

  public createForm(obj: any) {



    return this.formBuild.group({

      numeroCuenta: [obj.numeroCuenta, [Validators.required]],
      nombreCuenta: [obj.nombreCuenta, [Validators.required]],
      idbanco: [obj.bancoId.bancoId, [Validators.required]],
      descripcion: [obj.descripcion],
      num_informacion: [obj.numInformacion],
      clabe: [{value:obj.clabe,disabled:!this.esInsert}, [Validators.required, Validators.pattern(/^\d{18}$/)]],
      num_sucursal: [obj.numSucursal],
      esActivo:[(!this.esInsert)?obj.esActivo:{value:"true",disabled:true}]

    });

  }



  public enviarPeticion() {




    this.submitInvalido = true;
    if (this.myForm.invalid) {
      this.iconType = "error";
      this.strTitulo = "Campos obligatorios o inválidos";
      this.modal = true;
      return;

    }



    this.iconType = "warning";
    this.strTitulo = (this.esInsert) ? "¿Deseas registrar la cuenta bancaria?" : "¿Deseas actualizar los datos de la cuenta bancaria?";
    this.modal = true;


  }


  public cancelar() {
    this.routerPrd.navigate(['/empresa/detalle', this.id_empresa, 'cuentasbancarias']);
  }


  get f() {
    return this.myForm.controls;
  }


  public recibir($event: any) {


    this.modal = false;


    if (this.iconType == "warning") {


      if ($event) {

        let obj = this.myForm.value;


        let peticion: any = {
          numeroCuenta: obj.numeroCuenta,
          nombreCuenta: obj.nombreCuenta,
          descripcion: obj.descripcion,
          numInformacion: obj.num_informacion,
          clabe: obj.clabe,
          numSucursal: obj.num_sucursal,
          esActivo:obj.esActivo,
          nclCentrocCliente: {
            centrocClienteId: this.id_empresa
          },
          bancoId: {
            bancoId: obj.idbanco
          }
        };





        if (this.esInsert) {

          this.cuentasPrd.save(peticion).subscribe(datos => {

            this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.modal = true;

            console.log("Esto trae al guardar");
            console.log(datos);

          });
        } else {

          peticion.clabe = this.myForm.controls.clabe.value;
          console.log("se va a modificar",peticion);



          this.cuentasPrd.modificar(peticion).subscribe(datos => {

            this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.modal = true;

          });

        }

      }


    } else {
      this.modal = false;

      if (this.iconType == "success") {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'cuentasbancarias']);
      }
    }

  }


}
