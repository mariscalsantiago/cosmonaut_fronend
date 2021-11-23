import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApoderadoLegalService } from '../services/apoderadoLegal.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-detalleapoderadoLegal',
  templateUrl: './detalleapoderadoLegal.component.html',
  styleUrls: ['./detalleapoderadoLegal.component.scss']
})
export class DetalleapoderadoLegalComponent implements OnInit {

  @ViewChild("nombre") public nombre!: ElementRef;

  public myFormrep!: FormGroup;
  public arreglo: any = [];
  public arreglonacionalidad: any = [];
  public insertar: boolean = false;
  public fechaActual: string = "";
  public nacionalidad: string = "";
  public objdetrep: any;
  public cargando: Boolean = false;
  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public centrocClienteId: number = 0;
  public tipoRepresentanteId: number = 1;
  public submitEnviado: boolean = false;
  public arregloFacultadPoder: any = [];
  public objEnviar: any = [];
  public constNacionalidad: number = 1;


  constructor(private formBuilder: FormBuilder, private apoderadoPrd: ApoderadoLegalService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private catalogosPrd: CatalogosService,
    private modalPrd: ModalService) {

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      this.centrocClienteId = datos["id"];

    });


  }

  ngOnInit(): void {


    let objdetrep = history.state.data == undefined ? {} : history.state.data;
    if (this.insertar) {
      objdetrep = {
        nacionalidadId: {},
        facultadPoderId: {}
      };
    }

    this.myFormrep = this.createFormrep((objdetrep));
    this.catalogosPrd.getNacinalidades(true).subscribe(datos => this.arreglonacionalidad = datos.datos);
    this.catalogosPrd.getFacultadPoder(true).subscribe(datos => this.arregloFacultadPoder = datos.datos);

  }

  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }


  public createFormrep(obj: any) {
    
    
    if(!this.insertar){

        if(obj.esActivo== 'Activo'){
          obj.esActivo= 'true';
        }else{
          obj.esActivo= 'false';
        }
        
    }else{
      obj.nacionalidadId.nacionalidadId = this.constNacionalidad;
    }

    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      celular: [obj.celular, []],
      apellidoMaterno: [obj.apellidoMaterno],
      rfc: [obj.rfc, [Validators.required, Validators.pattern(ConfiguracionesService.regexRFC)]],
      nacionalidadId: [obj.nacionalidadId?.nacionalidadId, [Validators.required]],
      curp: [obj.curp, [Validators.required, Validators.pattern(ConfiguracionesService.regexCurp)]],
      emailCorporativo: [obj.emailCorporativo?.toLowerCase(), [Validators.required, Validators.email]],
      contactoInicialEmailPersonal: [obj.contactoInicialEmailPersonal?.toLowerCase(), [Validators.email]],
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      poderNotarial: [obj.poderNotarial, [Validators.required]],
      facultadPoderId: [obj.facultadPoderId?.facultadPoderId, [Validators.required]],
      //fechaAlta: [{ value: ((this.insertar) ? datePipe.transform(new Date(), 'dd-MMM-y') : obj.fechaAlta), disabled: true }, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }, [Validators.required]],
      personaId: obj.personaId

    });
  }


  public activarMultiseleccion() {
    this.multiseleccion = true;
  }


  public guardarMultiseleccion() {
    this.multiseleccionloading = true;
    setTimeout(() => {
      this.multiseleccionloading = false;
      this.multiseleccion = false;
    }, 3000);
  }


  public cancelarMulti() {
    this.multiseleccionloading = false;
    this.multiseleccion = false;
  }


  public enviarPeticion() {
    this.submitEnviado = true;

    if (this.myFormrep.invalid) {

      this.modalPrd.showMessageDialog(this.modalPrd.error);

      return;
    }

    let moralFiscia = this.myFormrep.controls.rfc.value.substr(10,12).length;
    if(moralFiscia === 3){
      let rfcFisica = this.myFormrep.controls.rfc.value.substr(0,10);
      let curp = this.myFormrep.controls.curp.value.substr(0,10);
      if(curp !== rfcFisica){
        this.modalPrd.showMessageDialog(this.modalPrd.error,"Los datos de RFC y CURP no corresponden");
  
        return;
      }
    }
    else if(moralFiscia === 2){
      let rfcMoral = this.myFormrep.controls.rfc.value.substr(0,9);
      let curp = this.myFormrep.controls.curp.value.substr(0,9);
      if(curp !== rfcMoral){
        this.modalPrd.showMessageDialog(this.modalPrd.error,"Los datos de RFC y CURP no corresponden");
  
        return;
      }
    }

    const titulo = (this.insertar) ? "¿Desea registrar al apoderado legal" : "¿Desea actualizar los datos del apoderado legal?";

    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {

        let obj = this.myFormrep.value;
        
        if (obj.esActivo == 'true') {
          obj.esActivo = 'true'
        } else {
          obj.esActivo = 'false'
        }

        this.objEnviar = {
          nombre: obj.nombre,
          apellidoPaterno: obj.apellidoPaterno,
          apellidoMaterno: obj.apellidoMaterno,
          celular: obj.celular,
          curp: obj.curp,
          emailCorporativo: obj.emailCorporativo?.toLowerCase(),
          contactoInicialEmailPersonal: obj.contactoInicialEmailPersonal?.toLowerCase(),
          rfc: obj.rfc,
          esActivo: obj.esActivo,
          poderNotarial: obj.poderNotarial,

          contactoInicialTelefono: obj.contactoInicialTelefono,
          centrocClienteId: {
            centrocClienteId: this.centrocClienteId
          },
          nacionalidadId: {
            nacionalidadId: obj.nacionalidadId
          },
          facultadPoderId: {
            facultadPoderId: obj.facultadPoderId
          },
          tipoPersonaId:{
            tipoPersonaId:6
          }

        }

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        if (this.insertar) {
          this.apoderadoPrd.save(this.objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.routerPrd.navigate(["/empresa/detalle/" + this.centrocClienteId + "/apoderadoLegal"]);
              }
            });

          });

        } else {
          
          this.objEnviar.personaId = obj.personaId;

          this.apoderadoPrd.modificar(this.objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.routerPrd.navigate(["/empresa/detalle/" + this.centrocClienteId + "/apoderadoLegal"]);
              }
            });
          });
        }

      }
    });

  }


  public redirect(obj: any) {
    this.routerPrd.navigate(["/empresa/detalle/" + this.centrocClienteId + "/apoderadoLegal"]);

  }
  public recibirTabla(obj: any) {

    if (obj.type == "editar") {
      this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: obj.datos } });
    }
  }

  get f() { return this.myFormrep.controls; }


}

