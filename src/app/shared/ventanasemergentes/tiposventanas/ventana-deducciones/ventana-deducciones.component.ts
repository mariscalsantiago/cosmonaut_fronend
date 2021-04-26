import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-ventana-deducciones',
  templateUrl: './ventana-deducciones.component.html',
  styleUrls: ['./ventana-deducciones.component.scss']
})
export class VentanaDeduccionesComponent implements OnInit {
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
  public obtenerPercepcion: any = [];
  public fijo: boolean = false;
  public porcentual: boolean = true;
  public conceptodeduccion: number = 0;
  public infonavit: boolean = false;
  public pensionAlimenticia: boolean = false;
  public normalDeduccion: boolean = true;
  public submenu: boolean = false;
  public numFolio: boolean = false;
  public prestamo: boolean = false;
  public montopago: boolean = false;
  public credito: boolean = false;
  public referencia: boolean = false;
  public infonacot: boolean = false;
  public valor: boolean = true;
  public valorDescuento: boolean = false;
  public empresa: number = 0;
  public empleado: number = 0;
  public arregloDescuentoInfonavit: any = [];

  @Output() salida = new EventEmitter<any>();
  @Input() public datos:any;


  constructor(private modalPrd:ModalService, private formBuild: FormBuilder, private catalogosPrd:CatalogosService,
    private bancosPrd: CuentasbancariasService) { }

  ngOnInit(): void {
    debugger;
    if(this.datos.idEmpleado != undefined){
      this.empresa = this.datos.idEmpresa;
      this.empleado = this.datos.idEmpleado;
    }else{
      this.empresa = this.datos.centrocClienteId?.centrocClienteId;
      this.empleado = this.datos.personaId?.personaId;
    }

    this.catalogosPrd.getTipoDescuentoInfonavit(true).subscribe(datos => this.arregloDescuentoInfonavit = datos.datos);
    this.catalogosPrd.getTipoBaseCalculo(true).subscribe(datos => this.arregloTipoMonto = datos.datos);
    this.bancosPrd.getObtenerDeduccion(this.empresa).subscribe(datos => this.obtenerPercepcion = datos.datos);

    debugger;
    if(this.datos.idEmpleado != undefined){
      this.datos = {};
      this.esInsert = true;
      this.myForm = this.createForm(this.datos);

    }else{
      this.esInsert = false;
      this.myForm = this.createForm(this.datos);
      this.validarConceptoDeduccion(this.datos.tipoDeduccionId?.tipoDeduccionId);
    }
    
    
  }

