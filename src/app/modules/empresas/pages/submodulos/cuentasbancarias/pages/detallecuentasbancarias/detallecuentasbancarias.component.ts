import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CuentasbancariasService } from '../../services/cuentasbancarias.service';

@Component({
  selector: 'app-detallecuentasbancarias',
  templateUrl: './detallecuentasbancarias.component.html',
  styleUrls: ['./detallecuentasbancarias.component.scss']
})
export class DetallecuentasbancariasComponent implements OnInit {


  public mostrartooltip:boolean = false;
  public iconType: string = "";
  public myForm!: FormGroup;
  public modal: boolean = false;
  public strTitulo: string = "";
  public strsubtitulo: string = "";
  public id_empresa: number = 0;
  public esInsert: boolean = false;
  public cuenta: any;
  public cuentasBancarias: any;
  public submitInvalido: boolean = false;
  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private cuentasPrd: CuentasbancariasService) { }

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


    let obj = {csBanco:{bancoId:0}};

    if (!this.esInsert) {//Solo cuando es modificar
      obj = history.state.data;
      if (obj == undefined) this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'cuentasbancarias']);
      
    }

    
    this.myForm = this.createForm(obj);


    this.cuentasPrd.getListaBancos().subscribe(datos => {
      this.cuentasBancarias = datos.data;
    });

  }

  public createForm(obj: any) {



    return this.formBuild.group({

      numeroCuenta: [obj.numeroCuenta, [Validators.required]],
      nombreCuenta: [obj.nombreCuenta, [Validators.required]],
      idbanco: [obj.csBanco.bancoId, [Validators.required]],
      descripcion: [obj.descripcion],
      num_informacion: [obj.num_informacion],
      clabe: [obj.clabe, [Validators.required, Validators.pattern(/^\d{18}$/)]],
      num_sucursal: [obj.num_sucursal]

    });

  }



  public enviarPeticion() {



    if (!this.myForm.valid) {

      this.strTitulo = "Campos invalidos, Favor de verificar";
      this.strsubtitulo = "Algunos campos son incorrectos.";
      this.iconType = "error";
      this.modal = true;
      this.submitInvalido = true;

      return;
    }


    this.iconType = "warning";
    this.strTitulo = (this.esInsert) ? "¿Deseas registrar el usuario?" : "¿Deseas actualizar el usuario?";
    this.strsubtitulo = "Una vez aceptando los cambios seran efectuados";
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
          num_informacion: obj.num_informacion,
          clabe: obj.clabe,
          num_sucursal: obj.num_sucursal,
          nclCentrocCliente: {
            centrocClienteId: this.id_empresa
          },
          csBanco: {
            bancoId: obj.idbanco
          }
        };


        if (this.esInsert) {

          this.cuentasPrd.save(peticion).subscribe(datos => {

            this.iconType = datos.result ? "success" : "error";

            this.strTitulo = datos.message;
            this.strsubtitulo = datos.message
            this.modal = true;

          });
        } else {

          this.cuentasPrd.modificar(peticion).subscribe(datos => {

            this.iconType = datos.result ? "success" : "error";

            this.strTitulo = datos.message;
            this.strsubtitulo = datos.message
            this.modal = true;

          });

        }

      }


    } else {
      this.modal = false;

      if (this.iconType == "success") {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'contactosrrh']);
      }
    }

  }


}