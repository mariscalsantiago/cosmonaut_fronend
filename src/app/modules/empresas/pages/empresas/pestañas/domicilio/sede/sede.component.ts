import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SedeService } from 'src/app/modules/empresas/services/sede/sede.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-sede',
  templateUrl: './sede.component.html',
  styleUrls: ['./sede.component.scss']
})
export class SedeComponent implements OnInit {

  @Output() enviado = new EventEmitter();
  @Input() datos: any;
  @Input() sede: any;




  public myForm!: FormGroup;
  public submitEnviado: boolean = false;
  public domicilioCodigoPostal: any = [];
  public objdsede: any = [];
  public nombreEstado: string = "";
  public idEstado: number = 0;
  public nombreMunicipio: string = "";
  public idMunicipio: number = 0;
  public insertar: boolean = false;
  public habcontinuardom: boolean = false;
  public objenviar: any = [];
  public insertarMof: boolean = false;
  public noCoincide = '';
  constructor(private formBuilder: FormBuilder, private sedePrd: SedeService,
    private catalogosPrd: CatalogosService, private routerPrd: Router, private routerActivePrd: ActivatedRoute,
    private modalPrd: ModalService) {


  }

  ngOnInit(): void {
    debugger;
    if (this.sede != undefined) {
      
      this.catalogosPrd.getAsentamientoByCodigoPostal(this.sede.codigoPostal).subscribe(datos => {
        if (datos.resultado) {
          this.domicilioCodigoPostal = datos.datos;
          for (let item of datos.datos) {

            if (item.asentamiento == this.sede.colonia) {
              this.idEstado = item.edo.estadoId;
              this.idMunicipio = item.catmnpio.cmnpio;
              this.sede.asentamientoId = item.asentamientoCpCons;
            }

          }

        }

        this.myForm = this.createForm(this.sede);

      });
    }
    let obj: any = {};
    this.myForm = this.createForm(obj);

  }


  public createForm(obj: any) {
    
    return this.formBuilder.group({
      sede: [obj.sedeNombre, [Validators.required]],
      codigo: [obj.codigoPostal, [Validators.required, Validators.pattern('[0-9]+')]],
      estado: [obj.entidadFederativa, [Validators.required]],
      municipio: [obj.municipio, [Validators.required]],
      asentamientoId: [obj.asentamientoId, [Validators.required]],
      calle: [obj.calle, [Validators.required]],
      numExterior: [obj.numeroExterior, [Validators.required]],
      numInterior: [obj.numeroInterior]

    });
  }

  public enviarFormulario() {

    this.submitEnviado = true;

    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    let titulo = (this.datos.insertar) ? "¿Deseas registrar la sede" : "¿Deseas actualizar la sede?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {
        this.guardar();
      }
    });
  }

  public cancelar() {
      this.enviado.emit({type:"cancelar"});
  }

  public guardar() {
    debugger;
    let obj = this.myForm.getRawValue();
   
    this.modalPrd.showMessageDialog(this.modalPrd.loading);

    if (!Boolean(this.sede)) {
      this.objenviar = {
        sede: obj.sede,
        codigo: obj.codigo,
        municipio: this.idMunicipio,
        estado: this.idEstado,
        asentamientoId: obj.asentamientoId,
        calle: obj.calle,
        numExterior: obj.numExterior,
        numInterior: obj.numInterior,
        centrocClienteId: {
          centrocClienteId: this.datos.empresa.centrocClienteId
        },
        sedeId: {
          descripcion: obj.sede,
          centrocClienteId: {
            centrocClienteId: this.datos.empresa.centrocClienteId
          }
        }
      }

      this.sedePrd.save(this.objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
       this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
         if(datos.resultado){
          this.enviado.emit({type:"guardar"});
         }
       });

      });
    }
    else {
      
      this.objenviar = {
        codigo: obj.codigo,
        municipio: this.idMunicipio,
        estado: this.idEstado,
        asentamientoId: obj.asentamientoId,
        calle: obj.calle,
        numExterior: obj.numExterior,
        numInterior: obj.numInterior,
        esActivo:	true,
        centrocClienteId: {
          centrocClienteId: this.datos.empresa.centrocClienteId
        },
      sedeId: this.sede.sedeId, 
      descripcion: obj.sede
      }
      this.sedePrd.modificar(this.objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
         this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
          if(datos.resultado){
           this.enviado.emit({type:"guardar"});
          }
        });
      });
      
    }

  }

  public buscar(obj: any) {


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


  get f() { return this.myForm.controls; }


}

