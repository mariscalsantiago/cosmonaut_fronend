import { Component, OnInit, Output,EventEmitter, Input , ViewChild, ElementRef} from '@angular/core';
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
  @ViewChild("fechaInicioDescto") fechaInicioDesctoComp!: ElementRef;
  @ViewChild("fechaFinDescuento") fechaFinDescuento!: ElementRef;
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
  public objEnviar : any = [];
  public politica: number = 0;
  public deducPolitica: boolean = false;
  public concepto !: string;
  public tipoValor: string ="Porcentaje";
  public especializacion: string = "";
  public nombreretencion: string = "";
  public nombresuspension: string = "";
  public tipoDescuentoInfonavitId : number = 0;
  public cambioEstatus : boolean = true;

  @Output() salida = new EventEmitter<any>();
  @Input() public datos:any;
  @ViewChild("retencion") public inputdoc!: ElementRef;
  @ViewChild("suspension") public inputdocsusp!: ElementRef;


  constructor(private modalPrd:ModalService, private formBuild: FormBuilder, private catalogosPrd:CatalogosService,
    private bancosPrd: CuentasbancariasService) { }

  ngOnInit(): void {
    
    if(this.datos.idEmpleado != undefined){
      this.empresa = this.datos.idEmpresa;
      this.empleado = this.datos.idEmpleado;
      this.politica = this.datos.idPolitica;
    }else{
      this.empresa = this.datos.centrocClienteId?.centrocClienteId;
      this.empleado = this.datos.personaId?.personaId;
      this.politica = this.datos.politicaId?.politicaId;
    }
    
    this.catalogosPrd.getTipoDescuentoInfonavit(true).subscribe(datos => this.arregloDescuentoInfonavit = datos.datos);
    this.catalogosPrd.getTipoBaseCalculo(true).subscribe(datos => this.arregloTipoMonto = datos.datos);
    if(this.politica !== undefined){
    this.bancosPrd.getObtenerDeduccionPolitica(this.empresa).subscribe(datos => this.obtenerPercepcion = datos.datos);
    }else{
    
    this.bancosPrd.getObtenerDeduccion(this.empresa).subscribe(datos => this.obtenerPercepcion = datos.datos);
    }
    if(this.datos.idEmpleado != undefined){
      this.datos = {};
      this.esInsert = true;
      this.myForm = this.createForm(this.datos);

    }else{
      this.esInsert = false;
      this.myForm = this.createForm(this.datos);
      this.validarConceptoDeduccion(this.datos.tipoDeduccionId?.tipoDeduccionId);
    }
    
    
    this.suscripciones();
  }

  public createForm(obj: any) {
    
    if (this.datos.retencionCargada  == true) {
      obj.retencion = 'Aviso de retención cargado';
    }
    if (this.datos.suspensionCargada == true) {
      obj.suspension = 'Aviso de suspensión cargado';
    }
    
    let datePipe = new DatePipe("en-MX");
    this.tipoDescuentoInfonavitId = obj.tipoDescuentoInfonavitId?.tipoDescuentoInfonavitId;

    if(obj.baseCalculoId?.baseCalculoId === 2){
      this.tipoValor ="Monto"
    }
    this.especializacion =obj.tipoDeduccionId?.especializacion;
    // console.log('obj',obj.tipoDeduccionId?.especializacion)
    return this.formBuild.group({

      nomDeduccion: [obj.tipoDeduccionId?.tipoDeduccionId, Validators.required],
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
      fechaInicioDescto: [datePipe.transform(obj.fechaInicioDescto, 'yyyy-MM-dd'), Validators.required],
      montoPercepcion: [obj.montoPercepcion],
      esActivo: [(!this.esInsert) ? obj.esActivo : { value: "true" , disabled: true }],
      numPlazosMensuales: [obj.numPlazosMensuales],
      retencion:[obj.retencion],
      suspension:[obj.suspension]

    });


    

  }

  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }

  ngAfterViewInit(): void {

    const datepipe = new DatePipe("es-MX");
    let diamaximo = datepipe.transform(new Date, "yyyy-MM-dd")
    this.fechaInicioDesctoComp.nativeElement.max = diamaximo;


  }

  public suscripciones() {
    this.myForm.value;

    this.myForm.controls.fechaInicioDescto.valueChanges.subscribe(valor => {
      this.fechaFinDescuento.nativeElement.min = valor;
    });

  }

  public validarFechaIniDesc(){

    this.myForm.controls.fechaFinDescuento.setValue("");

  }


   public validarConceptoDeduccion(concepto:any){
     
     
    this.submitEnviado = false;
    this.myForm.clearValidators();
    this.myForm.updateValueAndValidity();
    if( concepto === '006' || concepto === '012' || concepto === '020' ||
        concepto === '021' || concepto === '022' || concepto === '002' ||
        concepto === '107' || concepto === '013'
        ){
      this.myForm.controls.baseCalculoId.setValidators([Validators.required]);
      this.myForm.controls.valor.setValidators([Validators.required]);
      if(this.esInsert){
        this.myForm.controls.montoTotal.setValue('');
        this.myForm.controls.numeroCuotas.setValue('');
        this.myForm.controls.numeroFolio.setValue(''); 
        this.myForm.controls.numPlazosMensuales.setValue('');
        this.myForm.controls.tipoDescuentoInfonavitId.setValue('');
        this.myForm.controls.folioAvisoRetencion.setValue('');
        this.myForm.controls.fechaRecepcionAvisoRetencion.setValue('');
        this.myForm.controls.fechaInicioDescto.setValue('');
        this.myForm.controls.fechaRecepcionAvisoSuspension.setValue('');
        this.myForm.controls.fechaInicioDescto.setValue('');

      }    
          
      this.myForm.controls.montoTotal.setValidators([]);
      this.myForm.controls.montoTotal.updateValueAndValidity();
      this.myForm.controls.numeroCuotas.setValidators([]);
      this.myForm.controls.numeroCuotas.updateValueAndValidity();
        
      this.myForm.controls.numeroFolio.setValidators([]);
      this.myForm.controls.numeroFolio.updateValueAndValidity();
      this.myForm.controls.numPlazosMensuales.setValidators([]);
      this.myForm.controls.numPlazosMensuales.updateValueAndValidity();


      this.myForm.controls.tipoDescuentoInfonavitId.setValidators([]);
      this.myForm.controls.tipoDescuentoInfonavitId.updateValueAndValidity();
      this.myForm.controls.folioAvisoRetencion.setValidators([]);
      this.myForm.controls.folioAvisoRetencion.updateValueAndValidity();

      this.myForm.controls.fechaRecepcionAvisoRetencion.setValidators([]);
      this.myForm.controls.fechaRecepcionAvisoRetencion.updateValueAndValidity();

    } 
    if(concepto=='010'){
      
      this.myForm.controls.fechaRecepcionAvisoRetencion.setValidators([Validators.required]);
      this.myForm.controls.tipoDescuentoInfonavitId.setValidators([Validators.required]);
      this.myForm.controls.folioAvisoRetencion.setValidators([Validators.required]);

      if(this.esInsert){
        this.myForm.controls.baseCalculoId.setValue('');
        this.myForm.controls.montoTotal.setValue('');
        this.myForm.controls.numeroCuotas.setValue('');
        this.myForm.controls.numeroFolio.setValue('');
        this.myForm.controls.numPlazosMensuales.setValue('');

        this.myForm.controls.fechaRecepcionAvisoRetencion.setValue('');
        this.myForm.controls.fechaInicioDescto.setValue('');
        this.myForm.controls.fechaRecepcionAvisoSuspension.setValue('');
        this.myForm.controls.fechaInicioDescto.setValue('');
      }  
      this.myForm.controls.baseCalculoId.setValidators([]);
      this.myForm.controls.baseCalculoId.updateValueAndValidity();

      this.myForm.controls.montoTotal.setValidators([]);
      this.myForm.controls.montoTotal.updateValueAndValidity();
      this.myForm.controls.numeroCuotas.setValidators([]);
      this.myForm.controls.numeroCuotas.updateValueAndValidity();

      this.myForm.controls.numeroFolio.setValidators([]);
      this.myForm.controls.numeroFolio.updateValueAndValidity();
      this.myForm.controls.numPlazosMensuales.setValidators([]);
      this.myForm.controls.numPlazosMensuales.updateValueAndValidity();
      
      if(this.tipoDescuentoInfonavitId !== 0){
        this.validarNomMontoInfonavit(this.tipoDescuentoInfonavitId)
      }
      this.infonavit = true;
      this.submenu = true;
      this.numFolio = true;
      this.normalDeduccion = false;
      this.prestamo = false;
      this.credito = true;
      this.referencia = false;
      this.infonacot = false;
      this.pensionAlimenticia = false;

      if(this.myForm.get(['']))
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
      this.myForm.controls.baseCalculoId.setValidators([Validators.required]);
      this.myForm.controls.valor.setValidators([Validators.required]);
      this.myForm.controls.fechaRecepcionAvisoRetencion.setValidators([Validators.required]);

      if(this.esInsert){
        this.myForm.controls.tipoDescuentoInfonavitId.setValue('');
        this.myForm.controls.folioAvisoRetencion.setValue('');
        this.myForm.controls.montoTotal.setValue('');
        this.myForm.controls.numeroCuotas.setValue('');
        this.myForm.controls.numeroFolio.setValue('');
        this.myForm.controls.numPlazosMensuales.setValue('');
        this.myForm.controls.fechaRecepcionAvisoRetencion.setValue('');
        this.myForm.controls.fechaInicioDescto.setValue('');
        this.myForm.controls.fechaRecepcionAvisoSuspension.setValue('');
        this.myForm.controls.fechaInicioDescto.setValue('');
      }  

      this.myForm.controls.tipoDescuentoInfonavitId.setValidators([]);
      this.myForm.controls.tipoDescuentoInfonavitId.updateValueAndValidity();
      this.myForm.controls.folioAvisoRetencion.setValidators([]);
      this.myForm.controls.folioAvisoRetencion.updateValueAndValidity();

      this.myForm.controls.montoTotal.setValidators([]);
      this.myForm.controls.montoTotal.updateValueAndValidity();
      this.myForm.controls.numeroCuotas.setValidators([]);
      this.myForm.controls.numeroCuotas.updateValueAndValidity();

      this.myForm.controls.numeroFolio.setValidators([]);
      this.myForm.controls.numeroFolio.updateValueAndValidity();
      this.myForm.controls.numPlazosMensuales.setValidators([]);
      this.myForm.controls.numPlazosMensuales.updateValueAndValidity();
      
      this.submenu = true;
      this.pensionAlimenticia = true;
      this.normalDeduccion = true;
      this.numFolio = true;
      this.infonavit = false;
      this.deducPolitica = false;
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

      this.myForm.controls.montoTotal.setValidators([Validators.required]);
      this.myForm.controls.fechaRecepcionAvisoRetencion.setValidators([Validators.required]);
      this.myForm.controls.numeroCuotas.setValidators([Validators.required]);

      if(this.esInsert){
        this.myForm.controls.valor.setValue('');
        this.myForm.controls.tipoDescuentoInfonavitId.setValue('');
        this.myForm.controls.folioAvisoRetencion.setValue('');
        this.myForm.controls.baseCalculoId.setValue('');
        this.myForm.controls.numeroFolio.setValue('');
        this.myForm.controls.numPlazosMensuales.setValue('');

        this.myForm.controls.fechaRecepcionAvisoRetencion.setValue('');
        this.myForm.controls.fechaInicioDescto.setValue('');
        this.myForm.controls.fechaRecepcionAvisoSuspension.setValue('');
        this.myForm.controls.fechaInicioDescto.setValue('');
      }  

      this.myForm.controls.valor.setValidators([]);
      this.myForm.controls.valor.updateValueAndValidity();
      this.myForm.controls.tipoDescuentoInfonavitId.setValidators([]);
      this.myForm.controls.tipoDescuentoInfonavitId.updateValueAndValidity();
      this.myForm.controls.folioAvisoRetencion.setValidators([]);
      this.myForm.controls.folioAvisoRetencion.updateValueAndValidity();

      this.myForm.controls.baseCalculoId.setValidators([]);
      this.myForm.controls.baseCalculoId.updateValueAndValidity();

      this.myForm.controls.numeroFolio.setValidators([]);
      this.myForm.controls.numeroFolio.updateValueAndValidity();
      this.myForm.controls.numPlazosMensuales.setValidators([]);
      this.myForm.controls.numPlazosMensuales.updateValueAndValidity();
      

      if(this.politica !== undefined){
      
      this.myForm.controls.montoTotal.setValidators([]);
      this.myForm.controls.montoTotal.updateValueAndValidity();  
      this.myForm.controls.fechaRecepcionAvisoRetencion.setValidators([]);
      this.myForm.controls.fechaRecepcionAvisoRetencion.updateValueAndValidity();  
      this.myForm.controls.numeroCuotas.setValidators([]);
      this.myForm.controls.numeroCuotas.updateValueAndValidity();  

      this.infonavit = false;
      this.deducPolitica = true;
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

      }else{
      this.submenu = true;
      this.prestamo = true;
      this.normalDeduccion = false;
      this.numFolio = true;
      this.montopago = true;
      this.infonavit = false;
      this.deducPolitica = false;
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
      }

      if(this.esInsert){
      this.myForm.controls.montoTotal.setValue(""); 
      this.myForm.controls.numeroCuotas.setValue(""); 
      this.myForm.controls.valor.setValue("");
      }

      
    }
    else if(concepto=='011'){
      this.myForm.controls.numeroFolio.setValidators([Validators.required]);
      this.myForm.controls.montoTotal.setValidators([Validators.required]);
      this.myForm.controls.numPlazosMensuales.setValidators([Validators.required]);
      this.myForm.controls.valor.setValidators([Validators.required]);

      if(this.esInsert){

        this.myForm.controls.tipoDescuentoInfonavitId.setValue('');
        this.myForm.controls.folioAvisoRetencion.setValue('');
        this.myForm.controls.baseCalculoId.setValue('');
        this.myForm.controls.numeroCuotas.setValue('');

        this.myForm.controls.fechaRecepcionAvisoRetencion.setValue('');
        this.myForm.controls.fechaInicioDescto.setValue('');
        this.myForm.controls.fechaRecepcionAvisoSuspension.setValue('');
        this.myForm.controls.fechaInicioDescto.setValue('');
      }  
      this.myForm.controls.fechaRecepcionAvisoRetencion.setValidators([]);
      this.myForm.controls.fechaRecepcionAvisoRetencion.updateValueAndValidity();
      this.myForm.controls.tipoDescuentoInfonavitId.setValidators([]);
      this.myForm.controls.tipoDescuentoInfonavitId.updateValueAndValidity();
      this.myForm.controls.folioAvisoRetencion.setValidators([]);
      this.myForm.controls.folioAvisoRetencion.updateValueAndValidity();

      this.myForm.controls.baseCalculoId.setValidators([]);
      this.myForm.controls.baseCalculoId.updateValueAndValidity();
     
      this.myForm.controls.numeroCuotas.setValidators([]);
      this.myForm.controls.numeroCuotas.updateValueAndValidity();  


      this.submenu = true;
      this.infonacot = true;
      this.normalDeduccion = true;
      this.numFolio = false;
      this.infonavit = false;
      this.deducPolitica = false;
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
      if(this.politica !== undefined){
      this.infonavit = false;
      this.deducPolitica = true;
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
      }else{

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
      }

      if(this.esInsert){
      this.myForm.controls.baseCalculoId.setValue("");
      this.myForm.controls.montoTotal.setValue(""); 
      this.myForm.controls.numeroCuotas.setValue(""); 
      this.myForm.controls.valor.setValue("");
      }
      
    }
    if(this.esInsert ){
      
    for(let item of this.obtenerPercepcion){
      if(concepto == item.tipoDeduccionId.tipoDeduccionId){
          this.conceptodeduccion= item.conceptoDeduccionId;
      }
    }
    }
    else if(!this.esInsert && this.cambioEstatus == false){
      
    for(let item of this.obtenerPercepcion){
      if(concepto == item.tipoDeduccionId.tipoDeduccionId){
          this.conceptodeduccion= item.conceptoDeduccionId;
      }
    }
    }
    else{
      this.conceptodeduccion = this.datos.conceptoDeduccionId?.conceptoDeduccionId;
      this.cambioEstatus = false;
    }
   }

   public validarMontoTotal(monto:any){
    
      this.monto = this.myForm.value.montoTotal;
      if(this.monto != null && this.numPeriodo != null){
        this.bancosPrd.getObtenerMontoPercepcion(this.monto, this.numPeriodo).subscribe(datos =>{
          this.montoPercepcion = datos.datos;
          var monto = this.montoPercepcion.toFixed(4); 
          this.myForm.controls.valor.setValue(monto);
        });

      }
   }

   public validarNumeroCuotas(cuotas:any){
    
    this.numPeriodo = cuotas;
    if(this.monto != null && this.numPeriodo != null){
      this.bancosPrd.getObtenerMontoPercepcion(this.monto, this.numPeriodo).subscribe(datos =>{
        this.montoPercepcion = datos.datos;
        var monto = this.montoPercepcion.toFixed(4); 
        this.myForm.controls.valor.setValue(monto);
      });
        
    }
   }

   public validarNomMonto(tipomonto:any){
    
      if(tipomonto == 2){
        this.tipoValor = "Monto";
        this.porcentual = false;
        this.fijo = true;
      }else {
        this.tipoValor = "Porcentaje"
        this.porcentual = true;
        this.fijo = false;
      }

   }

   public validarNomMontoInfonavit(tipomonto:any){
    
      if(tipomonto == 1){
        this.tipoValor = "Monto"
        this.porcentual = false;
        this.fijo = true;
        this.valorDescuento = false;
        this.valor = true;

        this.myForm.controls.valor.setValidators([Validators.required]);
        this.myForm.controls.valor.updateValueAndValidity();
        this.myForm.controls.interesPorcentaje.setValidators([]);
        this.myForm.controls.interesPorcentaje.updateValueAndValidity();
        this.myForm.controls.interesPorcentaje.setValue('');

      }
      else if(tipomonto == 2){
        this.tipoValor = "Porcentaje";
        this.porcentual = true;
        this.fijo = false;
        this.valorDescuento = false;
        this.valor = true;
        this.myForm.controls.valor.setValidators([Validators.required]);
        this.myForm.controls.valor.updateValueAndValidity();
        this.myForm.controls.interesPorcentaje.setValue('');
        this.myForm.controls.interesPorcentaje.setValidators([]);
        this.myForm.controls.interesPorcentaje.updateValueAndValidity();
      }
      else if(tipomonto == 3){
        if(this.tipoDescuentoInfonavitId !== undefined){
        this.valorDescuento = true;
        this.valor = false;
        this.porcentual = false;
        this.fijo = false;
        this.myForm.controls.valor.setValidators([]);
        this.myForm.controls.valor.updateValueAndValidity();
          
        }else{

          this.valorDescuento = true;
          this.valor = false;
          this.myForm.controls.interesPorcentaje.setValidators([Validators.required]);
          this.myForm.controls.interesPorcentaje.updateValueAndValidity();
          this.myForm.controls.valor.setValidators([]);
          this.myForm.controls.valor.updateValueAndValidity();
          this.myForm.controls.valor.setValue('');
        }
        
      }else{
        this.tipoValor = "Monto"
        this.porcentual = false;
        this.fijo = true;
        this.valorDescuento = false;
        this.valor = true;

        this.myForm.controls.valor.setValidators([Validators.required]);
        this.myForm.controls.valor.updateValueAndValidity();
        this.myForm.controls.interesPorcentaje.setValidators([]);
        this.myForm.controls.interesPorcentaje.updateValueAndValidity();

      }

   }
   public abrirSuspension() {

    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf" ;

    input.click();

    input.onchange = () => {
      let imagenInput: any = input.files;
      this.inputdocsusp.nativeElement.value = imagenInput![0].name;
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
          this.nombresuspension = this.inputdocsusp.nativeElement.value;
          //this.myForm.controls.nombre.setValue(this.inputdocsusp.nativeElement.value);
          this.myForm.controls.suspension.setValue(this.arrayBufferToBase64(datos));
        });


      }
    }
  }
   public abrirReteencion() {

    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf" ;

    input.click();

    input.onchange = () => {
      let imagenInput: any = input.files;
      this.inputdoc.nativeElement.value = imagenInput![0].name;
      for (let item in Object.getOwnPropertyNames(imagenInput)) {

        let archivo: File = imagenInput[item];

        archivo.arrayBuffer().then(datos => {
          this.nombreretencion = this.inputdoc.nativeElement.value;
          //this.myForm.controls.nombre.setValue(this.inputdoc.nativeElement.value);
          this.myForm.controls.retencion.setValue(this.arrayBufferToBase64(datos));
        });


      }
    }
  }

  public arrayBufferToBase64(buffer: any) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
 

  public enviarPeticion(){
    
    console.log('myForm', this.myForm.value)
    this.submitEnviado = true;
    this.myForm.updateValueAndValidity();
    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;

    }

    let mensaje = this.esInsert ? "¿Deseas registrar la deducción" : "¿Deseas actualizar la deducción?";
    
      this.modalPrd.showMessageDialog(this.modalPrd.warning,mensaje).then(valor =>{
        if(valor){
          debugger;
          let  obj = this.myForm.getRawValue();
          

          let fechaIniDesc = "";
          if (obj.fechaInicioDescto != undefined || obj.fechaInicioDescto != null) {
      
            if (obj.fechaInicioDescto != "") {
      
              const fecha1 = new Date(obj.fechaInicioDescto).toUTCString().replace("GMT", "");
              fechaIniDesc = `${new Date(fecha1).getTime()}`;
            }
          }
          let fechaFinDesc = "";
          if (obj.fechaFinDescuento != undefined || obj.fechaFinDescuento != null) {
      
            if (obj.fechaFinDescuento != "") {
      
              const fecha1 = new Date(obj.fechaFinDescuento).toUTCString().replace("GMT", "");
              fechaFinDesc = `${new Date(fecha1).getTime()}`;
            }
          }
          let fechaRecepAviRetencion = "";
          if (obj.fechaRecepcionAvisoRetencion != undefined || obj.fechaRecepcionAvisoRetencion != null) {
      
            if (obj.fechaRecepcionAvisoRetencion != "") {
      
              const fecha1 = new Date(obj.fechaRecepcionAvisoRetencion).toUTCString().replace("GMT", "");
              fechaRecepAviRetencion = `${new Date(fecha1).getTime()}`;
            }
          }
          let fechaRecAviSuspension = "";
          if (obj.fechaRecepcionAvisoSuspension != undefined || obj.fechaRecepcionAvisoSuspension != null) {
      
            if (obj.fechaRecepcionAvisoSuspension != "") {
      
              const fecha1 = new Date(obj.fechaRecepcionAvisoSuspension).toUTCString().replace("GMT", "");
              fechaRecAviSuspension = `${new Date(fecha1).getTime()}`;
            }
          }
          
          if(this.esInsert){
          if(this.politica !== undefined){
          this.objEnviar = {
            tipoDeduccionId: {
              tipoDeduccionId: obj.nomDeduccion
            },
            conceptoDeduccionId: {
              conceptoDeduccionId: this.conceptodeduccion
            },
            politicaId: {
              politicaId: this.politica
            },
               
            centrocClienteId: {
              centrocClienteId: this.empresa
              },
              
            baseCalculoId: {
              baseCalculoId: obj.baseCalculoId
            },
            valor: obj.valor,
            fechaInicioDescto: fechaIniDesc,
            numeroFolio: obj.numeroFolio,
            montoTotal: obj.montoTotal,
            numeroCuotas: obj.numeroCuotas,
            interesPorcentaje: obj.interesPorcentaje,
            fechaFinDescuento: fechaFinDesc,
            folioAvisoRetencion: obj.folioAvisoRetencion,
            fechaRecepcionAvisoRetencion: fechaRecepAviRetencion,
            folioAvisoSuspension: obj.folioAvisoSuspension,
            fechaRecepcionAvisoSuspension: fechaRecAviSuspension,
            esActivo: obj.esActivo,
            numPlazosMensuales:obj.numPlazosMensuales,
            tipoDescuentoInfonavitId: {
             tipoDescuentoInfonavitId: obj.tipoDescuentoInfonavitId
            }
          };
        }else{
          
          this.objEnviar = {
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
            fechaInicioDescto: fechaIniDesc,
            numeroFolio: obj.numeroFolio,
            montoTotal: obj.montoTotal,
            numeroCuotas: obj.numeroCuotas,
            interesPorcentaje: obj.interesPorcentaje,
            fechaFinDescuento: fechaFinDesc,
            folioAvisoRetencion: obj.folioAvisoRetencion,
            fechaRecepcionAvisoRetencion: fechaRecepAviRetencion,
            folioAvisoSuspension: obj.folioAvisoSuspension,
            fechaRecepcionAvisoSuspension: fechaRecAviSuspension,
            esActivo: obj.esActivo,
            nombreretencion: this.nombreretencion,
            nombresuspension: this.nombresuspension,
            docsupension: obj.suspension,
            docretencion: obj.retencion,
            numPlazosMensuales:obj.numPlazosMensuales,
            tipoDescuentoInfonavitId: {
             tipoDescuentoInfonavitId: obj.tipoDescuentoInfonavitId
            }
          };
        }
        }else{
          if(obj.baseCalculoId == null){
            obj.baseCalculoId = 2;
          }
          if(obj.tipoDescuentoInfonavitId == null){
            obj.tipoDescuentoInfonavitId = obj.baseCalculoId;
          }
          if(this.politica !== undefined){
          this.objEnviar = {
            configuraDeduccionId: this.datos.configuraDeduccionId,
            tipoDeduccionId: {
              tipoDeduccionId: obj.nomDeduccion
            },
            conceptoDeduccionId: {
              conceptoDeduccionId: this.conceptodeduccion
            },
            politicaId: {
              politicaId: this.politica
            },
                 
            centrocClienteId: {
              centrocClienteId: this.empresa
              },
              
            baseCalculoId: {
              baseCalculoId: obj.baseCalculoId
            },
            valor: obj.valor,
            fechaInicioDescto: fechaIniDesc,
            numeroFolio: obj.numeroFolio,
            montoTotal: obj.montoTotal,
            numeroCuotas: obj.numeroCuotas,
            interesPorcentaje: obj.interesPorcentaje,
            fechaFinDescuento: fechaFinDesc,
            folioAvisoRetencion: obj.folioAvisoRetencion,
            fechaRecepcionAvisoRetencion: fechaRecepAviRetencion,
            folioAvisoSuspension: obj.folioAvisoSuspension,
            fechaRecepcionAvisoSuspension: fechaRecAviSuspension,
            esActivo: obj.esActivo,
            numPlazosMensuales:obj.numPlazosMensuales,
            tipoDescuentoInfonavitId: {
             tipoDescuentoInfonavitId: obj.tipoDescuentoInfonavitId
            }
          };
        }else{
          
          this.objEnviar = {
            configuraDeduccionId: this.datos.configuraDeduccionId,
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
            fechaInicioDescto: fechaIniDesc,
            numeroFolio: obj.numeroFolio,
            montoTotal: obj.montoTotal,
            numeroCuotas: obj.numeroCuotas,
            interesPorcentaje: obj.interesPorcentaje,
            fechaFinDescuento: fechaFinDesc,
            folioAvisoRetencion: obj.folioAvisoRetencion,
            fechaRecepcionAvisoRetencion: fechaRecepAviRetencion,
            folioAvisoSuspension: obj.folioAvisoSuspension,
            fechaRecepcionAvisoSuspension: fechaRecAviSuspension,
            esActivo: obj.esActivo,
            nombreretencion: this.nombreretencion,
            nombresuspension: this.nombresuspension,
            docsupension: obj.suspension,
            docretencion: obj.retencion,
            numPlazosMensuales:obj.numPlazosMensuales,
            tipoDescuentoInfonavitId: {
             tipoDescuentoInfonavitId: obj.tipoDescuentoInfonavitId
            }
          };

        }
          

        }
        console.log('this.objEnviar',this.objEnviar)
          this.salida.emit({type:"guardar",datos:this.objEnviar});
        }
      });
  }

  public get f(){
    return this.myForm.controls;
  }


}
