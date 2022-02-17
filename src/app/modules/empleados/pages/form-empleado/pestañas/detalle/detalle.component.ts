import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
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
  private nocancelar:boolean = false;


  public arreglobancos: any = [];

  constructor(private formBuilder: FormBuilder, private catalogosPrd: CatalogosService,
    private bancosPrd: CuentasbancariasService,private usuariosSistemaPrd:UsuarioSistemaService,
    private modalPrd:ModalService,private navigate:Router, public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    this.nocancelar = !Boolean(this.datosPersona.datosTranferencia?.cuentaBancoId);

    this.myForm = this.createForm(
      this.datosPersona.datosTranferencia || {}
    );

    this.catalogosPrd.getCuentasBanco(true).subscribe(datos => this.arreglobancos = datos.datos);
  }



  public createForm(obj: any) {

    return this.formBuilder.group({
      metodo_pago_id: { value: obj.metodo_pago_id, disabled: true },
      numeroCuenta: [obj.numeroCuenta, [Validators.required]],
      clabe: [obj.clabe, [Validators.required]],
      csBanco: [obj.bancoId?.bancoId, [Validators.required]],
      numInformacion: obj.numInformacion
    });

  }




  public cancelar() {

    if(this.myForm.invalid || this.nocancelar){
      this.modalPrd.showMessageDialog(this.modalPrd.error,"No se puede cancelar, la cuenta bancaria para un empleado de transferencia es obligatorio.");
      return;
    }
      this.navigate.navigate(['/empleados']);
  }

  public validarBanco(clabe:any){

    this.myForm.controls.csBanco.setValue("");
    //this.myForm.controls.clabe.setValue("");

    if(this.myForm.controls.clabe.errors?.pattern === undefined ){


    if(clabe == '' || clabe == null || clabe == undefined){

      this.myForm.controls.csBanco.setValue("");
      this.myForm.controls.clabe.setValue("");
    }else{
      if(clabe.length == 18){
        this.bancosPrd.getListaCuentaBancaria(clabe).subscribe(datos => {
          if (datos.resultado) {

            this.myForm.controls.csBanco.setValue( datos.datos.bancoId);
            this.myForm.controls.clabe.setValue(clabe);
            this.myForm.controls.numeroCuenta.setValue(datos.datos.numeroCuenta);

          }
          else{
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

  public enviarFormulario() {

    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas guardar los cambios?").then(valor =>{
      if(valor){


        let obj = this.myForm.value;

        let objEnviar:any = {

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


        this.modalPrd.showMessageDialog(this.modalPrd.loading);

      if  ( !Boolean(this.datosPersona.datosTranferencia?.cuentaBancoId) ){
       this.bancosPrd.save(objEnviar).subscribe(datos => {
        this.nocancelar = !datos.resultado;
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
            
            if(datos.resultado){
              let obj = {
                perfilesPendientes: true
              }
              this.configuracionPrd.breadcrum.permisos.push(obj);
              this.enviado.emit({ type: "detalle", valor: true, datos:datos.datos });

             // this.navigate.navigate(['/empleados']);
            }
          });

        });

      } else {
         objEnviar.cuentaBancoId = this.datosPersona.datosTranferencia.cuentaBancoId;
         objEnviar.esActivo =true;
        this.bancosPrd.modificar(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
            if(datos.resultado){
              let obj = {
                perfilesPendientes: true
              }
              this.configuracionPrd.breadcrum.permisos.push(obj);
              this.enviado.emit({ type: "detalle", valor: true, datos:datos.datos });

             // this.navigate.navigate(['/empleados']);
            }
          });

        });

      }

      }
    });

  }

  public get f() {
    return this.myForm.controls;
  }



}
