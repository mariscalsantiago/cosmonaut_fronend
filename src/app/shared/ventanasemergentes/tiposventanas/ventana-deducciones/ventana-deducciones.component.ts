import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { CuentasbancariasService } from 'src/app/modules/empresas/pages/submodulos/cuentasbancarias/services/cuentasbancarias.service';
import { debug } from 'console';

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
    this.bancosPrd.getObtenerDeduccion(112).subscribe(datos => this.obtenerPercepcion = datos.datos);

    this.obj = {};
    this.myForm = this.createForm(this.obj);
  }

  public createForm(obj: any) {
    debugger;
    this.esInsert = true;
    return this.formBuild.group({

      nomDeduccion: [obj.nomDeduccion],
      fechaFinDescuento: [obj.fechaFinDescuento],
      fechaRecepcionAvisoRetencion: [obj.fechaRecepcionAvisoRetencion],
      baseCalculoId:[obj.baseCalculoId],
      folioAvisoSuspension: [obj.folioAvisoSuspension],
      fechaRecepcionAvisoSuspension: [obj.fechaRecepcionAvisoSuspension],
      folioAvisoRetencion: [obj.folioAvisoRetencion],
      tipoPercepcionId: [obj.tipoPercepcionId],
      porcentaje: [obj.porcentaje],
      montoPorPeriodo: [obj.montoPorPeriodo],
      numeroFolio: [obj.numeroFolio],
      fechaInicioDescto: [obj.fechaInicioDescto],
      montoPercepcion: [obj.montoPercepcion],
      esActivo: [(!this.esInsert) ? obj.esActivo : { value: "true", disabled: true }]

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
    }
    else if(concepto=='007'){
      this.submenu = true;
      this.pensionAlimenticia = true;
      this.normalDeduccion = true;
      this.numFolio = true;
      this.infonavit = false;
      
      
    }else{
      this.infonavit = false;
      this.submenu = false;
      this.numFolio = false;
      this.normalDeduccion = true;
    }
    for(let item of this.obtenerPercepcion){
      if(concepto == item.tipoDeduccionId.tipoDeduccionId){
          this.conceptodeduccion= item.conceptoDeduccionId;
      }
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
            tipoDeduccionId: {
              tipoDeduccionId: obj.nomDeduccion
            },
            conceptoDeduccionId: {
              conceptoDeduccionId: this.conceptodeduccion
            },
            personaId: {
              personaId: 585
              
              },
                 
            centrocClienteId: {
              centrocClienteId: 112
              },
              
            baseCalculoId: {
              baseCalculoId: obj.baseCalculoId
            },
            fechaInicioDescto: obj.fechaInicioDescto,
            numeroFolio: obj.numeroFolio,
            montoTotal: obj.porcentaje,
            //fechaDemanda: "",
            //fechaOtorgamiento: "",
            //numeroCuotas: 60,
            //interesPorcentaje: 1.12,
            fechaFinDescuento: obj.fechaFinDescuento,
            folioAvisoRetencion: obj.folioAvisoRetencion,
            fechaRecepcionAvisoRetencion: obj.fechaRecepcionAvisoRetencion,
            folioAvisoSuspension: obj.folioAvisoSuspension,
            fechaRecepcionAvisoSuspension: obj.fechaRecepcionAvisoSuspension,
             //tipoDescuentoInfonavitId: {
             // tipoDescuentoInfonavitId: 0
            //}
          };
          debugger;
          this.salida.emit({type:"guardar",datos:objEnviar});
        }
      });
  }

}