  public createForm(obj: any) {
    debugger;
    let datePipe = new DatePipe("en-MX");

    return this.formBuild.group({

      nomDeduccion: [obj.tipoDeduccionId?.tipoDeduccionId],
      fechaFinDescuento: [datePipe.transform(obj.fechaFinDescuento, 'yyyy-MM-dd')],
      fechaRecepcionAvisoRetencion: [datePipe.transform(obj.fechaRecepcionAvisoRetencion, 'yyyy-MM-dd')],
      baseCalculoId:[obj.baseCalculoId?.baseCalculoId],
      folioAvisoSuspension: [obj.folioAvisoSuspension],
      interesPorcentaje: [obj.interesPorcentaje],
      montoTotal: [obj.montoTotal],
      numeroCuotas: [obj.numeroCuotas],
      fechaRecepcionAvisoSuspension: [datePipe.transform(obj.fechaRecepcionAvisoSuspension, 'yyyy-MM-dd')],
      folioAvisoRetencion: [obj.folioAvisoRetencion],
      tipoPercepcionId: [obj.tipoPercepcionId],
      valor: [obj.valor],
      tipoDescuentoInfonavitId:[obj.tipoDescuentoInfonavitId?.tipoDescuentoInfonavitId],
      montoPorPeriodo: [obj.montoPorPeriodo],
      numeroFolio: [obj.numeroFolio],
      fechaInicioDescto: [datePipe.transform(obj.fechaInicioDescto, 'yyyy-MM-dd')],
      montoPercepcion: [obj.montoPercepcion],
      esActivo: [(!this.esInsert) ? obj.esActivo : { value: "true" , disabled: true }]

    });

    

  }

  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }


   public validarConceptoDeduccion(concepto:any){
    debugger;
    if(concepto=='010'){
      this.infonavit = true;
      this.fijo = true;
      this.submenu = true;
      this.numFolio = true;
      this.normalDeduccion = false;
      this.porcentual = false;
      this.montopago = false;
      this.prestamo = false;
      this.credito = true;
      this.referencia = false;
      this.infonacot = false;
      this.pensionAlimenticia = false;
      this.valor= true;
      this.valorDescuento = false;


      this.myForm.controls.baseCalculoId.enable();
      this.myForm.controls.valor.enable();

      if(this.esInsert){
      this.myForm.controls.montoTotal.setValue(""); 
      this.myForm.controls.numeroCuotas.setValue(""); 
      this.myForm.controls.baseCalculoId.setValue(""); 
      this.myForm.controls.valor.setValue("");
      }

    }
    else if(concepto=='007'){
      this.submenu = true;
      this.pensionAlimenticia = true;
      this.normalDeduccion = true;
      this.numFolio = true;
      this.infonavit = false;
      this.prestamo = false;
      this.credito = true;
      this.referencia = false;
      this.infonacot = false;
      this.valor = true;
      this.valorDescuento = false;

      this.myForm.controls.valor.enable();

      if(this.esInsert){
      this.myForm.controls.montoTotal.setValue(""); 
      this.myForm.controls.numeroCuotas.setValue("");
      this.myForm.controls.valor.setValue("");
      } 

    }    
    else if(concepto=='004'){
      this.submenu = true;
      this.prestamo = true;
      this.normalDeduccion = false;
      this.numFolio = true;
      this.montopago = true;
      this.infonavit = false;
      this.pensionAlimenticia = false;
      this.fijo = false;
      this.porcentual = false;
      this.credito = false;
      this.referencia = true;
      this.infonacot = false;
      this.valor = true;
      this.valorDescuento = false;


      this.myForm.controls.baseCalculoId.disable();
      this.myForm.controls.baseCalculoId.setValue(2);
      this.myForm.controls.valor.disable();

      if(this.esInsert){
      this.myForm.controls.montoTotal.setValue(""); 
      this.myForm.controls.numeroCuotas.setValue(""); 
      this.myForm.controls.valor.setValue("");
      }

      
    }
    else if(concepto=='011'){
      this.submenu = true;
      this.infonacot = true;
      this.normalDeduccion = true;
      this.numFolio = false;
      this.infonavit = false;
      this.pensionAlimenticia = false;
      this.prestamo = false;
      this.valor = false;
      this.valorDescuento = false;

      this.myForm.controls.baseCalculoId.disable();
      this.myForm.controls.baseCalculoId.setValue(2);
      this.myForm.controls.valor.enable();

      if(this.esInsert){
      this.myForm.controls.valor.setValue("");
      this.myForm.controls.montoTotal.setValue(""); 
      this.myForm.controls.numeroCuotas.setValue("");
      }
      
    }
    else{
      this.infonavit = false;
      this.pensionAlimenticia = false;
      this.submenu = false;
      this.numFolio = false;
      this.normalDeduccion = true;
      this.valor = true;
      this.infonacot = false;
      this.prestamo = false;
      this.montopago = false;
      this.porcentual = true;
      this.fijo = false;
      this.valorDescuento = false;
    
      this.myForm.controls.valor.enable();
      this.myForm.controls.baseCalculoId.enable();

      if(this.esInsert){
      this.myForm.controls.baseCalculoId.setValue("");
      this.myForm.controls.montoTotal.setValue(""); 
      this.myForm.controls.numeroCuotas.setValue(""); 
      this.myForm.controls.valor.setValue("");
      }
      
    }

    for(let item of this.obtenerPercepcion){
      if(concepto == item.tipoDeduccionId.tipoDeduccionId){
          this.conceptodeduccion= item.conceptoDeduccionId;
      }
    }
    
   }

   public validarMontoTotal(monto:any){
    debugger;
      this.monto = monto;
      if(this.monto != null && this.numPeriodo != null){
        this.bancosPrd.getObtenerMontoPercepcion(this.monto, this.numPeriodo).subscribe(datos =>{
          this.montoPercepcion = datos.datos;
          this.myForm.controls.valor.setValue(this.montoPercepcion);
        });

      }
   }

   public validarNumeroCuotas(cuotas:any){
    debugger;
    this.numPeriodo = cuotas;
    if(this.monto != null && this.numPeriodo != null){
      this.bancosPrd.getObtenerMontoPercepcion(this.monto, this.numPeriodo).subscribe(datos =>{
        this.montoPercepcion = datos.datos;
        this.myForm.controls.valor.setValue(this.montoPercepcion);
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

   public validarNomMontoInfonavit(tipomonto:any){
    debugger;
      if(tipomonto == 1){
        this.porcentual = false;
        this.fijo = true;
        this.valorDescuento = false;
        this.valor = true;

      }
      else if(tipomonto == 2){
        this.porcentual = true;
        this.fijo = false;
        this.valorDescuento = false;
        this.valor = true;
      }
      else{
        this.valorDescuento = true;
        this.valor = false;
      }

   }

  
 

  public enviarPeticion(){
    debugger;
    /*this.submitEnviado = true;
    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;

    }*/
    let mensaje = this.esInsert ? "¿Deseas registrar la percepción" : "¿Deseas actualizar la percepción?";
    
      this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
        if(valor){
          let  obj = this.myForm.getRawValue();
          
          let objEnviar:any = {
            tipoDeduccionId: {
              tipoDeduccionId: obj.nomDeduccion
            },
            conceptoDeduccionId: {
              conceptoDeduccionId: this.conceptodeduccion
            },
            personaId: {
              personaId: this.empleado
              
              },
                 
            centrocClienteId: {
              centrocClienteId: this.empresa
              },
              
            baseCalculoId: {
              baseCalculoId: obj.baseCalculoId
            },
            valor: obj.valor,
            fechaInicioDescto: obj.fechaInicioDescto,
            numeroFolio: obj.numeroFolio,
            montoTotal: obj.montoTotal,
            numeroCuotas: obj.numeroCuotas,
            interesPorcentaje: obj.interesPorcentaje,
            fechaFinDescuento: obj.fechaFinDescuento,
            folioAvisoRetencion: obj.folioAvisoRetencion,
            fechaRecepcionAvisoRetencion: obj.fechaRecepcionAvisoRetencion,
            folioAvisoSuspension: obj.folioAvisoSuspension,
            fechaRecepcionAvisoSuspension: obj.fechaRecepcionAvisoSuspension,
            tipoDescuentoInfonavitId: {
             tipoDescuentoInfonavitId: obj.tipoDescuentoInfonavitId
            }
          };
          debugger;
          this.salida.emit({type:"guardar",datos:objEnviar});
        }
      });
  }

}
