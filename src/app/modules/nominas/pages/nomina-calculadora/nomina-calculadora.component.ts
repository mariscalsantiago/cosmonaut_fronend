import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoliticasService } from 'src/app/modules/empresas/pages/submodulos/politicas/pages/services/politicas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { Router } from '@angular/router';

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
  public esSueldoNetoBruto: boolean = true;
  public arregloPoliticas: any = [];
  public arregloBasePeriodos: any = [];
  public idEmpresa: number = 0;
  public limiteInferior: string = "";
  public excedente: string = "";
  public imss: string = "";
  public cuotaFija: string = "";
  public salarioBaseDeCotizacion: string = "";
  public salarioDiario: string = "";
  public salarioNetoMensual: string = "";
  public excedente_limiteInferior: string = "";
  public montoSubsidio: string = ""; 
  public contratoDesc: number | undefined;

  public esMensual:boolean = false;
  public esImss:boolean = false;
  public titulosueldo:string = "bruto";
  public resultCalculo: any = [];

  public modulo: string = "";
  public subModulo: string = "";

  constructor(private modalPrd: ModalService, private formbuilder: FormBuilder, private catalogosPrd: CatalogosService,
    private politicaPrd: PoliticasService, private usuarioSistemaPrd: UsuarioSistemaService, private router: Router,
    public configuracionPrd:ConfiguracionesService, private grupoNominaPrd: GruponominasService,) { }

  ngOnInit(): void {

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();
    
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
      
      for(let item of datos.datos){
        
            this.contratoDesc = datos.datos.find((itemmov: any) => itemmov.basePeriodoId === item.basePeriodoId)?.basePeriodoId;
            if(this.contratoDesc == 3)
            continue;
            this.arregloBasePeriodos.push(item);
      } 
    });
  }

  public crearFormulario() {
    return this.formbuilder.group({
      tiposueldo: ['b', Validators.required],
      periodicidadPagoId: [undefined, Validators.required],
      sueldobruto: [0, Validators.required],
      basePeriodoId: [undefined, Validators.required],
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
        this.esSueldoNetoBruto = false;

      } else {
        this.myForm.controls.politicaId.clearValidators();
        this.myForm.controls.politicaId.updateValueAndValidity();
        this.titulosueldo = "bruto";
        this.esSueldoNetoBruto = true;
      }
    });



    this.myForm.controls.periodicidadPagoId.valueChanges.subscribe(vv => {
      debugger;
      this.esMensual = vv == "05";
      this.verificarValidacionSueldo();
    });

    this.myForm.controls.imss.valueChanges.subscribe(vv =>{
      debugger;
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

  public inicio(){
    this.router.navigate(['/inicio']);
  }

  public calcular() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas calcular?").then(valor => {
      if(valor){
            
        let  obj = this.myForm.getRawValue();

          obj.basePeriodoId = Number.parseFloat(obj.basePeriodoId);
          let objEnviar : any = 
          {
              clienteId: this.idEmpresa,
              periodicidadPagoId: obj.periodicidadPagoId,
              sbmImss: obj.sueldobruto,
              inluyeImms: obj.imss,
              inlcuyeSubsidio: obj.subsidio,
              diasPeriodo: obj.basePeriodoId

        };

        
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
            debugger;
            this.grupoNominaPrd.calculadoraBruto(objEnviar).subscribe(datos => {

            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje)
            
              .then(()=> {
                 if (datos.resultado) {
                  const formatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2
                  })
                  const formatterDec = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2
                  })
                  this.calculado = true; 
                  this.resultCalculo = datos.datos;
                  this.limiteInferior = formatter.format(this.resultCalculo.limiteInferior);
                  this.excedente = formatter.format(this.resultCalculo.excedenteLimiteInferior);
                  this.imss = formatter.format(this.resultCalculo.imss);
                  this.salarioBaseDeCotizacion = formatter.format(this.resultCalculo.salarioBaseDeCotizacion);
                  this.salarioDiario = formatter.format(this.resultCalculo.salarioDiario);
                  this.salarioNetoMensual = formatter.format(this.resultCalculo.salarioNetoMensual);
                  this.excedente_limiteInferior = formatterDec.format(this.resultCalculo.porcentajeExcedenteLimiteInferior);
                  this.montoSubsidio = formatter.format(this.resultCalculo.montoSubsidio);
                  
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
