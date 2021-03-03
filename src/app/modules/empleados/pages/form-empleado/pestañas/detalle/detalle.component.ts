import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { CuentasbancariasService } from '../../../../../empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit, OnChanges {
  @Output() enviado = new EventEmitter();
  @Input() alerta: any;
  @Input() enviarPeticion: any;
  @Input() cambiaValor: boolean = false;
  @Input() datosPersona: any;
  @Input() metodopago: any = {};

  public myForm!: FormGroup;

  public submitEnviado: boolean = false;

  public arreglobancos: any = [];

  constructor(private formBuilder: FormBuilder, private catalogosPrd: CatalogosService,
    private bancosPrd: CuentasbancariasService,private usuariosSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {

    let obj = {
      csBanco: {}
    };
    this.myForm = this.createForm(obj);


    this.catalogosPrd.getCuentasBanco().subscribe(datos => this.arreglobancos = datos.datos);

  }





  public createForm(obj: any) {

    return this.formBuilder.group({
      metodo_pago_id: { value: obj.metodo_pago_id, disabled: true },
      numeroCuenta: [obj.numeroCuenta, [Validators.required]],
      clabe: [obj.clabe, [Validators.required]],
      csBanco: [obj.csBanco.bancoId, [Validators.required]],
      numInformacion: obj.numInformacion
    });

  }




  public cancelar() {

  }


  public enviarFormulario() {

    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.alerta.modal = true;
      this.alerta.strTitulo = "Campos obligatorios o inválidos";
      this.alerta.strsubtitulo = "Hay campos inválidos o sin rellenar, favor de verificar";
      this.alerta.iconType = "error";
      return;
    }

    this.alerta.modal = true;
    this.alerta.strTitulo = "¿Deseas guardar cambios?";
    this.alerta.strsubtitulo = "Esta apunto de guardar un empleado";
    this.alerta.iconType = "warning";

  }

  public get f() {
    return this.myForm.controls;
  }


  ngOnChanges(changes: SimpleChanges) {

    if (this.enviarPeticion.enviarPeticion) {
      this.enviarPeticion.enviarPeticion = false;


      let obj = this.myForm.value;

      let objEnviar = {

        numeroCuenta: obj.numeroCuenta,
        clabe: obj.clabe,
        bancoId: {
          bancoId: obj.csBanco
        },
        numInformacion: obj.numInformacion,
        ncoPersona: {
          personaId: this.datosPersona.personaId
        },
        nclCentrocCliente: {
          centrocClienteId: this.usuariosSistemaPrd.getIdEmpresa()
        },
        nombreCuenta: '  '


      };

      this.bancosPrd.save(objEnviar).subscribe(datos => {

        this.alerta.iconType = datos.resultado ? "success" : "error";

        this.alerta.strTitulo = datos.mensaje;
        this.alerta.strsubtitulo = datos.mensaje
        this.alerta.modal = true;
      });



    }





  }
}
