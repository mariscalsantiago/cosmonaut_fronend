import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { debug } from 'console';

@Component({
  selector: 'app-ventana-percepciones',
  templateUrl: './ventana-percepciones.component.html',
  styleUrls: ['./ventana-percepciones.component.scss']
})
export class VentanaPercepcionesComponent implements OnInit {
  public myForm!: FormGroup;
  public esInsert: boolean = false;
  public obj: any = [];
  public submitEnviado: boolean = false;
  public arregloTipoMonto: any = [];
  public estandar: boolean = false;
  public periodica:boolean= true;
  public monto: number = 0;
  public numPeriodo: number = 0;
  public montoPercepcion: any = [];
  public nombrePercepcion: any = [];
  public fijo: boolean = false;
  public porcentual: boolean = true;


  @Output() salida = new EventEmitter<any>();


  constructor(private modalPrd:ModalService, private formBuild: FormBuilder, private catalogosPrd:CatalogosService,
    private bancosPrd: CuentasbancariasService) { }

  ngOnInit(): void {
    debugger;
    /*if (!this.esInsert) {//Solo cuando es modificar
      this.obj = history.state.data;
      
    }else{
      this.obj= {};
    }*/
    this.catalogosPrd.getTipoBaseCalculo(true).subscribe(datos => this.arregloTipoMonto = datos.datos);

    this.obj = {};
    this.myForm = this.createForm(this.obj);
  }

  public createForm(obj: any) {
    debugger;
    this.esInsert = true;
    return this.formBuild.group({

      numeroPeriodos: [obj.numeroPeriodos],
      baseCalculoId:[obj.baseCalculoId],
      tipoPercepcionId: [obj.tipoPercepcionId],
      porcentaje: [obj.porcentaje],
      montoPorPeriodo: [obj.montoPorPeriodo],
      fechaInicio: [obj.fechaInicio],
      montoPercepcion: [obj.montoPercepcion],
      nomPercepcion: [obj.nomPercepcion],
      referencia:[obj.referencia],
      esActivo: [(!this.esInsert) ? obj.esActivo : { value: "true", disabled: true }]

    });

  }

  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }

  public validarTipoPercepcion(tipo:any){
    debugger;
    if(tipo != ""){
      if(tipo == 1){
        let nombrePer = "P";
        this.periodica = true;
        this.estandar= false;
        this.myForm.controls.baseCalculoId.disable();
        this.myForm.controls.baseCalculoId.setValue(2);
        this.bancosPrd.getObtenerPeriodicidad(112, nombrePer).subscribe(datos =>{
          this.nombrePercepcion = datos.datos;
        });
      }else{
        let nombrePer = "E";
        this.myForm.controls.baseCalculoId.enable();
        this.myForm.controls.baseCalculoId.setValue("");
        this.periodica = false;
        this.estandar= true;
        this.bancosPrd.getObtenerPeriodicidad(112, nombrePer).subscribe(datos =>{
          this.nombrePercepcion = datos.datos;
        });
        }
      }
   }

   public validarMonto(monto:any){
    debugger;
      this.monto = monto;
      if(this.monto != null && this.numPeriodo != null){
        this.bancosPrd.getObtenerMontoPercepcion(this.monto, this.numPeriodo).subscribe(datos =>{
          this.montoPercepcion = datos.datos;
          this.myForm.controls.montoPorPeriodo.setValue(this.montoPercepcion);
        });

      }
   }

   public validarNomMonto(tipomonto:any){
    debugger;
    if(tipomonto == 2){
      this.porcentual = false;
      this.fijo = true;
    }else{
      this.porcentual = true;
      this.fijo = false;
    }

   }

   public validarNumPeriodo(periodo:any){
    debugger;
    this.numPeriodo = periodo;
    if(this.monto != null && this.numPeriodo != null){
      this.bancosPrd.getObtenerMontoPercepcion(this.monto, this.numPeriodo).subscribe(datos =>{
        this.montoPercepcion = datos.datos;
        this.myForm.controls.montoPorPeriodo.setValue(this.montoPercepcion);
      });
        
    }
   }

   
 

  public enviarPeticion(){
    debugger;
    /*this.submitEnviado = true;
    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;

    }*/
      this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas registrar la percepción?").then(valor =>{
        if(valor){
          let  obj = this.myForm.getRawValue();
          let objEnviar:any = {
            tipoPercepcionId: {
              tipoPercepcionId: obj.nomPercepcion
            },
            conceptoPercepcionId: {
              conceptoPercepcionId: obj.tipoPercepcionId
            },
            personaId: {
              personaId: 585 
            },
            centrocClienteId: {
                centrocClienteId: 112
            },
            valor: obj.porcentaje,
            baseCalculoId:{
              baseCalculoId: obj.baseCalculoId
            },
            esActivo: obj.esActivo,
            referencia: obj.referencia,
            fechaInicio: obj.fechaInicio,
            montoTotal: obj.montoPercepcion,
            numeroPeriodos: obj.numeroPeriodos,
            montoPorPeriodo: obj.montoPorPeriodo
          
          };
          debugger;
          this.salida.emit({type:"guardar",datos:objEnviar});
        }
      });
  }

}
