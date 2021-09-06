import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RepresentanteLegalService } from '../services/representantelegal.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { DatePipe } from '@angular/common';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

@Component({
  selector: 'app-detallerepresentantelegal',
  templateUrl: './detallerepresentantelegal.component.html',
  styleUrls: ['./detallerepresentantelegal.component.scss']
})
export class DetallerepresentantelegalComponent implements OnInit {

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
  public constNacionalidad: number = 1;



  constructor(private formBuilder: FormBuilder, private representantePrd: RepresentanteLegalService, private routerActivePrd: ActivatedRoute,
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
        nacionalidadId: {}
      };
    }

    this.myFormrep = this.createFormrep((objdetrep));
    this.catalogosPrd.getNacinalidades(true).subscribe(datos => this.arreglonacionalidad = datos.datos);

  }

  ngAfterViewInit(): void {

    this.nombre.nativeElement.focus();

  }


  public createFormrep(obj: any) {
    
    let datePipe = new DatePipe("en-MX");
    if(this.insertar){
    obj.nacionalidadId.nacionalidadId = this.constNacionalidad;
    }
    
    return this.formBuilder.group({
      
      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      celular: [obj.celular],
      apellidoMaterno: [obj.apellidoMaterno],
      rfc: [obj.rfc, [Validators.required, Validators.pattern(ConfiguracionesService.regexRFC)]],
      nacionalidadId: [obj.nacionalidadId.nacionalidadId, [Validators.required]],
      curp: [obj.curp, [Validators.required, Validators.pattern(ConfiguracionesService.regexCurp)]],
      emailCorporativo: [obj.emailCorporativo?.toLowerCase(), [Validators.required, Validators.email]],
      contactoInicialEmailPersonal: [obj.contactoInicialEmailPersonal?.toLowerCase(), [ Validators.email]],
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      //fechaAlta: [{ value: ((this.insertar) ? datePipe.transform(new Date(), 'dd-MMM-y') : obj.fechaAlta), disabled: true }, [Validators.required]],
      esActivo: [{ value: (this.insertar) ? true : obj.esActivo, disabled: this.insertar }, [Validators.required]],
      personaId: obj.personaId,
      firma: obj.firma

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

    const titulo = (this.insertar) ? "¿Desea registrar el representante legal" : "¿Desea actualizar los datos del representante legal?";
    
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){

        let obj = this.myFormrep.value;


        let objEnviar: any = {
          nombre: obj.nombre,
          apellidoPaterno: obj.apellidoPaterno,
          apellidoMaterno: obj.apellidoMaterno,
          celular: obj.celular,
          curp: obj.curp,
          emailCorporativo: obj.emailCorporativo?.toLowerCase(),
          contactoInicialEmailPersonal: obj.contactoInicialEmailPersonal?.toLowerCase(),
          rfc: obj.rfc,
          esActivo: obj.esActivo,
          contactoInicialTelefono: obj.contactoInicialTelefono,
          centrocClienteId: {
            centrocClienteId: this.centrocClienteId
          },
          nacionalidadId: {
            nacionalidadId: obj.nacionalidadId
          },
          tipoRepresentanteId: {
            tipoRepresentanteId: this.tipoRepresentanteId
          },
          tipoPersonaId:{
            tipoPersonaId:1
          }
        }

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        if (this.insertar) {
          this.representantePrd.save(objEnviar).subscribe(datos => {

            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);

           this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
             if(datos.resultado){
              this.routerPrd.navigate(["/empresa/detalle/" + this.centrocClienteId + "/representantelegal"]);
             }
           });

          });

        } else {

          objEnviar.personaId = obj.personaId;

          this.representantePrd.modificar(objEnviar).subscribe(datos => {
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
               this.routerPrd.navigate(["/empresa/detalle/" + this.centrocClienteId + "/representantelegal"]);
              }
            });
          });
        }

      }
    });

  }


  public redirect(obj: any) {
    this.routerPrd.navigate(["/empresa/detalle/" + this.centrocClienteId + "/representantelegal"]);

  }
  public recibirTabla(obj: any) {

    if (obj.type == "editar") {
      this.routerPrd.navigate(['company', 'detalle_company', 'modifica'], { state: { datos: obj.datos } });
    }
  }

  get f() { return this.myFormrep.controls; }


}

