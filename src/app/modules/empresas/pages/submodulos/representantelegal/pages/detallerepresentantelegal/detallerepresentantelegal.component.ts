import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RepresentanteLegalService } from '../services/representantelegal.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';

@Component({
  selector: 'app-detallerepresentantelegal',
  templateUrl: './detallerepresentantelegal.component.html',
  styleUrls: ['./detallerepresentantelegal.component.scss']
})
export class DetallerepresentantelegalComponent implements OnInit {

  @ViewChild("nombre") public nombre!:ElementRef;

  public myFormrep!: FormGroup;
  public arreglo: any = [];
  public arreglonacionalidad: any = [];
  public modal: boolean = false;
  public insertar: boolean = false;
  public iconType: string = "";
  public fechaActual: string = "";
  public strTitulo: string = "";
  public nacionalidad: string = "";
  public objdetrep: any;
  public cargando: Boolean = false;
  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public centrocClienteId: number = 0;
  public tipoRepresentanteId: number = 1;
  public submitEnviado: boolean = false;



  constructor(private formBuilder: FormBuilder, private representantePrd: RepresentanteLegalService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router, private catalogosPrd: CatalogosService) {

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      this.strTitulo = (this.insertar) ? "¿Deseas registrar el representante legal?" : "¿Deseas actualizar los datos del representante legal?";

      this.centrocClienteId = datos["id"];

    });


    let fecha = new Date();
    let dia = fecha.getDate().toString();
    let mes = fecha.getMonth() + 1 < 10 ? `0${fecha.getMonth() + 1}` : fecha.getMonth() + 1;
    let anio = fecha.getFullYear();


    this.fechaActual = `${dia}/${mes}/${anio}`;

  }

  ngOnInit(): void {
    

    let objdetrep = history.state.data == undefined ? {} : history.state.data;
    if (this.insertar) {
      objdetrep = {
        nacionalidadId: {}
      };
    }

    this.myFormrep = this.createFormrep((objdetrep));
    this.catalogosPrd.getNacinalidades().subscribe(datos => this.arreglonacionalidad = datos.datos);

  }

  ngAfterViewInit(): void{

    this.nombre.nativeElement.focus();

  }


  public createFormrep(obj: any) {
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      apellidoPaterno: [obj.apellidoPaterno, [Validators.required]],
      apellidoMaterno: [obj.apellidoMaterno],
      nacionalidadId: [obj.nacionalidadId.nacionalidadId, [Validators.required]],
      curp: [obj.curp, [Validators.required, Validators.pattern(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)]],
      emailCorporativo: [obj.emailCorporativo, [Validators.required, Validators.email]],
      contactoInicialEmailPersonal: [obj.contactoInicialEmailPersonal, [Validators.required, Validators.email]],
      contactoInicialTelefono: [obj.contactoInicialTelefono, [Validators.required]],
      fechaAlta: [{ value: ((this.insertar) ? this.fechaActual : obj.fechaAlta), disabled: true }, [Validators.required]],
      activo: [{ value: (this.insertar) ? true : obj.activo, disabled: this.insertar }, [Validators.required]],
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

      this.iconType = "error";
      this.strTitulo = "Campos obligatorios o inválidos";
      this.modal = true;

      return;
    }

    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Desea registrar el representante legal" : "¿Desea actualizar los datos del representante legal?";
    this.modal = true;
  }


  public redirect(obj: any) {
    this.routerPrd.navigate(["/empresa/detalle/" + this.centrocClienteId + "/representantelegal"]);

  }
  public recibirTabla(obj:any){
    
    if(obj.type == "editar"){
      this.routerPrd.navigate(['company','detalle_company','modifica'],{state:{datos:obj.datos}});
    }
  }

  public recibir($evento: any) {

    this.modal = false;
    if (this.iconType == "warning") {
      if ($evento) {
        let obj = this.myFormrep.value;


        let objEnviar: any = {
          nombre: obj.nombre,
          apellidoPaterno: obj.apellidoPaterno,
          apellidoMaterno: obj.apellidoMaterno,
          curp: obj.curp,
          emailCorporativo: obj.emailCorporativo,
          contactoInicialEmailPersonal: obj.contactoInicialEmailPersonal,
          contactoInicialTelefono: obj.contactoInicialTelefono,
          centrocClienteId: {
            centrocClienteId: this.centrocClienteId
          },
          nacionalidadId: {
            nacionalidadId: obj.nacionalidadId
          },
          tipoRepresentanteId: {
            tipoRepresentanteId: this.tipoRepresentanteId
          }
        }

        if (this.insertar) {

          this.representantePrd.save(objEnviar).subscribe(datos => {
            
            this.iconType = datos.resultado ? "success" : "error";
            this.strTitulo = datos.mensaje;
            this.modal = true;

          });

        } else {
          
          objEnviar.personaId = obj.personaId;

          this.representantePrd.modificar(objEnviar).subscribe(datos => {
            this.iconType = datos.resultado ? "success" : "error";
            this.strTitulo = datos.mensaje;
            this.modal = true;
          });
        }

      }
    } else {
      if (this.iconType == "success") {
        this.routerPrd.navigate(["/empresa/detalle/" + this.centrocClienteId + "/representantelegal"]);
      }

      this.modal = false;
    }
  }
  get f() { return this.myFormrep.controls; }


}

