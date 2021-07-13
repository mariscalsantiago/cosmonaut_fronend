import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoliticasService } from 'src/app/modules/empresas/pages/submodulos/politicas/pages/services/politicas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';

@Component({
  selector: 'app-nomina-calculadora',
  templateUrl: './nomina-calculadora.component.html',
  styleUrls: ['./nomina-calculadora.component.scss']
})
export class NominaCalculadoraComponent implements OnInit {


  public calculado: boolean = false;
  public myForm!: FormGroup;
  public arregloPeriocidad: any = [];
  public esSueldoNeto: boolean = false;
  public arregloPoliticas: any = [];
  public arregloBasePeriodos: any = [];
  public idEmpresa: number = 0;

  public esMensual:boolean = false;
  public esImss:boolean = false;
  public titulosueldo:string = "bruto";
  public arregloCalculo: any = [];

  constructor(private modalPrd: ModalService, private formbuilder: FormBuilder, private catalogosPrd: CatalogosService,
    private politicaPrd: PoliticasService, private usuarioSistemaPrd: UsuarioSistemaService,
    public configuracionPrd:ConfiguracionesService, private grupoNominaPrd: GruponominasService,) { }

  ngOnInit(): void {
    this.myForm = this.crearFormulario();
    this.idEmpresa = this.usuarioSistemaPrd.getIdEmpresa();
    this.suscripciones();
    this.catalogosPrd.getPeriocidadPago(true).subscribe(datos => {
      this.arregloPeriocidad = datos.datos;
    });

    this.politicaPrd.getAllPol(this.idEmpresa).subscribe(datos => {
      this.arregloPoliticas = datos.datos;
    });

    this.catalogosPrd.getBasePeriodos(true).subscribe(datos => {
      this.arregloBasePeriodos = datos.datos;
    });
  }

  public crearFormulario() {
    return this.formbuilder.group({
      tiposueldo: ['b', Validators.required],
      periodicidadPagoId: [undefined, Validators.required],
      sueldobruto: [0, Validators.required],
      basePeriodoId: [undefined],
      politicaId: [undefined],
      imss:[],
      subsidio:[]
    });
  }

  public suscripciones() {
    this.myForm.controls.tiposueldo.valueChanges.subscribe(valor => {
      this.esSueldoNeto = valor == "n";

      if (this.esSueldoNeto) {
        this.myForm.controls.politicaId.setValidators([Validators.required]);
        this.myForm.controls.politicaId.updateValueAndValidity();
        this.titulosueldo = "neto";

      } else {
        this.myForm.controls.politicaId.clearValidators();
        this.myForm.controls.politicaId.updateValueAndValidity();
        this.titulosueldo = "bruto";
      }
    });



    this.myForm.controls.periodicidadPagoId.valueChanges.subscribe(vv => {
      this.esMensual = vv == "05";
      this.verificarValidacionSueldo();
    });

    this.myForm.controls.imss.valueChanges.subscribe(vv =>{
      this.esImss = vv;
      this.verificarValidacionSueldo();
    });

    
  }

  public verificarValidacionSueldo(){
      if(this.esImss && this.esMensual){
          this.myForm.controls.sueldobruto.setValidators([Validators.required,Validators.min(4251)]);
          this.myForm.controls.sueldobruto.updateValueAndValidity();
      }else{
        this.myForm.controls.sueldobruto.setValidators([Validators.required]);
        this.myForm.controls.sueldobruto.updateValueAndValidity();
      }
  }


  public calcular() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas calcular?").then(valor => {
      if(valor){
         debugger;   
        let  obj = this.myForm.getRawValue();


          let objEnviar : any = 
          {
              clienteId: this.idEmpresa,
              periodicidadPagoId: obj.periodicidadPagoId,
              sbmImss: obj.sueldobruto,
              inluyeImms: obj.imss,
              inlcuyeSubsidio: obj.subsidio

        };
        
        this.modalPrd.showMessageDialog(this.modalPrd.loading);

            this.grupoNominaPrd.calculadoraBruto(objEnviar).subscribe(datos => {

            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje)
              .then(()=> {
                 if (datos.resultado) {
                  this.arregloCalculo = datos.desgloseSalario.desgloseSalario;
                  this.calculado = true;
              } 
              });
          });     

      }
    });
  }

  public get f() {
    return this.myForm.controls;
  }

  public enviarPeticion() {
    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      Object.values(this.myForm.controls).forEach(control => {
        control.markAsTouched();
      });

      return;
    }
  }
}
