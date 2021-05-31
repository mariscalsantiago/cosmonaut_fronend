import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { AdminCatalogosService } from '../../services/admincatalogos.service';


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
    debugger;

    this.detCatalogos = history.state.datos == undefined ? {} : history.state.datos;
    let objdetrep = history.state.data == undefined ? {} : history.state.data;

    objdetrep = {
      ...objdetrep,
      //clave: this.idCatalogo,
      //nombreCorto: this.descripcion,
      esActivo: objdetrep.esActivo,
      tipoPersona: objdetrep.indPersonaFisica,
      valorReferencia: "A"
    };
        
    if(this.detCatalogos.listaCatalogosId == 1){
        this.catBanco();
        this.idCatalogo = objdetrep.codBanco;
        this.descripcion = objdetrep.nombreCorto;
        
    }

    else if(this.detCatalogos.listaCatalogosId == 13){
      debugger;
      this.idCatalogo = objdetrep.facultadPoderId;
      this.descripcion = objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 9){
      this.idCatalogo = objdetrep.motivoBajaId;
      this.descripcion = objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 12){
      debugger;
      this.idCatalogo = objdetrep.clave;
      this.descripcion = objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 11){
      debugger;
      this.idCatalogo = objdetrep.clave;
      this.descripcion = objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 8){
      this.idCatalogo = objdetrep.tipoRegimenContratacionId;
      this.descripcion = objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 6){
      debugger;
      this.idCatalogo = objdetrep.clave;
      this.descripcion = objdetrep.descripcion;
      objdetrep.tipoPersona = objdetrep.indPersonaFisica == true  ?"indPersonaFisica":"indPersonaMoral";
      objdetrep.esActivo = objdetrep.activo;

      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 7){
      this.idCatalogo = objdetrep.tipoContratoId;
      this.descripcion = objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 5){
      this.idCatalogo = objdetrep.tipoDeduccionId;
      this.descripcion = objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 10){
      this.idCatalogo = objdetrep.tipoIncapacidadId;
      this.descripcion = objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 4){
      objdetrep.integraSdi = objdetrep.integraSdi == "S"  ? true : false;
      objdetrep.integraIsr = objdetrep.integraIsr == "S"  ? true : false;
      objdetrep.integraIsn = objdetrep.integraIsn == "S"  ? true : false;
      this.idCatalogo = objdetrep.tipoPercepcionId;
      this.descripcion = objdetrep.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 15){
      this.idCatalogo = objdetrep.clave;
      this.descripcion = objdetrep.tipoValorReferenciaId?.descripcion;
      this.clave();
    }
    else if(this.detCatalogos.listaCatalogosId == 17){
      debugger;
      this.clave();
      this.adminCatalogosPrd.getListaTarifaISR(objdetrep.periodo).subscribe(datos => this.arregloTablaValores = datos.datos);
     
    }
    else if(this.detCatalogos.listaCatalogosId == 18){
      debugger;
      this.clave();
      this.adminCatalogosPrd.getListaSubcidioISR(objdetrep.periodo).subscribe(datos => this.arregloTablaValores = datos.datos);
     
    }


    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;


    this.myForm = this.createForm((objdetrep));


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
      valorReferencia: [obj.valorReferencia],
      tipoPersona: [obj.tipoPersona],
      nombreCorto: [this.descripcion],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }, [Validators.required]],


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
        this.formGeneral = false;

      }
      else if(this.detCatalogos.listaCatalogosId == 18){
        this.descripcionGeneral = false;
        this.formGeneral = false;

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

        let obj = this.myForm.value;

        let objEnviar: any = {
          bancoId: 0,
          codBanco: "string",
          nombreCorto: "string",
          convenio: "string",
          razonSocial: "string",
          fechaInicio: "2021-05-26T23:49:11.290Z",
          esActivo: true,
          fechaAlta: "2021-05-26T23:49:11.290Z",
          fechaFin: "2021-05-26T23:49:11.290Z"
        }

        if (this.insertar) {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.adminCatalogosPrd.save(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
              }
            });

          });

        } else {

          let objEnviarMod: any = {
            areaId: obj.areaId,
            descripcion: "",
            nombreCorto: "",
            centrocClienteId: "",
            nclPuestoDto:
              [{
                puestoId: "",
                descripcion: obj.puesto,
                nombreCorto: obj.puesto,
                centrocClienteId: "",
              }]
          }
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.adminCatalogosPrd.modificar(objEnviarMod).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle'], { state: { data: this.detCatalogos} });
              }
            });

          });
        }
      }
    });
  }
}

