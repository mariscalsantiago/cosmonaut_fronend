import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { AdminCatalogosService } from '../../services/admincatalogos.service';
import { truncate } from 'fs';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';


@Component({
  selector: 'app-abc-admincatalogos',
  templateUrl: './abc-admincatalogos.component.html',
  styleUrls: ['./abc-admincatalogos.component.scss']
})
export class ABCAdminCatalogosComponent implements OnInit {
  @ViewChild("fechaFin") fechaFinRef!: ElementRef;
  //@ViewChild("fechaInicio") fechaInicioRef!: ElementRef;

  public cargando: Boolean = false;
  public tipoguardad: boolean = false;
  public myForm!: FormGroup;

  public arreglo: any = [];
  public arregloCompany: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;
  public insertar: boolean= false;
  public detCatalogos: any = [];
  public activaClave : boolean= false;
  public inactivaClave : boolean= false;
  public submitEnviado:boolean = false;
  public banco: boolean = false;
  public idCatalogo: number = 0;
  public descripcion: string = "";
  public habilitarbanco: boolean = false;
  public razonBanco: boolean = false;
  public regimen: boolean = false;
  public persona:string = "";
  public percepcion: boolean = false;
  public descripcionGeneral:boolean= true;
  public referencia: boolean = false;
  public arregloTablaValores: any = [];
  public editField: string = "";
  public editFieldNum: Number = 0;
  public tablaISR: boolean = false;
  public formGeneral: boolean = true;
  public subsidioISR: boolean = false;
  public objEnviar: any = [];
  public objdetrep: any = [];
  public indPersonaFisica: boolean = false;
  public indPersonaMoral: boolean = false;
  public arregloValoresReferencia: any = [];
  public valores: any = [];
  public valorestab : any =[];
  public nuevatablaISR : boolean = false;
  public arregloPeriodicidad : any = [];
  public nuevatablaSubsidio : boolean = false;
  public aplicableISN : boolean = false;
  public nuevoaplicableISN : boolean = false;
  public submitActive = false;
  public periodo:string = "";
  public estado:string = "";
  public especializacion = '';
  public fechaAlta: number = 0;
  public activaClaveCuatro : boolean = false;
  public activaClaveDos : boolean = false;
  public activaClaveNumerica: boolean = false;
  public todayF : string = '';
  public valFecha : boolean = true;
  public catEstatus : boolean = true;
  public id_catalogo : string = '';

  public modulo: string = "";
  public subModulo: string = "";

  public arreglotabla: any = {
    columnas: [],
    filas: []
  };



  constructor(private routerPrd: Router, private adminCatalogosPrd: AdminCatalogosService,
    private routerActivePrd: ActivatedRoute, private modalPrd: ModalService, private formBuilder: FormBuilder,
    public configuracionPrd:ConfiguracionesService) { 

      this.routerActivePrd.params.subscribe(datos => {
        this.insertar = (datos["tipoinsert"] == 'nuevo');
  
      });
    }

