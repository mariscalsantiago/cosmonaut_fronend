import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { DatePipe } from '@angular/common';

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
  public empresa: number = 0;
  public empleado: number = 0;
  public conceptoPercepcionId: number = 0;
  public objEnviar: any = [];

  @Input() public datos:any;


  @Output() salida = new EventEmitter<any>();


  constructor(private modalPrd:ModalService, private formBuild: FormBuilder, private catalogosPrd:CatalogosService,
    private bancosPrd: CuentasbancariasService) { }

  ngOnInit(): void {
    
    if(this.datos.idEmpleado != undefined){
      this.empresa = this.datos.idEmpresa;
      this.empleado = this.datos.idEmpleado;
    }else{
      this.empresa = this.datos.centrocClienteId?.centrocClienteId;
      this.empleado = this.datos.personaId?.personaId;
    }

    this.catalogosPrd.getTipoBaseCalculo(true).subscribe(datos => this.arregloTipoMonto = datos.datos);

    if(this.datos.idEmpleado != undefined){
      this.datos = {};
      this.esInsert = true;
      this.myForm = this.createForm(this.datos);

    }else{
      
      this.esInsert = false;
      this.myForm = this.createForm(this.datos);
      let tipo = (this.datos.conceptoPercepcionId?.tipoPeriodicidad == 'P') ? '1' : '2'
      this.validarTipoPercepcion(tipo);

    }

  }

  public createForm(obj: any) {
    
    let datePipe = new DatePipe("en-MX");
    if(!this.esInsert){
      obj.tipoPeriodicidadId = (obj.conceptoPercepcionId?.tipoPeriodicidad == 'P') ? '1' : '2';
    }

    return this.formBuild.group({

      numeroPeriodos: [obj.numeroPeriodos],
      tipoPeriodicidadId: [obj.tipoPeriodicidadId],
      baseCalculoId:[obj.baseCalculoId?.baseCalculoId],
      porcentaje: [obj.valor],
      montoPorPeriodo: [obj.montoPorPeriodo],
      fechaInicio: [datePipe.transform(obj.fechaInicio, 'yyyy-MM-dd')],
      montoPercepcion: [obj.montoTotal],
      nomPercepcion: [obj.tipoPercepcionId?.tipoPercepcionId],
      referencia:[obj.referencia],
      esActivo: [(!this.esInsert) ? obj.esActivo : { value: "true", disabled: true }]

    });

  }

  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }

  public validarPercepcion(tipo:any){
    
    for(let item of this.nombrePercepcion){
      if(item.tipoPercepcionId?.tipoPercepcionId == tipo){
        this.conceptoPercepcionId = item.conceptoPercepcionId;
      }
    }
    
  
  }

  public validarTipoPercepcion(tipo:any){
    
    if(tipo != ""){
      if(tipo == 1){
        let nombrePer = "P";
        this.periodica = true;
        this.estandar= false;
        this.myForm.controls.baseCalculoId.disable();
        this.myForm.controls.baseCalculoId.setValue(2);
        this.bancosPrd.getObtenerPeriodicidad(this.empresa, nombrePer).subscribe(datos =>{
          this.nombrePercepcion = datos.datos;
        });
      }else{
        let nombrePer = "E";
        this.myForm.controls.baseCalculoId.enable();
        if(!this.esInsert){
          let tipoMonto = this.datos.baseCalculoId?.baseCalculoId;
          this.myForm.controls.baseCalculoId.setValue(tipoMonto);
          this.validarNomMonto(tipoMonto);
        }else{
        this.myForm.controls.baseCalculoId.setValue("");
        }
        this.periodica = false;
        this.estandar= true;
        this.bancosPrd.getObtenerPeriodicidad(this.empresa, nombrePer).subscribe(datos =>{
          this.nombrePercepcion = datos.datos;
        });
        }
      }
   }

   public validarMonto(monto:any){
    
      this.monto = monto;
      if(this.monto != null && this.numPeriodo != null){
        this.bancosPrd.getObtenerMontoPercepcion(this.monto, this.numPeriodo).subscribe(datos =>{
          this.montoPercepcion = datos.datos;
          this.myForm.controls.montoPorPeriodo.setValue(this.montoPercepcion);
        });

      }
   }

   public validarNomMonto(tipomonto:any){
    
    if(tipomonto == 2){
      this.porcentual = false;
      this.fijo = true;
    }else{
      this.porcentual = true;
      this.fijo = false;
    }

   }

   public validarNumPeriodo(periodo:any){
    
    this.numPeriodo = periodo;
    if(this.monto != null && this.numPeriodo != null){
      this.bancosPrd.getObtenerMontoPercepcion(this.monto, this.numPeriodo).subscribe(datos =>{
        this.montoPercepcion = datos.datos;
        this.myForm.controls.montoPorPeriodo.setValue(this.montoPercepcion);
      });
        
    }
   }

   
 

  public enviarPeticion(){
    
    /*this.submitEnviado = true;
    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;

    }*/
    let mensaje = this.esInsert ? "¿Deseas registrar la percepción" : "¿Deseas actualizar la percepción?";
    
    this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
      
        if(valor){
          
          let  obj = this.myForm.getRawValue();
          
          if(this.esInsert){
            this.objEnviar = {
            tipoPercepcionId: {
              tipoPercepcionId: obj.nomPercepcion
            },
            conceptoPercepcionId: {
              conceptoPercepcionId: this.conceptoPercepcionId
            },
            personaId: {
              personaId: this.empleado
            },
            centrocClienteId: {
                centrocClienteId: this.empresa
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
          
        }else{
          for(let item of this.nombrePercepcion){
            if(item.tipoPercepcionId?.tipoPercepcionId == obj.nomPercepcion){
              this.conceptoPercepcionId = item.conceptoPercepcionId;
            }
          }
          this.objEnviar = {
            configuraPercepcionId: this.datos.configuraPercepcionId,
            tipoPercepcionId: {
              tipoPercepcionId: obj.nomPercepcion
            },
            conceptoPercepcionId: {
              conceptoPercepcionId: this.conceptoPercepcionId
            },
            personaId: {
              personaId: this.empleado
            },
            centrocClienteId: {
                centrocClienteId: this.empresa
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

        }
          
          this.salida.emit({type:"guardar",datos:this.objEnviar});
        }
      });
  }


  public get f(){
    return this.myForm.controls;
  }

}
