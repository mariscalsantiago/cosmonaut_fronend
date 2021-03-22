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
  public estatus: boolean = true;
  public peticion: any = [];

  constructor(private formBuild: FormBuilder, private routerPrd: Router,
    private routerActive: ActivatedRoute, private conceptosPrd: ConceptosService,
    private catalogosPrd: CatalogosService, private modalPrd: ModalService) { }

  ngOnInit(): void {

    debugger;
    this.catalogosPrd.getTipoPercepcion(this.estatus).subscribe(datos => this.arregloTipoPercepcion = datos.datos);
 
    this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];
      if (datos["tipoinsert"] == "nuevo") {
        this.esInsert = true;
      } else if (datos["tipoinsert"] == "editar") {
        this.esInsert = false;
      }
    });


    let obj = history.state.data == undefined ? {} : history.state.data;

    if(obj.tipoPeriodicidad == "Periodica"){
      obj.tipoPeriodicidad= "P"
    }
    if(obj.tipoPeriodicidad == "Estandar"){
      obj.tipoPeriodicidad= "E"
    }
    if(obj.tipoPeriodicidad == "Ambos"){
      obj.tipoPeriodicidad= "A"
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
    debugger;
    return this.formBuild.group({

      nombre: [obj.nombre, [Validators.required]],
      tipoPercepcionId: [obj.tipoPercepcionId.tipoPercepcionId, [Validators.required]],
      tipoPeriodicidad: [obj.tipoPeriodicidad, [Validators.required]],
      gravaIsr: obj.gravaIsr,
      gravaIsn: obj.gravaIsn,
      cuentaContable: [obj.cuentaContable,[Validators.required]],
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
    debugger;

        if (valor) {

          let obj = this.myForm.value;

          obj.tipoConcepto = obj.tipoConcepto == "Ordinario"?"O":"E";
          
    
          let gravaIsr = obj.gravaIsr == "true"?"N":"S";

          this.peticion = {
  
            nombre: obj.nombre,
            tipoPercepcionId: {
              tipoPercepcionId: obj.tipoPercepcionId
              },
          
            tipoPeriodicidad: obj.tipoPeriodicidad,
            cuentaContable: obj.cuentaContable,
            tipoConcepto:  obj.tipoConcepto,
            gravaIsn: obj.gravaIsn,
            gravaIsr: gravaIsr,
            centrocClienteId: {
              centrocClienteId: this.id_empresa
              }
          };





          if (this.esInsert) {

            this.conceptosPrd.savePer(this.peticion).subscribe(datos => {

              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje)
                .then(() => {
                  if (datos.resultado) {
                    this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'conceptos']);
                  }
                });


            });
          } else {

            this.peticion.conceptoPercepcionId = obj.conceptoPercepcionId;

            this.conceptosPrd.modificarPer(this.peticion).subscribe(datos => {

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