  ngOnInit(): void {

    
    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();
    this.periodo = "";
    
    this.detCatalogos = history.state.datos == undefined ? {} : history.state.datos;
    this.objdetrep = history.state.data == undefined ? {} : history.state.data;

    this.objdetrep = {
      ...this.objdetrep,
      esActivo: this.objdetrep.esActivo,
      tipoPersona: this.objdetrep.indPersonaFisica
    };
    if(this.detCatalogos.listaCatalogosId == 1){
        this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
        this.catBanco();
        this.idCatalogo = this.objdetrep.codBanco;
        this.descripcion = this.objdetrep.nombreCorto;
        
    }

    else if(this.detCatalogos.listaCatalogosId == 13){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.facultadPoderId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 9){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.motivoBajaId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 12){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 11){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 21){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      
      this.idCatalogo = this.objdetrep.proveedorDispersionId;
      this.descripcion = this.objdetrep.descripcion;
      if(this.objdetrep.fechaAlta){
        this.fechaAlta = this.objdetrep.fechaAlta;
      }else{
        var fechaFC = new Date();
        this.fechaAlta = new Date((new Date(fechaFC).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
      }
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 22){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.proveedorTimbradoId;
      this.descripcion = this.objdetrep.descripcion;
      if(this.objdetrep.fechaAlta){
        this.fechaAlta = this.objdetrep.fechaAlta;
      }else{
        var fechaFC = new Date();
        this.fechaAlta = new Date((new Date(fechaFC).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
        
      }
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 8){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.tipoRegimenContratacionId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 6){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      if (this.objdetrep.fecInicio != undefined || this.objdetrep.fecInicio != null) {
          this.objdetrep.fecInicio = new DatePipe("es-MX").transform((this.objdetrep.fecInicio), 'yyyy-MM-dd');
      }
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.objdetrep.tipoPersona = this.objdetrep.indPersonaFisica == true  ?"indPersonaFisica":"indPersonaMoral";
      this.objdetrep.esActivo = this.objdetrep.activo;

      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 7){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.tipoContratoId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 5){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.tipoDeduccionId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 10){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.tipoIncapacidadId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 4){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.objdetrep.integraSdi = this.objdetrep.integraSdi == "S"  ? true : false;
      this.objdetrep.integraIsr = this.objdetrep.integraIsr == "S"  ? true : false;
      this.objdetrep.integraIsn = this.objdetrep.integraIsn == "S"  ? true : false;
      
      if(this.objdetrep.fechaInicio){
        //this.objdetrep.fechaInicio = new DatePipe("es-MX").transform((this.objdetrep.fechaInicio), 'yyyy-MM-dd');
        this.objdetrep.fechaInicio = this.objdetrep.fechaInicio;
      }else{
        var fechaI = new Date();
        this.objdetrep.fechaInicio = new Date((new Date(fechaI).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
      }
      this.idCatalogo = this.objdetrep.tipoPercepcionId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 15){
      
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.tipoValorReferenciaId?.descripcion;
      this.adminCatalogosPrd.getListaTipoValorReferencia(true).subscribe(datos => this.arregloValoresReferencia = datos.datos);
      if(this.objdetrep.fechaInicio != undefined || this.objdetrep.fechaFin != undefined){
      this.objdetrep.fechaInicio = new DatePipe("es-MX").transform((this.objdetrep.fechaInicio), 'yyyy-MM-dd');
      this.objdetrep.fechaFin = new DatePipe("es-MX").transform((this.objdetrep.fechaFin), 'yyyy-MM-dd'); 
      }
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 17){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.periodo = this.objdetrep.tabla;
      this.adminCatalogosPrd.getListaTarifaISR(this.objdetrep.periodo).subscribe(datos => {
        if (datos.datos !== undefined) {
          for (let item of datos.datos) {
            
            item.fechaInicio = new DatePipe("es-MX").transform((item.fechaInicio), 'yyyy-MM-dd');
            item.fechaFin = new DatePipe("es-MX").transform((item.fechaFin), 'yyyy-MM-dd');
           }
        }
        this.arregloTablaValores = datos.datos;
      });
      this.adminCatalogosPrd.getListatablasPeriodicasISR().subscribe(datos => this.arregloPeriodicidad = datos.datos);
      this.clave();

     
    }
    else if(this.detCatalogos.listaCatalogosId == 18){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.periodo = this.objdetrep.tabla;
      this.adminCatalogosPrd.getListaSubcidioISR(this.objdetrep.periodo).subscribe(datos => {
    
        if (datos.datos !== undefined) {
          for (let item of datos.datos) {
            item["fechaInicio"] = new DatePipe("es-MX").transform((item.fechaInicio), 'yyyy-MM-dd');
            item["fechaFin"] = new DatePipe("es-MX").transform((item.fechaFin), 'yyyy-MM-dd');
          }
        }

        this.arregloTablaValores = datos.datos;
      });
      this.adminCatalogosPrd.getListaTablasSubsidioISR().subscribe(datos => this.arregloPeriodicidad = datos.datos);
      this.clave();


    }
    else if(this.detCatalogos.listaCatalogosId == 19){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.descripcion = this.objdetrep.estado;
      this.estado = this.objdetrep.estado;
      if(this.objdetrep.estadoId !== undefined){
      this.adminCatalogosPrd.getListaAplicableISN(this.objdetrep.estadoId).subscribe(datos => {
         if (datos.datos !== undefined) {
           for (let item of datos.datos) {
            if (item.fechaInicio != undefined || item.fechaInicio != null) {
                item.fechaInicio = new DatePipe("es-MX").transform((item.fechaInicio), 'yyyy-MM-dd');
              }
             
           }
         }
        this.arregloTablaValores = datos.datos
      });
      }
      this.adminCatalogosPrd.getListaEstadosISN().subscribe(datos => this.arregloPeriodicidad = datos.datos);
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 2){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 14){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 20){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 3){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();

    }
    else if(this.detCatalogos.listaCatalogosId == 16){
      this.id_catalogo = this.detCatalogos.descripcion?.toUpperCase();
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;


    this.myForm = this.createForm((this.objdetrep));
    this.validaForm();
    


  }


  public createForm(obj: any) {
    

    const pipe = new DatePipe("es-MX");
    return this.formBuilder.group({

      clave: [this.idCatalogo],
      fecInicio: [obj.fecInicio],
      codBanco: [this.idCatalogo],
      integraSdi: [obj.integraSdi],
      integraIsr: [obj.integraIsr],
      integraIsn: [obj.integraIsn],
      porDefecto: [obj.porDefecto],
      valor: [obj.valor],
      fechaInicio: [obj.fechaInicio], 
      fechaFin: [obj.fechaFin],
      tipoConcepto: [obj.tipoConcepto],
      //especializacion: [obj.especializacion],
      tipoPeriodicidad: [obj.tipoPeriodicidad],
      razonSocial: [obj.razonSocial],
      limiteInferior:[obj.limiteInferior],
      limiteSuperior:[obj.limiteSuperior],
      cuotaFija:[obj.cuotaFija],
      PeriodicidadPago:[],
      montoSubsidio:[],
      tasa:[],
      referenciaMarcoJuridico:[],
      porcExcedenteLimInf:[obj.porcExcedenteLimInf],
      valorReferencia: [this.objdetrep.tipoValorReferenciaId?.tipoValorReferenciaId],
      tipoPersona: [obj.tipoPersona],
      nombreCorto: [this.descripcion,Validators.required],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }],


    });
  }

  public validaReferencia(){

    if(this.detCatalogos.listaCatalogosId == 15){

      if(this.objdetrep.tipoValorReferenciaId?.descripcion !== undefined){
        let valorRefInvalid = false;
        this.adminCatalogosPrd.getListaTipoValorReferencia(true).subscribe(datos =>{
            this.arregloValoresReferencia = datos.datos
            for(let item of this.arregloValoresReferencia ){
              if(item.descripcion === this.objdetrep.tipoValorReferenciaId?.descripcion){
                valorRefInvalid = true;
              }
            }
            if(valorRefInvalid == false){
                this.myForm.controls.valorReferencia.setValue('');
                this.myForm.controls.valorReferencia.updateValueAndValidity();
                this.myForm.controls.valorReferencia.invalid;
            }

        });
        
      }
    }

  }


  ngAfterViewInit(): void {

    const datepipe = new DatePipe("es-MX");
    let diamaximo = datepipe.transform(new Date, "yyyy-MM-dd")
    //this.fechaInicioRef.nativeElement.max = diamaximo;
    //this.fechaFinRef.nativeElement.max = diamaximo;


  }

  public validarfechaFinRef() {
    
    let fechaInicio = this.myForm.controls.fechaInicio.value;
    this.fechaFinRef.nativeElement.min = fechaInicio;
    this.myForm.controls.fechaFin.setValue("");
  }  

  public validaForm(){
    

    if(this.detCatalogos.listaCatalogosId == 1){
      this.myForm.controls.codBanco.setValidators([Validators.required]);
      this.myForm.controls.razonSocial.setValidators([Validators.required]);
      this.myForm.controls.clave.setValidators([]);
      this.myForm.controls.clave.updateValueAndValidity();
      
  }
  else if(this.detCatalogos.listaCatalogosId == 13){
    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 9){
    //this.myForm.controls.clave.setValidators([Validators.required]);
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 12){
    this.myForm.controls.clave.setValidators([Validators.required]);
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 11){
    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 21){
    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 22){
    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 8){
    this.myForm.controls.clave.setValidators([Validators.required]);
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 6){
    this.myForm.controls.clave.setValidators([Validators.required]);
    this.myForm.controls.fecInicio.setValidators([Validators.required]);
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 7){
    this.myForm.controls.clave.setValidators([Validators.required]);
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 5){
    this.myForm.controls.clave.setValidators([Validators.required]);
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 10){
    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 4){
    //if(!this.insertar){
      //this.myForm.controls.especializacion.disable();
    //} 
    this.myForm.controls.clave.setValidators([Validators.required]);
    this.myForm.controls.tipoConcepto.setValidators([Validators.required]);
    //this.myForm.controls.especializacion.setValidators([Validators.required]);
    this.myForm.controls.tipoPeriodicidad.setValidators([Validators.required]);
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 15){
    this.myForm.controls.valorReferencia.setValidators([Validators.required]);
    this.myForm.controls.valor.setValidators([Validators.required]);
    this.myForm.controls.fechaInicio.setValidators([Validators.required]);
    this.myForm.controls.fechaFin.setValidators([Validators.required]);
    this.myForm.controls.nombreCorto.setValidators([]);
    this.myForm.controls.nombreCorto.updateValueAndValidity();

    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
    this.validaReferencia();
  }
  else if(this.detCatalogos.listaCatalogosId == 17){
    this.myForm.controls.PeriodicidadPago.setValidators([Validators.required]);
    this.myForm.controls.limiteInferior.setValidators([Validators.required]);
    this.myForm.controls.limiteSuperior.setValidators([Validators.required]);
    this.myForm.controls.cuotaFija.setValidators([Validators.required]);
    this.myForm.controls.porcExcedenteLimInf.setValidators([Validators.required, Validators.pattern(/^[0-9]{1,2}([.][0-9]{1,2})?$/)]); 
    this.myForm.controls.fechaInicio.setValidators([Validators.required]);
    this.myForm.controls.fechaFin.setValidators([Validators.required]);
    this.myForm.controls.nombreCorto.setValidators([]);
    this.myForm.controls.nombreCorto.updateValueAndValidity();

    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
   
  }
  else if(this.detCatalogos.listaCatalogosId == 18){
    this.myForm.controls.PeriodicidadPago.setValidators([Validators.required]);
    this.myForm.controls.limiteInferior.setValidators([Validators.required]);
    this.myForm.controls.limiteSuperior.setValidators([Validators.required]);
    this.myForm.controls.montoSubsidio.setValidators([Validators.required]);
    this.myForm.controls.fechaInicio.setValidators([Validators.required]);
    this.myForm.controls.fechaFin.setValidators([Validators.required]);
    this.myForm.controls.nombreCorto.setValidators([]);
    this.myForm.controls.nombreCorto.updateValueAndValidity();

    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 19){
    this.myForm.controls.PeriodicidadPago.setValidators([Validators.required]);
    this.myForm.controls.limiteInferior.setValidators([Validators.required]);
    this.myForm.controls.limiteSuperior.setValidators([Validators.required]);
    this.myForm.controls.cuotaFija.setValidators([Validators.required]);
    this.myForm.controls.tasa.setValidators([Validators.required]);
    this.myForm.controls.referenciaMarcoJuridico.setValidators([Validators.required]);
    this.myForm.controls.fechaInicio.setValidators([Validators.required]);
    this.myForm.controls.nombreCorto.setValidators([]);
    this.myForm.controls.nombreCorto.updateValueAndValidity();


    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 2){
    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 14){
    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }

  else if(this.detCatalogos.listaCatalogosId == 20){
    //this.myForm.controls.clave.setValidators([Validators.required]);
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 3){
    //this.myForm.controls.clave.setValidators([Validators.required]);
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }
  else if(this.detCatalogos.listaCatalogosId == 16){
    this.myForm.controls.clave.setValidators([]);
    this.myForm.controls.clave.updateValueAndValidity();
    this.myForm.controls.codBanco.setValidators([]);
    this.myForm.controls.codBanco.updateValueAndValidity();
    this.myForm.controls.razonSocial.setValidators([]);
    this.myForm.controls.razonSocial.updateValueAndValidity();
  }

  }

  public updateList(id: number, property: string, event: any) {
    
    let editField = event.target.textContent; 

    if (property.includes('cuotaFija')){

      this.editFieldNum = Number(editField);
    } 
    
    if (property.includes('limiteInferior')){
      
      this.editFieldNum = Number(editField);

      let limites = this.arregloTablaValores[id];
      let limiteSuperior = limites.limiteSuperior;
      if (this.editFieldNum > limiteSuperior) {
  
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'El límite inferior debe ser igual o menor que el límite superior')
          .then(() => {
            this.arregloTablaValores[id][property] = this.editFieldNum;
            this.valFecha = false;
          });
        return;  
      }
    } 

    if (property.includes('limiteSuperior')){
      
      this.editFieldNum = Number(editField);

      let limites = this.arregloTablaValores[id];
      let limiteInferior = limites.limiteInferior;
      if (this.editFieldNum < limiteInferior) {
  
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'El límite superior debe ser igual o mayor que el límite inferior')
          .then(() => {
            this.arregloTablaValores[id][property] = this.editFieldNum;
            this.valFecha = false;
          });
        return;  
      }
    }
    if (property.includes('montoSubsidio')){ 
      this.editFieldNum = Number(editField);
    }

    if (property.includes('porcExcedenteLimInf')){ 
      this.editFieldNum = Number(editField);
    }

    if (property.includes('tasa')){ 
      this.editFieldNum = Number(editField);
    }   

    if (property.includes('fecha')){
     editField = event.target.value;

    let itemFecha = this.arregloTablaValores[id];
    if(itemFecha.fechaFin !== undefined){
    let fechaIn = itemFecha.fechaInicio;
    let fechaFin = itemFecha.fechaFin; 
    if(property === 'fechaFin' ){
        fechaFin = editField;
        if (fechaFin < fechaIn) {
  
          this.modalPrd.showMessageDialog(this.modalPrd.error, 'La fecha fin debe ser igual o mayor a la fecha inicio')
            .then(() => {
              editField= '';
              this.arregloTablaValores[id][property] = editField;
              this.valFecha = false;
            });
          return;  
        }else{   
          this.arregloTablaValores[id][property] = editField;
          this.valFecha = true;
          }
    }
    if(property === 'fechaInicio' ){
      fechaIn = editField;
      if (fechaIn > fechaFin) {
  
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'La fecha inicio debe ser igual o menor a la fecha fin')
          .then(() => {
            editField= '';
            this.arregloTablaValores[id][property] = editField;
            this.valFecha = false;
          });
        return;  
      }
      else{   
        this.arregloTablaValores[id][property] = editField;
        this.valFecha = true;
        }
    }
        if (fechaIn === '' || fechaFin === '') {
          this.valFecha = false;
          return;
        }
    }
  }

    if(this.editFieldNum !== 0){
      editField = this.editFieldNum;
      this.arregloTablaValores[id][property] = editField;
      this.valFecha = true;
      this.editFieldNum = 0;
    }else{
      this.arregloTablaValores[id][property] = editField;
      this.valFecha = true;
    }
       

    
  }


  public changeValue(id: number, property: string, event: any) {
    
    this.editField = event.target.textContent;
    if (property.includes('fecha')){
      this.editField = event.target.value;
     }

     if (property.includes('cuotaFija')){
      Number(this.editField);
    }
    if (property.includes('limiteInferior')){
      Number(this.editField);
    } 

    if (property.includes('limiteSuperior')){
      Number(this.editField);
    }
    if (property.includes('montoSubsidio')){
      Number(this.editField);
    }
    if (property.includes('porcExcedenteLimInf')){ 
      Number(this.editField);
    }   
    if (property.includes('tasa')){ 
      Number(this.editField);
    }   
  }

  public clave(){
    if(this.insertar){
      if(this.detCatalogos.listaCatalogosId == 6){
        this.activaClaveNumerica = true;
        this.regimen = true;
      }
/*       else if(this.detCatalogos.listaCatalogosId == 9){
        this.activaClaveCuatro = true;
      } */
      else if(this.detCatalogos.listaCatalogosId == 4){
        this.activaClaveNumerica = true;
        this.percepcion = true;
      }
      else if(this.detCatalogos.listaCatalogosId == 5){
        this.activaClaveNumerica = true;
      }
      else if(this.detCatalogos.listaCatalogosId == 15){
        this.referencia = true;
        this.descripcionGeneral = false;
      }
      else if(this.detCatalogos.listaCatalogosId == 17){
        this.descripcionGeneral = false;
        this.formGeneral = true;
        this.nuevatablaISR = true;

      }
      else if(this.detCatalogos.listaCatalogosId == 18){
        this.descripcionGeneral = false;
        this.formGeneral = true;
        this.nuevatablaSubsidio = true;

      }
      else if(this.detCatalogos.listaCatalogosId == 19){
        this.descripcionGeneral = false;
        this.formGeneral = true;
        this.nuevoaplicableISN = true;

      }
      else if(this.detCatalogos.listaCatalogosId == 21 || this.detCatalogos.listaCatalogosId == 22){
        this.catEstatus = false;
      }
      else if(this.detCatalogos.listaCatalogosId == 9 || this.detCatalogos.listaCatalogosId == 3 || this.detCatalogos.listaCatalogosId == 14 || this.detCatalogos.listaCatalogosId == 20 || this.detCatalogos.listaCatalogosId == 13 || this.detCatalogos.listaCatalogosId == 2 || this.detCatalogos.listaCatalogosId == 11 || this.detCatalogos.listaCatalogosId == 10 || this.detCatalogos.listaCatalogosId == 16){

      }
      else{
        this.activaClaveDos = true;
      }
      
    }else{
      if(this.detCatalogos.listaCatalogosId == 6){
        this.inactivaClave = true;
        this.regimen = true;
      }
      else if (this.detCatalogos.listaCatalogosId == 4){

        this.inactivaClave = true;
        this.percepcion = true;
      }
      else if(this.detCatalogos.listaCatalogosId == 15){
        this.catEstatus = true;
        this.referencia = true;
        this.descripcionGeneral = false;
      }
      else if(this.detCatalogos.listaCatalogosId == 17){
        this.descripcionGeneral = false;
        this.formGeneral = false;
        this.tablaISR = true;
        
      }
      else if(this.detCatalogos.listaCatalogosId == 18){
        this.descripcionGeneral = false;
        this.formGeneral = false;
        this.subsidioISR = true;
      }
      else if(this.detCatalogos.listaCatalogosId == 19){
        this.descripcionGeneral = false;
        this.formGeneral = false;
        this.aplicableISN = true;
      }
      else{
        this.inactivaClave = true;
      }
    }

  }

  public cancelar() {
    
    this.routerPrd.navigate(['/admincatalogos']);
  }

  public catBanco(){
    if(this.insertar){
      this.habilitarbanco = true;
      this.razonBanco = true;
      }else{
      this.banco = true;
      this.razonBanco = true;
    }

  }

  public redirect(obj: any) {
    
    this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
  }

  public validaFechaFinal(): Boolean{
    
    let respuesta: boolean = true;
    let fechaInicioP = this.myForm.controls.fechaInicio.value;
    let fechafinP = this.myForm.controls.fechaFin.value;
    if (fechafinP < fechaInicioP) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, 'La fecha fin debe ser mayor a la fecha de inicio');
      this.myForm.controls.fechaFin.setValue("");
      respuesta = false;
    }

    return respuesta;

  }  

