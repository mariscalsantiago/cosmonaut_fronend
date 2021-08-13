import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomicilioService } from 'src/app/modules/empleados/services/domicilio.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-domicilio',
  templateUrl: './domicilio.component.html',
  styleUrls: ['./domicilio.component.scss']
})
export class DomicilioComponent implements OnInit {


  @Output() enviado = new EventEmitter();
  @Input() datosPersona: any;
  @Input() tabsDatos: any;


  public myForm!: FormGroup;

  public submitEnviado: boolean = false;
  public domicilioCodigoPostal: any = [];
  public nombreEstado: string = "";
  public idEstado: number = 0;
  public nombreMunicipio: string = "";
  public idMunicipio: number = 0;
  public noCoincide = '';

  constructor(private formBuilder: FormBuilder, private domicilioPrd: DomicilioService,
    private catalogosPrd: CatalogosService, private routerPrd: Router, private modalPrd: ModalService) { }

  ngOnInit(): void {




    if (Boolean(this.tabsDatos[1])) {
      if (this.tabsDatos[1][0].domicilioId !== undefined) {
        this.myForm = this.createForm(this.tabsDatos[1][0]);
        this.buscar(undefined);

      } else {
        this.myForm = this.createForm({});
      }
    } else {
      this.myForm = this.createForm({});
    }

  }

  public createForm(obj: any) {

    return this.formBuilder.group({
      codigo: [obj.codigo, [Validators.required, Validators.pattern('[0-9]+')]],
      estado: [{ value: obj.estado, disabled: true }, [Validators.required]],
      municipio: [{ value: obj.municipio, disabled: true }, [Validators.required]],
      asentamientoId: [{ value: obj.asentamientoId, disabled: true }, [Validators.required]],
      calle: [{ value: obj.calle, disabled: true }, [Validators.required]],
      numExterior: [{ value: obj.numExterior, disabled: true }, [Validators.required]],
      numInterior: { value: obj.numInterior, disabled: true }
    });

  }



  public guardar() {
    this.enviado.emit({ type: "domicilio", valor: true });
  }
  public cancelar() {
    this.routerPrd.navigate(['/empleados']);
  }


  public enviarFormulario() {

    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }


    const titulo = "¿Deseas guardar cambios?";

    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {
        let obj = this.myForm.value;

        let objenviar: any =
        {
          codigo: obj.codigo,
          municipio: this.idMunicipio,
          estado: this.idEstado,
          asentamientoId: obj.asentamientoId,
          calle: obj.calle,
          numExterior: obj.numExterior,
          numInterior: obj.numInterior,
          personaId: {
            personaId: this.datosPersona.personaId
          }
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);


        if (Boolean(this.tabsDatos[1])) {

          if (this.tabsDatos[1][0].domicilioId == undefined) {
            this.domicilioPrd.save(objenviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
                if (datos.resultado) {
                  this.enviado.emit({ type: "domicilio", datos: [datos.datos] });
                }
              });
            });
          } else {


            objenviar.domicilioId = this.tabsDatos[1][0].domicilioId;

            this.domicilioPrd.update(objenviar).subscribe(datos => {
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
                if (datos.resultado) {
                  this.enviado.emit({ type: "domicilio", datos: [datos.datos] });
                }
              });
            });
          }

        } else {
          this.domicilioPrd.save(objenviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.enviado.emit({ type: "domicilio", datos: [datos.datos] });
              }
            });
          });
        }



      }
    });
  }

  public get f() {
    return this.myForm.controls;
  }




  public buscar(obj: any) {
    debugger;
    this.myForm.controls.estado.setValue("");
    this.myForm.controls.municipio.setValue("");
    this.noCoincide = '';
    let valor: string = this.myForm.controls.codigo.value;

    if (this.myForm.controls.codigo.errors?.pattern === undefined && valor !== null) {
      if (valor.trim() !== "") {

        this.catalogosPrd.getAsentamientoByCodigoPostal(valor).subscribe(datos => {

          if (datos.resultado) {
            this.domicilioCodigoPostal = datos.datos;

            for (let item of datos.datos) {

              this.nombreEstado = item.dedo;
              this.nombreMunicipio = item.dmnpio;
              this.idEstado = item.edo.estadoId;
              this.idMunicipio = item.catmnpio.cmnpio;

              
              this.myForm.controls.municipio.setValue(this.nombreMunicipio);
              this.myForm.controls.estado.setValue(this.nombreEstado);


            }


            this.myForm.controls.asentamientoId.enable();
            this.myForm.controls.numExterior.enable();
            this.myForm.controls.numInterior.enable();
            this.myForm.controls.calle.enable();
          } else {
            this.noCoincide = 'El código postal no fue encontrado';
            this.myForm.controls.asentamientoId.disable();
            this.myForm.controls.numExterior.disable();
            this.myForm.controls.numInterior.disable();
            this.myForm.controls.calle.disable();
            this.nombreEstado = "";
            this.nombreMunicipio = "";
            this.idEstado = -1;
            this.idMunicipio = -1;
            this.domicilioCodigoPostal = []

          }
        });

      }
    }
  }














}
