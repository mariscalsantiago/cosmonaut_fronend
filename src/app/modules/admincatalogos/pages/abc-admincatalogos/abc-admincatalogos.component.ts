import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { AdminCatalogosService } from '../../services/admincatalogos.service';
import { truncate } from 'fs';


@Component({
  selector: 'app-abc-admincatalogos',
  templateUrl: './abc-admincatalogos.component.html',
  styleUrls: ['./abc-admincatalogos.component.scss']
})
export class ABCAdminCatalogosComponent implements OnInit {


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

  public arreglotabla: any = {
    columnas: [],
    filas: []
  };



  constructor(private routerPrd: Router, private adminCatalogosPrd: AdminCatalogosService,
    private routerActivePrd: ActivatedRoute, private modalPrd: ModalService, private formBuilder: FormBuilder) { 

      this.routerActivePrd.params.subscribe(datos => {
        this.insertar = (datos["tipoinsert"] == 'nuevo');
  
      });
    }

  ngOnInit(): void {
    

    this.detCatalogos = history.state.datos == undefined ? {} : history.state.datos;
    this.objdetrep = history.state.data == undefined ? {} : history.state.data;

    this.objdetrep = {
      ...this.objdetrep,
      //clave: this.idCatalogo,
      //nombreCorto: this.descripcion,
      esActivo: this.objdetrep.esActivo,
      tipoPersona: this.objdetrep.indPersonaFisica
    };
        
    if(this.detCatalogos.listaCatalogosId == 1){
        this.catBanco();
        this.idCatalogo = this.objdetrep.codBanco;
        this.descripcion = this.objdetrep.nombreCorto;
        
    }

    else if(this.detCatalogos.listaCatalogosId == 13){
      
      this.idCatalogo = this.objdetrep.facultadPoderId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 9){
      this.idCatalogo = this.objdetrep.motivoBajaId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 12){
      
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 11){
      
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 8){
      this.idCatalogo = this.objdetrep.tipoRegimenContratacionId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 6){
      
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.objdetrep.tipoPersona = this.objdetrep.indPersonaFisica == true  ?"indPersonaFisica":"indPersonaMoral";
      this.objdetrep.esActivo = this.objdetrep.activo;

      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 7){
      this.idCatalogo = this.objdetrep.tipoContratoId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 5){
      this.idCatalogo = this.objdetrep.tipoDeduccionId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 10){
      this.idCatalogo = this.objdetrep.tipoIncapacidadId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 4){
      this.objdetrep.integraSdi = this.objdetrep.integraSdi == "S"  ? true : false;
      this.objdetrep.integraIsr = this.objdetrep.integraIsr == "S"  ? true : false;
      this.objdetrep.integraIsn = this.objdetrep.integraIsn == "S"  ? true : false;
      this.idCatalogo = this.objdetrep.tipoPercepcionId;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 15){
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.tipoValorReferenciaId?.descripcion;
      this.adminCatalogosPrd.getListaTipoValorReferencia(true).subscribe(datos => this.arregloValoresReferencia = datos.datos);
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 17){
      
      this.clave();
      this.adminCatalogosPrd.getListaTarifaISR(this.objdetrep.periodo).subscribe(datos => this.arregloTablaValores = datos.datos);
      this.adminCatalogosPrd.getListatablasPeriodicasISR().subscribe(datos => this.arregloPeriodicidad = datos.datos);
      this.clave();
     
    }
    else if(this.detCatalogos.listaCatalogosId == 18){
      
      this.clave();
      this.adminCatalogosPrd.getListaSubcidioISR(this.objdetrep.periodo).subscribe(datos => this.arregloTablaValores = datos.datos);
      this.adminCatalogosPrd.getListaTablasSubsidioISR().subscribe(datos => this.arregloPeriodicidad = datos.datos);
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 19){
      
      this.descripcion = this.objdetrep.estado;
      this.adminCatalogosPrd.getListaAplicableISN(this.objdetrep.estadoId).subscribe(datos => this.arregloTablaValores = datos.datos);
      this.adminCatalogosPrd.getListaEstadosISN().subscribe(datos => this.arregloPeriodicidad = datos.datos);
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 2){
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 14){
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 20){
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 3){
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 16){
      this.idCatalogo = this.objdetrep.clave;
      this.descripcion = this.objdetrep.descripcion;
      this.clave();
    }
    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;


    this.myForm = this.createForm((this.objdetrep));


  }


