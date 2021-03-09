import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { CuentasbancariasService } from '../../../../../empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {
  @Output() enviado = new EventEmitter();
  @Input() datosPersona: any;

  public myForm!: FormGroup;

  public submitEnviado: boolean = false;

  public arreglobancos: any = [];

  constructor(private formBuilder: FormBuilder, private catalogosPrd: CatalogosService,
    private bancosPrd: CuentasbancariasService,private usuariosSistemaPrd:UsuarioSistemaService,
    private modalPrd:ModalService,private navigate:Router) { }

  ngOnInit(): void {
    this.myForm = this.createForm({});


    this.catalogosPrd.getCuentasBanco().subscribe(datos => this.arreglobancos = datos.datos);

  }





  public createForm(obj: any) {

    return this.formBuilder.group({
      metodo_pago_id: { value: obj.metodo_pago_id, disabled: true },
      numeroCuenta: [obj.numeroCuenta, [Validators.required]],
      clabe: [obj.clabe, [Validators.required]],
      csBanco: [obj.csBanco?.bancoId, [Validators.required]],
      numInformacion: obj.numInformacion
    });

  }




  public cancelar() {

  }


  public enviarFormulario() {

    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas guardar los cambios?").then(valor =>{
      if(valor){


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
  
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
            if(datos.resultado){
                this.navigate.navigate(['/empleados']);
            }
          });

        });
  
  
      }
    });

  }

  public get f() {
    return this.myForm.controls;
  }


 
}