  public enviarPeticion() {
    
    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }

    if(this.detCatalogos.listaCatalogosId == 15 || this.detCatalogos.listaCatalogosId == 17 || this.detCatalogos.listaCatalogosId == 18 || this.detCatalogos.listaCatalogosId == 19){
      
      if (!this.validaFechaFinal()) {
        return;
      }
    }
    if(this.detCatalogos.listaCatalogosId == 17 || this.detCatalogos.listaCatalogosId == 18 || this.detCatalogos.listaCatalogosId == 19){
      let limiteSuperior = this.myForm.controls.limiteSuperior.value;
          let limiteInferior = this.myForm.controls.limiteInferior.value;
          if (limiteInferior > limiteSuperior) {
  
            this.modalPrd.showMessageDialog(this.modalPrd.error, 'El límite inferior debe ser igual o menor que el límite superior')
              .then(() => {
                this.myForm.controls.limiteInferior.setValue('');
                this.myForm.controls.limiteInferior.updateValueAndValidity();
              });
            return;  
          }
    } 
    const titulo = (this.insertar) ? "¿Deseas agregar un nuevo registro al catálogo?" : "¿Deseas actualizar los datos del catalogo?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){
        
        let obj = this.myForm.getRawValue();
        if(obj.esActivo == "true"){
          obj.esActivo = true;
        }else if(obj.esActivo == "false"){
          obj.esActivo = false;
        }
        if(this.detCatalogos.listaCatalogosId == 1){
          this.objEnviar = {
            codBanco: obj.codBanco,
            nombreCorto: obj.nombreCorto,
            razonSocial: obj.razonSocial,
            fechaInicio: this.objdetrep.fechaInicio,
            esActivo: obj.esActivo,
            fechaAlta: this.objdetrep.fechaAlta
          }

        if (this.insertar) {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.adminCatalogosPrd.saveBanco(this.objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
              }
            });

          });

        } else {

          this.objEnviar.bancoId = this.objdetrep.bancoId;

          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.adminCatalogosPrd.modificarBanco(this.objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
              }
            });

          });
        }
          
        
        }
    
        else if(this.detCatalogos.listaCatalogosId == 13){
          
          this.objEnviar = {
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveFacultad(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              facultadPoderId: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esActivo: obj.esActivo
            }
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarFacultad(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
    
        }
        else if(this.detCatalogos.listaCatalogosId == 12){
                   

          this.objEnviar = {
            clave: obj.clave,
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveParentesco(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {

            this.objEnviar = {

              parentescoId: this.objdetrep.parentescoId,
              clave: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esActivo: obj.esActivo,
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarParentesco(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }

    
        }
        else if(this.detCatalogos.listaCatalogosId == 11){

          
          this.objEnviar = {

            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
            esIncidencia: true

          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveTipoIncidencia(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            let esIncidencia;
            if(!obj.esActivo){
              esIncidencia = false;
            }else{
              esIncidencia = true;
            }

            this.objEnviar = {

              tipoIncidenciaId: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esIncidencia: esIncidencia,
              esActivo: obj.esActivo,
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarTipoIncidencia(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
    
        }
        else if(this.detCatalogos.listaCatalogosId == 8){

          
          this.objEnviar = {
            tipoRegimenContratacionId: obj.clave,
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveRegimenContratacion(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              tipoRegimenContratacionId: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esActivo: obj.esActivo,
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarRegimenContratacion(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
    
        }
        else if(this.detCatalogos.listaCatalogosId == 6){
          
          
          if (obj.fecInicio != undefined && obj.fecInicio != '') {
            obj.fecInicio = new Date((new Date(obj.fecInicio).toUTCString()).replace(" 00:00:00 GMT", "")).getTime();
           
          }
          if(obj.tipoPersona == "indPersonaMoral"){this.indPersonaMoral = true}
          if(obj.tipoPersona == "indPersonaFisica"){this.indPersonaFisica = true}

          this.objEnviar = {
            regimenfiscalId: obj.clave,
            descripcion: obj.nombreCorto,
            indPersonaFisica: this.indPersonaFisica,
            indPersonaMoral: this.indPersonaMoral,
            fecInicio: obj.fecInicio,
            activo: obj.esActivo
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveRegimenFiscal(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
  
 
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarRegimenFiscal(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
    
        }

        else if(this.detCatalogos.listaCatalogosId == 14){

          
          this.objEnviar = {
            funcionCuentaId: obj.clave,
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveFuncionCuenta(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              funcionCuentaId: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esActivo: obj.esActivo,
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarFuncionCuenta(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
    
        }
        else if (this.detCatalogos.listaCatalogosId == 3){
          this.submitActive = true;
          if(obj.nombreCorto === null ){
            this.myForm.controls.nombreCorto.setErrors({required: true});
          } 
          if( this.myForm.invalid){
            this.modalPrd.showMessageDialog(this.modalPrd.error);
            return; 
          }
         
          
          this.objEnviar = {
            //monedaId: obj.clave,
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveMoneda(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              monedaId: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esActivo: obj.esActivo,
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarMoneda(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }


        }
        else if(this.detCatalogos.listaCatalogosId == 7){
          
          
          this.objEnviar = {
            tipoContratoId: obj.clave,
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveTipoContrato(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              tipoContratoId: obj.clave,
              descripcion: obj.nombreCorto,
              esActivo: obj.esActivo,
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarTipoContrato(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }

    
        }
        else if(this.detCatalogos.listaCatalogosId == 5){
          
          this.objEnviar = {
            tipoDeduccionId: obj.clave,
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
            especializacion: obj.clave
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveTipoDeduccion(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {
              tipoDeduccionId: obj.clave,
              descripcion: obj.nombreCorto,
              esActivo: obj.esActivo,
              especializacion: obj.clave
            }
    
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarTipoDeduccion(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }

        }
        else if(this.detCatalogos.listaCatalogosId == 9){
          
          this.objEnviar = {
            motivoBajaId: obj.clave,
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveMotivoBaja(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              motivoBajaId: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esActivo: obj.esActivo,
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarMotivoBaja(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
    
        }
        else if(this.detCatalogos.listaCatalogosId == 20){

          
          this.objEnviar = {
            //metodoPagoId: obj.clave,
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveMetodoPago(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              metodoPagoId: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esActivo: obj.esActivo,
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarMetodoPago(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
        
        }
        else if(this.detCatalogos.listaCatalogosId == 21){

          
          this.objEnviar = {
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveProveedorDispersion(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              proveedorDispersionId: obj.clave,
              descripcion: obj.nombreCorto,
              esActivo: obj.esActivo,
              fechaAlta: this.fechaAlta
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarProveedorDispersion(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
        
        }
        else if(this.detCatalogos.listaCatalogosId == 22){

          
          this.objEnviar = {
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveProveedorTimbrado(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              proveedorTimbradoId: obj.clave,
              descripcion: obj.nombreCorto,
              esActivo: obj.esActivo,
              fechaAlta: this.fechaAlta
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarProveedorTimbrado(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
        
        }

        else if(this.detCatalogos.listaCatalogosId == 2){
          
          this.objEnviar = {

            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveNacionalidad(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              nacionalidadId: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esActivo: obj.esActivo,
            }

 
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarNacionalidad(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
        }
        else if(this.detCatalogos.listaCatalogosId == 10){
          
          this.objEnviar = {
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
            esIncidencia: true
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveTipoIncapacidad(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              tipoIncapacidadId: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esActivo: obj.esActivo,
              esIncidencia : true
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarTipoIncapacidad(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
    
        }
        else if(this.detCatalogos.listaCatalogosId == 4){
          
          if(obj.integraSdi == true){obj.integraSdi= "S"}else{obj.integraSdi= "N"}
          if(obj.integraIsr == true){obj.integraIsr= "S"}else{obj.integraIsr= "N"}
          if(obj.integraIsn == true){obj.integraIsn= "S"}else{obj.integraIsn= "N"}
          if(obj.porDefecto == null){obj.porDefecto= false}
          this.objEnviar = {
              tipoPercepcionId: obj.clave,
              descripcion: obj.nombreCorto,
              esActivo: obj.esActivo,
              tipoConcepto: obj.tipoConcepto,
              integraSdi: obj.integraSdi,
              tipoPeriodicidad: obj.tipoPeriodicidad,
              integraIsr: obj.integraIsr,
              integraIsn: obj.integraIsn,
              especializacion: obj.clave,
              tipoPago: "D",
              porDefecto: obj.porDefecto


            }
          
        if (this.insertar) {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.adminCatalogosPrd.saveTipoPercepcion(this.objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
              }
            });

          });

        } else {
          this.objEnviar = {
            tipoPercepcionId: obj.clave,
            descripcion: obj.nombreCorto,
            fechaInicio: this.objdetrep.fechaInicio,
            esActivo: obj.esActivo,
            tipoConcepto: obj.tipoConcepto,
            integraSdi: obj.integraSdi,
            tipoPeriodicidad: obj.tipoPeriodicidad,
            integraIsr: obj.integraIsr,
            integraIsn: obj.integraIsn,
            especializacion: this.objdetrep.especializacion,
            tipoPago: this.objdetrep.tipoPago,
            porDefecto: obj.porDefecto

          }

          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.adminCatalogosPrd.modificarTipoPercepcion(this.objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
              }
            });

          });
        }
        }
        else if(this.detCatalogos.listaCatalogosId == 16){
          
          this.objEnviar = {
            descripcion: obj.nombreCorto,
            esActivo: obj.esActivo,
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveValorReferencia(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            this.objEnviar = {

              tipoValorReferenciaId: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esActivo: obj.esActivo,
            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarValorReferencia(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
    
        }
        else if(this.detCatalogos.listaCatalogosId == 15){
          
          let fecha = new Date();
          let anio = fecha.getFullYear();

          this.objEnviar = {
            valor: obj.valor,
            fechaInicio: obj.fechaInicio,
            fechaFin: obj.fechaFin,
            esActivo: obj.esActivo,
            tipoValorReferenciaId: {
              tipoValorReferenciaId: obj.valorReferencia,
            },
            anioLey: {
              anioLey: anio,
            },
          }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveReferencia(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {

            this.objEnviar.valorReferenciaId = this.objdetrep.valorReferenciaId;
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarReferencia(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
    
        }
        else if(this.detCatalogos.listaCatalogosId == 17){
          this.objEnviar = {
            limiteInferior: obj.limiteInferior,
            limiteSuperior: obj.limiteSuperior,
            cuotaFija: obj.cuotaFija,
            porcExcedenteLimInf: obj.porcExcedenteLimInf,
            periodicidadPagoId: {
             periodicidadPagoId: obj.PeriodicidadPago,
           },
           esActivo: obj.esActivo,
           fechaInicio: obj.fechaInicio,
           fechaFin: obj.fechaFin
         }
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveTarifaPeriodicaISR(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            
            this.valorestab = [];
            for(let item of this.arregloTablaValores){
              this.valores = 
                {
                  tarifaPeriodicaIsrId: item.tarifaPeriodicaIsrId,
                  limiteInferior: item.limiteInferior,
                  limiteSuperior: item.limiteSuperior,
                  cuotaFija: item.cuotaFija,
                  porcExcedenteLimInf: item.porcExcedenteLimInf,
                  periodicidadPagoId: item.periodicidadPagoId,
                  esActivo: item.esActivo,
                  fechaInicio: item.fechaInicio,
                  fechaFin: item.fechaFin
                }
                this.valorestab.push(this.valores);
  
              }
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarTarifaPeriodicaISR(this.valorestab).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }

    
        }
        else if(this.detCatalogos.listaCatalogosId == 19){
     
         
          this.objEnviar = {
            limiteInferior: obj.limiteInferior,
            limiteSuperior: obj.limiteSuperior,
            cuotaFija: obj.cuotaFija,
            tasa: obj.tasa,
            referenciaMarcoJuridico: obj.referenciaMarcoJuridico,
            cestado: {
                estadoId: obj.PeriodicidadPago,
            },
           esActivo: obj.esActivo,
           fechaInicio: obj.fechaInicio

         }
          
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveAplicableISN(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            
            this.valorestab = [];
            for(let item of this.arregloTablaValores){
              this.valores = 
                {
                  tasaAplicableIsnId: item.tasaAplicableIsnId,
                  limiteInferior: item.limiteInferior,
                  limiteSuperior: item.limiteSuperior,
                  cuotaFija: item.cuotaFija,
                  tasa: item.tasa,
                  referenciaMarcoJuridico: item.referenciaMarcoJuridico,
                  cestado: item.cestado,
                  esActivo: item.esActivo,
                  fechaInicio: item.fechaInicio,
                  fechaFin: item.fechaFin

                }
                this.valorestab.push(this.valores);
  
              }
 
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarAplicableISN(this.valorestab).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }

        }
        else if(this.detCatalogos.listaCatalogosId == 18){

          this.objEnviar = {
            limiteInferior: obj.limiteInferior,
            limiteSuperior: obj.limiteSuperior,
            montoSubsidio: obj.montoSubsidio,
            periodicidadPagoId: {
             periodicidadPagoId: obj.PeriodicidadPago,
           },
           esActivo: obj.esActivo,
           fechaInicio: obj.fechaInicio,
           fechaFin: obj.fechaFin
         }
          
          if (this.insertar) {
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.saveTarifaPeriodicaSubsidio(this.objEnviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
  
          } else {
            
            this.valorestab = [];
            for(let item of this.arregloTablaValores){
              this.valores = 
                {
                  tarifaPeriodicaSubsidioId: item.tarifaPeriodicaSubsidioId,
                  limiteInferior: item.limiteInferior,
                  limiteSuperior: item.limiteSuperior,
                  montoSubsidio: item.montoSubsidio,
                  periodicidadPagoId: item.periodicidadPagoId,
                  esActivo: item.esActivo,
                  fechaInicio: item.fechaInicio,
                  fechaFin: item.fechaFin

                }
                this.valorestab.push(this.valores);

              }

            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarTarifaPeriodicaSubsidio(this.valorestab).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
                if(datos.resultado){
                  this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
                }
              });
  
            });
          }
    
        }

      }
    });
  }

  public get f() {
    return this.myForm.controls;
  }
}

