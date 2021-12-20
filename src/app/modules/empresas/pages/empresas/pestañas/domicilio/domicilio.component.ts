import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomicilioService } from 'src/app/modules/empresas/services/domicilio/domicilio.service';
import { Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { tabla } from 'src/app/core/data/tabla';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-domicilio',
  templateUrl: './domicilio.component.html',
  styleUrls: ['./domicilio.component.scss']
})
export class DomicilioComponent implements OnInit {


  @Output() enviado = new EventEmitter();
  @Input() datos: any;



  public myForm!: FormGroup;

  public submitEnviado: boolean = false;
  public domicilioCodigoPostal: any = [];
  public nombreEstado: string = "";
  public idEstado: number = 0;
  public nombreMunicipio: string = "";
  public idMunicipio: number = 0;
  public id_empresa: number = 0;
  public asentamientoCpCons: number = 0;
  public arreglo: any = [];
  public arregloListaSede: any = [];
  public modsinIdDom: boolean = false;
  //public listaSedeNuevo: boolean = true;
  public listaSedeModificar: boolean = false;
  public cargando: Boolean = false;
  public eliminarSede: boolean = false;
  public noCoincide = '';
  public verSedes: boolean = false;
  public esContinuar: boolean = false;
  public mostarSede: boolean = false;
  public sedeSeleccionada: any;

  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public arreglotablaDesglose: any = {
    columnas: [],
    filas: []
  };


  constructor(private formBuilder: FormBuilder, private domicilioPrd: DomicilioService,
    private catalogosPrd: CatalogosService, private routerPrd: Router,
    private modalPrd: ModalService) { }

  ngOnInit(): void {


    
    this.myForm = this.createForm({});

    this.datos.activarGuardaMod = true;
    this.id_empresa = this.datos.empresa.centrocClienteId;
      this.domicilioPrd.getDetDom(this.id_empresa).subscribe(datos => {
        if (datos.datos) {  
          this.mostarSede = true;     
          this.esContinuar = true;
          let obj = datos.datos[0];
          
          obj.asentamientoCpCons = obj.asentamientoId
          this.catalogosPrd.getAsentamientoByCodigoPostal(obj.codigo).subscribe(datos => {
            
            if (datos.resultado) {
              this.domicilioCodigoPostal = datos.datos;

              for (let item of datos.datos) {

                this.nombreEstado = item.dedo;
                this.nombreMunicipio = item.dmnpio;
                this.idEstado = item.edo.estadoId;
                this.idMunicipio = item.catmnpio.cmnpio;

                obj.municipio = this.nombreMunicipio;
                obj.estado = this.nombreEstado;

              }

            }

            this.myForm = this.createForm(obj);


          });
        }
      });



    //Se cargan las sedes


    this.cargando = true;


    this.domicilioPrd.getListaSede(this.id_empresa).subscribe(datos => {
      
      this.arregloListaSede = datos.datos;
      let columnas: Array<tabla> = [
        new tabla("sedeNombre", "Nombre de la sede"),
        new tabla("codigoPostal", "Código postal"),
        new tabla("municipio", "Municipio o alcadía"),
        new tabla("entidadFederativa", "Entidad Federativa"),
      ];



      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = this.arregloListaSede;
      this.cargando = false;

    });

  }

  public createForm(obj?: any) {

    return this.formBuilder.group({

      codigo: [obj.codigo, [Validators.required, Validators.pattern('[0-9]+')]],
      estado: [obj.estado, [Validators.required]],
      municipio: [obj.municipio, [Validators.required]],
      asentamientoId: [obj.asentamientoCpCons, [Validators.required]],
      calle: [obj.calle, [Validators.required]],
      numExterior: [obj.numExterior, [Validators.required]],
      numInterior: obj.numInterior,
      domicilioId: obj.domicilioId
    });
  }



  public recibirTabla(obj?: any) {
    switch (obj.type) {
      case "editar":  
        this.verdetalle(obj.datos);
        break;
      case "eliminar":
        this.eliminar(obj.datos);
        break;
    }
  }

  public eliminar(obj: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas eliminar la sede?").then((valor) => {
      if (valor) {
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.domicilioPrd.eliminar(obj.sedeId).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
            if (datos.resultado) {
              this.ngOnInit();
            }
          });
        });
      }
    });
  }

  public cancelar() {
    this.enviado.emit({type:"cancelar"});
  }


  public enviarFormulario() {

    this.submitEnviado = true;

    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }
    let titulo: string = (this.datos.insertar) ? "¿Deseas registrar el domicilio" : "¿Deseas actualizar el domicilio?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {
        this.datos.activarGuardaMod = true;
        this.guardar();
      }
    });
  }

  public guardar() {
    let obj = this.myForm.value;

    let objenviar: any =
    {
      domicilioId: obj.domicilioId,
      codigo: obj.codigo,
      municipio: this.idMunicipio,
      estado: this.idEstado,
      asentamientoId: obj.asentamientoId,
      calle: obj.calle,
      numExterior: obj.numExterior,
      numInterior: obj.numInterior,
      centrocClienteId: {
        centrocClienteId: this.datos.empresa.centrocClienteId
      }
    }

    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    if (!this.esContinuar) {
      
      this.domicilioPrd.save(objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        if (datos.resultado)
        {
          this.mostarSede= true;
        }
        this.ngOnInit();
        this.verSedes = false;
      });
    } else {
      
      this.domicilioPrd.modificar(objenviar).subscribe(datos => {
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
        this.ngOnInit();
        this.verSedes = false;
      });
    }
  }

  public verdetalle(obj: any) {

    this.verSedes = true;

    this.sedeSeleccionada = obj;


  }

  public get f() {
    return this.myForm.controls;
  }




  public buscar() {
 
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


  public eventoDetalleSede(evento: any) {
    this.verSedes = false;
    switch (evento.type) {
      case "guardar":
        this.ngOnInit();
        break;
    }
  }


  public continuarPestania() {
    this.enviado.emit({ type: 'domicilio' });
  }


}
