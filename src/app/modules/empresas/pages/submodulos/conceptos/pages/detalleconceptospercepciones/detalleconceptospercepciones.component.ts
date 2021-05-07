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

  public peticion: any = [];

  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private conceptosPrd: ConceptosService,
    private catalogosPrd: CatalogosService, private modalPrd: ModalService) { }

  ngOnInit(): void {

    
    this.catalogosPrd.getTipoPercepcion(true).subscribe(datos => this.arregloTipoPercepcion = datos.datos);

    this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];
      if (datos["tipoinsert"] == "nuevo") {
        this.esInsert = true;
      } else if (datos["tipoinsert"] == "editar") {
        this.esInsert = false;
      }
    });


    let obj = history.state.data == undefined ? {} : history.state.data;

    if (obj.tipoPeriodicidad == "Periodica") {
      obj.tipoPeriodicidad = "P"
    }
    if (obj.tipoPeriodicidad == "Estandar") {
      obj.tipoPeriodicidad = "E"
    }

    if (obj.gravaIsr == "S") {
      obj.gravaIsr = true
    }
    if (obj.gravaIsr == "N") {
      obj.gravaIsr = false
    }
    if (this.esInsert) {
      obj = {
        tipoPercepcionId: {}
      };
    }

    this.myForm = this.createForm(obj);

  }

  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }

  public createForm(obj: any) {


    
    
    return this.formBuild.group({

      nombre: [obj.nombre, [Validators.required]],
      tipoPercepcionId: [obj.tipoPercepcionId.tipoPercepcionId, [Validators.required]],
      tipoPeriodicidad: [obj.tipoPeriodicidad, [Validators.required]],
      gravaIsr: obj.gravaIsr,
      gravaIsn: obj.gravaIsn,
      cuentaContable: obj.cuentaContable,
      tipoConcepto: [obj.tipoConcepto],
      esActivo: [(!this.esInsert) ? obj.esActivo : { value: "true", disabled: true }],
      conceptoPercepcionId: [obj.conceptoPercepcionId],

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

          let obj = this.myForm.value;

          if (obj.tipoConcepto == "Ordinario") {
            obj.tipoConcepto = "O"
          }
          if (obj.tipoConcepto == "Extraordinario") {
            obj.tipoConcepto = "E"
          }

          if (obj.gravaIsn == null){
            obj.gravaIsn = false;
          }
          let gravaIsr = obj.gravaIsr == true ? "S" : "N";

          this.peticion = {

            nombre: obj.nombre,
            tipoPercepcionId: {
              tipoPercepcionId: obj.tipoPercepcionId
            },

            tipoPeriodicidad: obj.tipoPeriodicidad,
            cuentaContable: obj.cuentaContable,
            tipoConcepto: obj.tipoConcepto,
            gravaIsn: obj.gravaIsn,
            esActivo: obj.esActivo,
            gravaIsr: gravaIsr,
            centrocClienteId: {
              centrocClienteId: this.id_empresa
            }

          };





          if (this.esInsert) {
            debugger;
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