  public createForm(obj: any) {
    let datePipe = new DatePipe("en-MX");
    return this.formBuilder.group({

      clave: [this.idCatalogo],
      fecInicio: [datePipe.transform(obj.fecInicio, 'yyyy-MM-dd')],
      codBanco: [this.idCatalogo],
      integraSdi: [obj.integraSdi],
      integraIsr: [obj.integraIsr],
      integraIsn: [obj.integraIsn],
      valor: [obj.valor],
      fechaInicio: [datePipe.transform(obj.fechaInicio, 'yyyy-MM-dd')],
      fechaFin: [datePipe.transform(obj.fechaFin, 'yyyy-MM-dd')],
      tipoConcepto: [obj.tipoConcepto],
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
      nombreCorto: [this.descripcion],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }],


    });
  }

  public updateList(id: number, property: string, event: any) {
    
    const editField = event.target.textContent;
    this.arregloTablaValores[id][property] = editField;
  }


  public changeValue(id: number, property: string, event: any) {
    
    this.editField = event.target.textContent;
  }

  public clave(){
    if(this.insertar){
      if(this.detCatalogos.listaCatalogosId == 6){
        this.activaClave = true;
        this.regimen = true;
      }
      else if(this.detCatalogos.listaCatalogosId == 4){
        this.activaClave = true;
        this.percepcion = true;
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
      else if(this.detCatalogos.listaCatalogosId == 13 || this.detCatalogos.listaCatalogosId == 2 || this.detCatalogos.listaCatalogosId == 11 || this.detCatalogos.listaCatalogosId == 10 || this.detCatalogos.listaCatalogosId == 16){

      }
      else{
        this.activaClave = true;
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


  public enviarPeticion() {
    
    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

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

              parentescoId: obj.clave,
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
            this.objEnviar = {

              tipoIncidenciaId: obj.clave,
              descripcion: obj.nombreCorto,
              nombreCorto: this.objdetrep.nombreCorto,
              esIncidencia: true,
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
          
          let fechar = "";
          if (obj.fecInicio != undefined || obj.fecInicio != null) {
      
            if (obj.fecInicio != "") {
      
              const fecha1 = new Date(obj.fecInicio).toUTCString().replace("GMT", "");
              fechar = `${new Date(fecha1).getTime()}`;
            }
          }
          if(obj.tipoPersona == "indPersonaMoral"){this.indPersonaMoral = true}
          if(obj.tipoPersona == "indPersonaFisica"){this.indPersonaFisica = true}

          this.objEnviar = {
            regimenfiscalId: obj.clave,
            descripcion: obj.nombreCorto,
            indPersonaFisica: this.indPersonaFisica,
            indPersonaMoral: this.indPersonaMoral,
            fecInicio: fechar,
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
         
          
          this.objEnviar = {
            monedaId: obj.clave,
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
              descripcion: obj.nombreCorto,
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
            metodoPagoId: obj.clave,
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
          this.objEnviar = {
              tipoPercepcionId: obj.clave,
              descripcion: obj.nombreCorto,
              fechaInicio: this.objdetrep.fechaInicio,
              esActivo: obj.esActivo,
              tipoConcepto: obj.tipoConcepto,
              integraSdi: obj.integraSdi,
              tipoPeriodicidad: obj.tipoPeriodicidad,
              integraIsr: obj.integraIsr,
              integraIsn: obj.integraIsn
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
          let fechainicio = "";
          let fechafin = "";
          if (obj.fechaFin != undefined || obj.fechaFin != null) {
      
            if (obj.fechaFin != "") {
              const fecha1 = new Date(obj.fechaFin).toUTCString().replace("GMT", "");
              fechafin = `${new Date(fecha1).getTime()}`;
            }
          }
          
          if (obj.fechaInicio != undefined || obj.fechaInicio != null) {
      
            if (obj.fechaInicio != "") {
              const fecha1 = new Date(obj.fechaInicio).toUTCString().replace("GMT", "");
              fechainicio = `${new Date(fecha1).getTime()}`;
            }
          }
          this.objEnviar = {
            valor: obj.valor,
            fechaFin: fechafin,
            fechaInicio: fechainicio,
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

            this.objEnviar.valorReferenciaId = obj.clave;
  
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
          
          let fechainicio = "";
          let fechafin = "";
          if (obj.fechaFin != undefined || obj.fechaFin != null) {
      
            if (obj.fechaFin != "") {
              const fecha1 = new Date(obj.fechaFin).toUTCString().replace("GMT", "");
              fechafin = `${new Date(fecha1).getTime()}`;
            }
          }
          
          if (obj.fechaInicio != undefined || obj.fechaInicio != null) {
      
            if (obj.fechaInicio != "") {
              const fecha1 = new Date(obj.fechaInicio).toUTCString().replace("GMT", "");
              fechainicio = `${new Date(fecha1).getTime()}`;
            }
          }
          this.objEnviar = {
            limiteInferior: obj.limiteInferior,
            limiteSuperior: obj.limiteSuperior,
            cuotaFija: obj.cuotaFija,
            porcExcedenteLimInf: obj.porcExcedenteLimInf,
            periodicidadPagoId: {
             periodicidadPagoId: obj.PeriodicidadPago,
           },
           esActivo: obj.esActivo,
           fechaInicio: fechainicio,
           fechaFin: fechafin
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
            this.objEnviar = {

              valoresTablaPeriodicaISR: this.valorestab,

            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarTarifaPeriodicaISR(this.objEnviar).subscribe(datos => {
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

          
          let fechainicio = "";
          let fechafin = "";
          if (obj.fechaFin != undefined || obj.fechaFin != null) {
      
            if (obj.fechaFin != "") {
              const fecha1 = new Date(obj.fechaFin).toUTCString().replace("GMT", "");
              fechafin = `${new Date(fecha1).getTime()}`;
            }
          }
          
          if (obj.fechaInicio != undefined || obj.fechaInicio != null) {
      
            if (obj.fechaInicio != "") {
              const fecha1 = new Date(obj.fechaInicio).toUTCString().replace("GMT", "");
              fechainicio = `${new Date(fecha1).getTime()}`;
            }
          }
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
           fechaInicio: fechainicio,

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
            this.objEnviar = {

              valoresTablaPeriodicaISR: this.valorestab,

            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarAplicableISN(this.objEnviar).subscribe(datos => {
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
          
          let fechainicio = "";
          let fechafin = "";
          if (obj.fechaFin != undefined || obj.fechaFin != null) {
      
            if (obj.fechaFin != "") {
              const fecha1 = new Date(obj.fechaFin).toUTCString().replace("GMT", "");
              fechafin = `${new Date(fecha1).getTime()}`;
            }
          }
          
          if (obj.fechaInicio != undefined || obj.fechaInicio != null) {
      
            if (obj.fechaInicio != "") {
              const fecha1 = new Date(obj.fechaInicio).toUTCString().replace("GMT", "");
              fechainicio = `${new Date(fecha1).getTime()}`;
            }
          }
          this.objEnviar = {
            limiteInferior: obj.limiteInferior,
            limiteSuperior: obj.limiteSuperior,
            montoSubsidio: obj.montoSubsidio,
            periodicidadPagoId: {
             periodicidadPagoId: obj.PeriodicidadPago,
           },
           esActivo: obj.esActivo,
           fechaInicio: fechainicio,
           fechaFin: fechafin
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
            this.objEnviar = {

              valoresTablaPeriodicaISR: this.valorestab,

            }
  
  
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.adminCatalogosPrd.modificarTarifaPeriodicaSubsidio(this.objEnviar).subscribe(datos => {
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
}

