import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { ConceptosService } from '../../services/conceptos.service';

@Component({
  selector: 'app-detalleconceptospercepciones',
  templateUrl: './detalleconceptospercepciones.component.html',
  styleUrls: ['./detalleconceptospercepciones.component.scss']
})
export class DetalleconceptospercepcionesComponent implements OnInit {
  @ViewChild("nombre") public nombre!: ElementRef;

  public mostrartooltip: boolean = false;
  public myForm!: FormGroup;
  public id_empresa: number = 0;
  public esInsert: boolean = false;
  public submitInvalido: boolean = false;
  public arregloTipoPercepcion: any = [];
  public arregloTipoPercepcionMod: any = [];
  public obj: any = [];
  public ambasPeriodicidad: boolean = false;
  public conAmbasPeriodicidad: boolean = true;
  public mostrartipoConcepto: boolean = true;
  public tipoPercepcion: string = "";
  public mostrartipoPercepcion: string = "E";
  public mensajePercepcion: boolean = false;
  public noMensajePercepcion: boolean = true; 
  public limpiarTipopercepcion: boolean = false;


  public peticion: any = [];

  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private conceptosPrd: ConceptosService,
    private catalogosPrd: CatalogosService, private modalPrd: ModalService) { }

  ngOnInit(): void {
    

    this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];
      if (datos["tipoinsert"] == "nuevo") {
        this.esInsert = true;
      } else if (datos["tipoinsert"] == "editar") {
        this.esInsert = false;
      }
    });

    if(!this.esInsert){
      
    this.obj = history.state.data == undefined ? {} : history.state.data;
    
    
    if (this.obj.tipoPeriodicidad == "Periodica") {
      if(this.obj.tipoPercepcionId.tipoPeriodicidad == "A"){
        this.mostrartipoPercepcion = "P";
      }else{
      this.obj.tipoPeriodicidad = "P"
      }
      
    }
    if (this.obj.tipoPeriodicidad == "Estandar") {
      if(this.obj.tipoPercepcionId.tipoPeriodicidad == "A"){
        this.mostrartipoPercepcion = "E";
      }else{
      this.obj.tipoPeriodicidad = "E"
      }
    }

    if (this.obj.gravaIsr == "S") {
      this.obj.gravaIsr = true
    }

    if (this.obj.gravaIsr == "N") {
      this.obj.gravaIsr = false
    }
    if (this.obj.integraImss == "S") {
      this.obj.integraImss = true
    }

    if (this.obj.integraImss == "N") {
      this.obj.integraImss = false
    }
    if(this.obj.tipoPercepcionId.tipoPeriodicidad == "A"){
      this.obj.tipoPeriodicidad = "A"
    }

    this.catalogosPrd.getTipoPercepcionFiltro(this.obj.tipoPeriodicidad,true).subscribe(datos =>{ 
      this.arregloTipoPercepcion = datos.datos 
    this.mostrarAmbas(this.obj.tipoPeriodicidad);
    });
    this.myForm = this.createForm(this.obj);
    this.validarTipoConceptoMod(this.obj.tipoPercepcionId?.tipoPercepcionId);
     }else{
    this.obj = {};
    this.myForm = this.createForm(this.obj);
    }
    

  }

  ngAfterViewInit(): void {
  }

  public createForm(obj: any) {
    
    return this.formBuild.group({

      nombre: [obj.nombre, [Validators.required]],
      tipoPercepcionId: [obj.tipoPercepcionId?.tipoPercepcionId, [Validators.required]],
      tipoPeriodicidad: [obj.tipoPeriodicidad, [Validators.required]],
      gravaIsr: obj.gravaIsr,
      ajustarBaseGravableFaltantes: [obj.ajustarBaseGravableFaltantes],
      gravaIsn: obj.gravaIsn == undefined?false:obj.gravaIsn,
      integraImss: obj.integraImss == undefined?false:obj.integraImss,
      cuentaContable: obj.cuentaContable,
      tipoConcepto: [obj.tipoConcepto],
      tipoPercepcionMensaje:["Sin registros"],
      periodicidadTipo: [this.mostrartipoPercepcion],
      esActivo: [(!this.esInsert) ? obj.esActivo : { value: "true", disabled: true }],
      conceptoPercepcionId: [obj.conceptoPercepcionId],

    });

  }


  public validarPercepcion(tipo:any){
    debugger;
    this.catalogosPrd.getTipoPercepcionFiltro(tipo,true).subscribe(datos =>{ 
      this.arregloTipoPercepcion = datos.datos 
      
    if(this.arregloTipoPercepcion == undefined){
      this.mensajePercepcion = true;
      this.noMensajePercepcion = false;
    }else{
      this.mensajePercepcion = false;
      this.noMensajePercepcion = true;
    }
    this.mostrarAmbas(tipo);
  });
  
  }
  

  public mostrarAmbas(tipo:any){
    
    if(tipo == "A"){
      this.ambasPeriodicidad = true;
      this.conAmbasPeriodicidad = false;
    }else{
      this.ambasPeriodicidad = false;
      this.conAmbasPeriodicidad = true;
    }
  }
  public validarTipoConcepto(tipo:any){
  debugger;
    
    this.limpiarTipopercepcion = false;
    let type = String(tipo).substring(0,3)
    for(let item of this.arregloTipoPercepcion){
      
      if(item.tipoPercepcionId == Number(type)){
        this.limpiarTipopercepcion = true;
        this.tipoPercepcion = item.tipoPercepcionId + "-" + item.especializacion;
        if(item.tipoConcepto == "N"){
          this.mostrartipoConcepto = false;
        }
        else if(item.tipoConcepto == "O"){
          this.myForm.controls.tipoConcepto.setValue("Ordinario");
          this.myForm.controls.tipoConcepto.disable();
          this.mostrartipoConcepto = true;
        }
        else if(item.tipoConcepto == "E"){
          this.myForm.controls.tipoConcepto.setValue("Extraordinario");
          this.myForm.controls.tipoConcepto.disable();
          this.mostrartipoConcepto = true;
        }
        else if(item.tipoConcepto == "A"){
          this.myForm.controls.tipoConcepto.setValue("Ordinario");
          this.mostrartipoConcepto = true;
        }
        else{
          this.mostrartipoConcepto = true;
          this.myForm.controls.tipoConcepto.enable();
        }

       if(item.integraIsn == "S" ){
          this.myForm.controls.gravaIsn.setValue(true);
          this.myForm.controls.gravaIsn.disable();
        }
       else if(item.integraIsn == "N" ){
          this.myForm.controls.gravaIsn.setValue(false);
          this.myForm.controls.gravaIsn.disable();
        }
        else if(item.integraIsn == "C" ){
          this.myForm.controls.gravaIsn.setValue(true);
          this.myForm.controls.gravaIsn.enable();
        }else{
          this.myForm.controls.gravaIsn.setValue(false);
          this.myForm.controls.gravaIsn.enable();
        }
        
       if(item.integraIsr == "S"){
          this.myForm.controls.gravaIsr.setValue(true);
          this.myForm.controls.gravaIsr.disable();
        }
        else if(item.integraIsr == "N"){
          this.myForm.controls.gravaIsr.setValue(false);
          this.myForm.controls.gravaIsr.disable();
        }
        else if(item.integraIsr == "C"){
          this.myForm.controls.gravaIsr.setValue(true);
          this.myForm.controls.gravaIsr.enable();
        }
        else{
          this.myForm.controls.gravaIsr.setValue(false);
          this.myForm.controls.gravaIsr.enable();
        }
       if(item.integraSdi == "S"){
          this.myForm.controls.integraImss.setValue(true);
          this.myForm.controls.integraImss.disable();
        }
        else if(item.integraSdi == "N"){
          this.myForm.controls.integraImss.setValue(false);
          this.myForm.controls.integraImss.disable();
        }
        else if(item.integraSdi == "C"){
          this.myForm.controls.integraImss.setValue(true);
          this.myForm.controls.integraImss.enable();
        }
        else{
          this.myForm.controls.integraImss.setValue(false);
          this.myForm.controls.integraImss.enable();
        }

      }
    }
    if(!this.limpiarTipopercepcion){
      this.myForm.controls.tipoPercepcionId.setValue('');
    }
}
  public validarTipoConceptoMod(tipo:any){
  
      
      this.catalogosPrd.getTipoPercepcionFiltro(this.obj.tipoPeriodicidad,true).subscribe(datos =>{ 
        this.arregloTipoPercepcionMod = datos.datos 

        let type = String(tipo).substring(0,3)
      for(let item of this.arregloTipoPercepcionMod){
        
        if(item.tipoPercepcionId == Number(type)){
          
          if(item.tipoConcepto == "N"){
            this.mostrartipoConcepto = false;
          }
          else if(item.tipoConcepto == "O"){
            this.myForm.controls.tipoConcepto.setValue("Ordinario");
            this.myForm.controls.tipoConcepto.disable();
            this.mostrartipoConcepto = true;
          }
          else if(item.tipoConcepto == "E"){
            this.myForm.controls.tipoConcepto.setValue("Extraordinario");
            this.myForm.controls.tipoConcepto.disable();
            this.mostrartipoConcepto = true;
          }
          else if(item.tipoConcepto == "A"){
            if(!this.esInsert){
              this.myForm.controls.tipoConcepto.setValue(this.obj.tipoConcepto);
            }else{
              this.myForm.controls.tipoConcepto.setValue("Ordinario");
            }
            this.mostrartipoConcepto = true;
          }
          else{
            this.mostrartipoConcepto = true;
            this.myForm.controls.tipoConcepto.enable();
          }

         if(item.integraIsn == "S" ){
            this.myForm.controls.gravaIsn.setValue(true);
            this.myForm.controls.gravaIsn.disable();
          }
         else if(item.integraIsn == "N" ){
            this.myForm.controls.gravaIsn.setValue(false);
            this.myForm.controls.gravaIsn.disable();
          }
          else if(item.integraIsn == "C" ){
            this.myForm.controls.gravaIsn.setValue(true);
            this.myForm.controls.gravaIsn.enable();
          }else{
            this.myForm.controls.gravaIsn.setValue(false);
            this.myForm.controls.gravaIsn.enable();
          }
          
         if(item.integraIsr == "S"){
            this.myForm.controls.gravaIsr.setValue(true);
            this.myForm.controls.gravaIsr.disable();
          }
          else if(item.integraIsr == "N"){
            this.myForm.controls.gravaIsr.setValue(false);
            this.myForm.controls.gravaIsr.disable();
          }
          else if(item.integraIsr == "C"){
            this.myForm.controls.gravaIsr.setValue(true);
            this.myForm.controls.gravaIsr.enable();
          }
          else{
            this.myForm.controls.gravaIsr.setValue(false);
            this.myForm.controls.gravaIsr.enable();
          }
         if(item.integraSdi == "S"){
            this.myForm.controls.integraImss.setValue(true);
            this.myForm.controls.integraImss.disable();
          }
          else if(item.integraSdi == "N"){
            this.myForm.controls.integraImss.setValue(false);
            this.myForm.controls.integraImss.disable();
          }
          else if(item.integraSdi == "C"){
            this.myForm.controls.integraImss.setValue(true);
            this.myForm.controls.integraImss.enable();
          }
          else{
            this.myForm.controls.integraImss.setValue(false);
            this.myForm.controls.integraImss.enable();
          }

        }
      }

    });
  }

  public enviarPeticion() {
    
    this.submitInvalido = true;
    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;

    }

    let titulo = this.esInsert ? "¿Deseas registrar la percepción ?" : "¿Deseas actualizar la percepción?";


    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo)
      .then(valor => {
        
        
        if (valor) {
          
          
          let obj = this.myForm.getRawValue();
          if(obj.tipoConcepto == null){
            obj.tipoConcepto = 'N';
          }
          if(obj.tipoConcepto == "No aplica"){
            obj.tipoConcepto = 'N';
          }
          let especializacion;
          let tipoPercepcion;
          if(this.tipoPercepcion == ""){
            for(let item of this.arregloTipoPercepcion){
              if(item.tipoPercepcionId == obj.tipoPercepcionId){
                especializacion = item.especializacion;
                tipoPercepcion = item.tipoPercepcionId;
              }  
            }  
          }else{
          let splitE = this.tipoPercepcion.split('-');
          especializacion = splitE[1];
          tipoPercepcion = splitE[0];
          }

          if (obj.tipoConcepto == "Ordinario") {
            obj.tipoConcepto = "O"
          }
          if (obj.tipoConcepto == "Extraordinario") {
            obj.tipoConcepto = "E"
          }

          if (obj.gravaIsn == null){
            obj.gravaIsn = false;
          }
          let integraImss = "";
          if (obj.integraImss == null){
            integraImss= "N";
          }
          let gravaIsr = obj.gravaIsr == true ? "S" : "N";
          integraImss = obj.integraImss == true ? "S" : "N";
          //obj.gravaIsn = obj.gravaIsn == true ? "S" : "N";

          if(obj.tipoPeriodicidad == "A"){
            obj.tipoPeriodicidad = obj.periodicidadTipo;
          }

          this.peticion = {

            nombre: obj.nombre,
            tipoPercepcionId: {
              tipoPercepcionId: tipoPercepcion,
              especializacion: especializacion
            },

            tipoPeriodicidad: obj.tipoPeriodicidad,
            cuentaContable: obj.cuentaContable,
            tipoConcepto: obj.tipoConcepto,
            gravaIsn: obj.gravaIsn,
            integraImss: integraImss,
            esActivo: obj.esActivo,
            gravaIsr: gravaIsr,
            centrocClienteId: {
              centrocClienteId: this.id_empresa
            }

          };




          


          //return;


          if (this.esInsert) {
            
            this.modalPrd.showMessageDialog(this.modalPrd.loading);

            this.conceptosPrd.savePer(this.peticion).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
                .then(() => {
                  if (datos.resultado) {
                    this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'conceptos']);
                  }
                });


            });
          } else {

            this.peticion.conceptoPercepcionId = obj.conceptoPercepcionId;
            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.conceptosPrd.modificarPer(this.peticion).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
                .then(() => {
                  if (datos.resultado) {
                    this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'conceptos']);
                  }
                });

            });

          }

        }


      });


  }


  public cancelar() {
    this.routerPrd.navigate(['/empresa/detalle', this.id_empresa, 'conceptos']);
  }


  get f() {
    return this.myForm.controls;
  }






}
