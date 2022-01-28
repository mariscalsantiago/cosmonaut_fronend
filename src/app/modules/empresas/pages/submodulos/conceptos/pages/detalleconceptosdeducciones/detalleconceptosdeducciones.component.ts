import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { ConceptosService } from '../../services/conceptos.service';

@Component({ 
  selector: 'app-detalleconceptosdeducciones',
  templateUrl: './detalleconceptosdeducciones.component.html',
  styleUrls: ['./detalleconceptosdeducciones.component.scss']
})
export class DetalleconceptosdeduccionesComponent implements OnInit {
  @ViewChild("nombre") public nombre!: ElementRef;

  public mostrartooltip: boolean = false;
  public myForm!: FormGroup;
  public id_empresa: number = 0;
  public esInsert: boolean = false;
  public submitInvalido: boolean = false;
  public arregloTipoDeduccion: any = [];
  public arregloTipoDeduccionFinal: any = [];
  public tipoDeduccion : string = ""; 
  public obj: any = [];
  public noeditable: boolean = false;
  
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
    
    this.catalogosPrd.getTipoDeduccion(true).subscribe(datos => {
      ;
      this.arregloTipoDeduccion = datos.datos;
      this.arregloTipoDeduccionFinal=[];
      for (let item of this.arregloTipoDeduccion){
          if(item.noEditable == true)
          continue;
          this.arregloTipoDeduccionFinal.push(item);
      }
    
    });
    if(!this.esInsert){
      
    this.obj = history.state.data == undefined ? {} : history.state.data;
    this.noeditable = this.obj.tipoDeduccionId?.noEditable;
    //this.concatenaEspecializacion();

    this.myForm = this.createForm(this.obj);
    }else{
      this.obj = {};
      this.myForm = this.createForm(this.obj);
    }

    if(this.noeditable){
      this.inavilitaCampos();
    }
    

  }

  ngAfterViewInit(): void {

    //this.nombre.nativeElement.focus();

  }

  public createForm(obj: any) {
    return this.formBuild.group({

      nombre: [obj.nombre, [Validators.required]],
      tipoDeduccionId: [obj.tipoDeduccionId?.tipoDeduccionId, [Validators.required]],
      cuentaContable: [obj.cuentaContable],
      esActivo: [(!this.esInsert) ? obj.esActivo : { value: "true", disabled: true }],
      conceptoDeduccionId: [obj.conceptoDeduccionId]
    });

  }

  public concatenaEspecializacion(){

    
    if(this.arregloTipoDeduccion !== undefined){
      for(let item of this.arregloTipoDeduccion){
        item.tipodedeccion = item.tipoDeduccionId + "-" + item.especializacion;

      }
    }

    if(!this.esInsert){
      this.obj.tipodeduccionobj = this.obj.tipoDeduccionId.tipoDeduccionId + "-" + this.obj.tipoDeduccionId.especializacion;
    }
  }

  public inavilitaCampos(){
    this.myForm.controls.nombre.disable();
    this.myForm.controls.tipoDeduccionId.disable();
    this.myForm.controls.esActivo.disable();

  }

  public validarTipoConcepto(tipo:any){
    
    let type = String(tipo).substring(0,3)
      for(let item of this.arregloTipoDeduccion){
        if(item.tipoDeduccionId == Number(type)){
          this.tipoDeduccion = item.tipoDeduccionId + "-" + item.especializacion;
        }
      }
    }

  public enviarPeticion() {


    this.submitInvalido = true;
    if (this.myForm.invalid ) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    let titulo = this.esInsert ? "¿Deseas registrar la deducción?" : "¿Deseas actualizar la deducción?";


    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo)
      .then(valor => {
        if (valor) {
          

          let obj = this.myForm.getRawValue();
          this.validarTipoConcepto(obj.tipoDeduccionId);

          
          let splitE = this.tipoDeduccion.split('-');
          let especializacion = splitE[1];
          let tipoDeduccion = splitE[0];

          this.peticion = {
  
            nombre: obj.nombre,
            tipoDeduccionId: {
              tipoDeduccionId: tipoDeduccion,
              especializacion: especializacion
              },
            cuentaContable: obj.cuentaContable,
            esActivo: obj.esActivo,
            centrocClienteId: {
              centrocClienteId: this.id_empresa
              }
            
          };

           if (this.esInsert) {


            this.modalPrd.showMessageDialog(this.modalPrd.loading);

            this.conceptosPrd.saveDed(this.peticion).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
                .then(() => {
                  if (datos.resultado) {
                    this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'conceptos']);
                  }
                });


            });
          } else {
            
            this.peticion.conceptoDeduccionId = obj.conceptoDeduccionId;


            this.modalPrd.showMessageDialog(this.modalPrd.loading);
            this.conceptosPrd.modificarDed(this.peticion).subscribe(datos => {

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