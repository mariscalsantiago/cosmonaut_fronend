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
  public obj: any = [];

  public peticion: any = [];

  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private conceptosPrd: ConceptosService,
    private catalogosPrd: CatalogosService, private modalPrd: ModalService) { }

  ngOnInit(): void {
    debugger;
    


    this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];
      if (datos["tipoinsert"] == "nuevo") {
        this.esInsert = true;
      } else if (datos["tipoinsert"] == "editar") {
        this.esInsert = false;
      }
    });

    this.catalogosPrd.getTipoPercepcion(true).subscribe(datos => {
      this.arregloTipoPercepcion = datos.datos
      this.concatenaEspecializacion();
    });

    this.obj = history.state.data == undefined ? {} : history.state.data;
    this.concatenaEspecializacion();
    if (this.obj.tipoPeriodicidad == "Periodica") {
      this.obj.tipoPeriodicidad = "P"
    }
    if (this.obj.tipoPeriodicidad == "Estandar") {
      this.obj.tipoPeriodicidad = "E"
    }


   // obj.gravaIsr = false;
    if (this.obj.gravaIsr == "S") {
      this.obj.gravaIsr = true
    }

    if (this.obj.gravaIsr == "N") {
      this.obj.gravaIsr = false
    }
    if (this.esInsert) {
      this.obj = {
        tipoPercepcionId: {}
      };
    }

    this.myForm = this.createForm(this.obj);

  }

  ngAfterViewInit(): void {
  }

  public createForm(obj: any) {


    
    console.log(obj);
    
    return this.formBuild.group({

      nombre: [obj.nombre, [Validators.required]],
      tipoPercepcionId: [obj.tipopercepcionobj, [Validators.required]],
      tipoPeriodicidad: [obj.tipoPeriodicidad, [Validators.required]],
      gravaIsr: obj.gravaIsr,
      gravaIsn: obj.gravaIsn == undefined?false:obj.gravaIsn,
      integraImss: obj.integraImss == undefined?false:obj.integraImss,
      cuentaContable: obj.cuentaContable,
      tipoConcepto: [obj.tipoConcepto],
      esActivo: [(!this.esInsert) ? obj.esActivo : { value: "true", disabled: true }],
      conceptoPercepcionId: [obj.conceptoPercepcionId],

    });

  }

  public concatenaEspecializacion(){
    debugger;
    if(this.arregloTipoPercepcion !== undefined){
      for(let item of this.arregloTipoPercepcion){
        item.tipopercepcion = item.tipoPercepcionId + "-" + item.especializacion;

      }
    }
      if(this.obj !== undefined){
        this.obj.tipopercepcionobj = this.obj.tipoPercepcionId.tipoPercepcionId + "-" + this.obj.tipoPercepcionId.especializacion;
      }

    
  }

  public enviarPeticion() {
    debugger;
    this.submitInvalido = true;
    if (this.myForm.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;

    }

    let titulo = this.esInsert ? "¿Deseas registrar la percepción ?" : "¿Deseas actualizar la percepción?";


    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo)
      .then(valor => {
        
        
        if (valor) {
          debugger;
          let obj = this.myForm.value;

          let splitE = obj.tipoPercepcionId.split('-');
          let especializacion = splitE[1];
          let tipoDeduccion = splitE[0];

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

          this.peticion = {

            nombre: obj.nombre,
            tipoPercepcionId: {
              tipoPercepcionId: tipoDeduccion,
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
