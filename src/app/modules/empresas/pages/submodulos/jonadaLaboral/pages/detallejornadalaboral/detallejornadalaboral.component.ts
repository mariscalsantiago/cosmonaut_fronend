import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { JornadalaboralService } from '../../services/jornadalaboral.service';

@Component({
  selector: 'app-detallejornadalaboral',
  templateUrl: './detallejornadalaboral.component.html',
  styleUrls: ['./detallejornadalaboral.component.scss']
})
export class DetallejornadalaboralComponent implements OnInit {
  @ViewChild("nombre") public nombre!:ElementRef;
  public modal: boolean = false;
  public strTitulo: string = "";
  public iconType: string = "";

  public myForm!: FormGroup;

  public submitInvalido: boolean = false;
  public esInsert: boolean = false;
  public id_empresa: number = 0;
  public activadoISR: boolean = false;
  public arreglotipojornadas:any = [];



  constructor(private formbuilder: FormBuilder, private activeprd: ActivatedRoute,
    private routerPrd: Router, private jornadaPrd: JornadalaboralService,
    private catalogosPrd:CatalogosService) { }

  ngOnInit(): void {


    this.activeprd.params.subscribe(datos => {
      this.id_empresa = datos["id"];
      if (datos["tipoinsert"] == "nuevo") {
        this.esInsert = true;
      } else if (datos["tipoinsert"] == "editar") {
        this.esInsert = false;
      } else {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'gruposnomina']);
      }
    });

    let obj: any = {
      esquemaPagoId: {},
      monedaId: {},
      centrocClienteId: {},
      clabe: {},
      periodicidadPagoId: {},
      basePeriodoId: {},
      periodoAguinaldoId: {}
    }

    this.myForm = this.crearForm(obj);

    if (!this.esInsert) {
      obj = history.state.data;
      if (obj == undefined) {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'gruposnomina']);
        return;
      } else {
        this.jornadaPrd.getAllJornada(obj.id).subscribe(datos => {
          this.myForm = this.crearForm(datos.datos);

        });;

      }
    }


    this.catalogosPrd.getTipoJornadas().subscribe(datos => this.arreglotipojornadas = datos.datos);

  }

  ngAfterViewInit(): void{

    this.nombre.nativeElement.focus();

  }

  public crearForm(obj: any) {

    if (!this.esInsert) {
      obj.maneraCalcularSubsidio = obj.maneraCalcularSubsidio == "P" ? "periodica" : "diaria";
      obj.esAutomatica = `${obj.esAutomatica}`
      obj.clabe.clabe = `${obj.clabe.clabe}`
    }

    return this.formbuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      esquemaPagoId: [obj.esquemaPagoId.esquemaPagoId, [Validators.required]],
      monedaId: [obj.monedaId.monedaId, [Validators.required]],
      centrocClienteId: [obj.centrocClienteId.centrocClienteId, [Validators.required]],
      clabe: [obj.clabe.clabe, [Validators.required]],
      periodicidadPagoId: [obj.periodicidadPagoId.periodicidadPagoId, [Validators.required]],
      basePeriodoId: [obj.basePeriodoId.basePeriodoId, [Validators.required]],
      periodoAguinaldoId: [obj.periodoAguinaldoId.periodoAguinaldoId, [Validators.required]],
      isrAguinaldoReglamento: obj.isrAguinaldoReglamento,
      maneraCalcularSubsidio: [obj.maneraCalcularSubsidio, [Validators.required]],
      esAutomatica: [obj.esAutomatica, [Validators.required]],
      grupoNominaId: obj.grupoNominaId

    });
  }


  public recibir($event: any) {


    this.modal = false;


    if (this.iconType == "warning") {


      if ($event) {

        let obj = this.myForm.value;

        let subsidio = obj.maneraCalcularSubsidio == "periodica" ? "P" : "D";

        let peticion: any = {
          nombre: obj.nombre,
          esAutomatica: obj.esAutomatica,
          maneraCalcularSubsidio: subsidio,
          esquemaPagoId: { esquemaPagoId: obj.esquemaPagoId },
          monedaId: { monedaId: obj.monedaId },
          centrocClienteId: { centrocClienteId: obj.centrocClienteId },
          clabe: { clabe: obj.clabe },
          periodicidadPagoId: { periodicidadPagoId: obj.periodicidadPagoId },
          basePeriodoId: { basePeriodoId: obj.basePeriodoId },
          periodoAguinaldoId: { periodoAguinaldoId: obj.periodoAguinaldoId },
          isrAguinaldoReglamento: obj.isrAguinaldoReglamento,

        };





        if (this.esInsert) {

          this.jornadaPrd.save(peticion).subscribe(datos => {
            console.log("Esto despues de guardar");
            console.log(datos);

            this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.modal = true;

          });
        } else {

          peticion.grupoNominaId = obj.grupoNominaId;
          peticion.esActivo = true;

          this.jornadaPrd.modificar(peticion).subscribe(datos => {

            this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.modal = true;

          });

        }

      }


    } else {
      this.modal = false;

      if (this.iconType == "success") {
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'gruposnomina']);
      }
    }
  }


  public enviarPeticion() {




    this.submitInvalido = true;
    if (this.myForm.invalid) {
      this.iconType = "error";
      this.strTitulo = "Campos obligatorios o inválidos";
      this.modal = true;
      return;

    }



    this.iconType = "warning";
    this.strTitulo = (this.esInsert) ? "¿Deseas registrar la jornada laboral?" : "¿Deseas actualizar los datos de la jornada laboral?";
  
    this.modal = true;

  }

  public cancelar() {
    this.routerPrd.navigate(['/empresa/detalle', this.id_empresa, 'jornadalaboral']);
  }

  get f() {
    return this.myForm.controls;
  }


  public activar(obj: any) {
    this.activadoISR = obj.checked;
  }

}
