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
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'jornadalaboral']);
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
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'jornadalaboral']);
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

      obj.lunes= true;
      obj.martes= true;
      obj.miercoles= true;
      obj.jueves= true;
      obj.viernes= true;
    
    return this.formbuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      tipoJornadaId: [obj.tipoJornadaId?.tipoJornadaId, [Validators.required]],
      sumaHorasJornada: [obj.sumaHorasJornada, [Validators.required]],
      horaEntrada: [obj.horaEntrada, [Validators.required]],
      horaSalida: [obj.horaSalida, [Validators.required]],
      horaInicioComida: obj.horaInicioComida,
      horaFinComida: obj.horaFinComida,
      lunes: obj.lunes,
      martes: obj.martes,
      miercoles: obj.miercoles,
      jueves: obj.jueves,
      viernes: obj.viernes,
      sabado: obj.sabado,
      domingo: obj.domingo,
      jorndaId: obj.jorndaId


    });
  }


  public recibir($event: any) {
debugger;

    this.modal = false;


    if (this.iconType == "warning") {
      if ($event) {

        let obj = this.myForm.value;
        let peticion: any = {

          tipoJornadaId: {
              tipoJornadaId: obj.tipoJornadaId,
            },
            nombre: obj.nombre,
            mismoHorario: true,
            horarioComida: false,
            incidirAsistencias: true,
            sumaHorasJornada: "J",
            horaEntrada: obj.horaEntrada,
            horaInicioComida: obj.horaInicioComida,
            horaFinComida: obj.horaFinComida,
            horaSalida: obj.horaSalida,
            centrocClienteId: {
              centrocClienteId: this.id_empresa
              },
            anMinutosTolerancia: 88,
            anHayTolerancia: true,
            registroPrimaDominicalAuto: true,
            registroDescansoLaboralAuto: true,
            anPermiteJustificarRetardo: true,
            soloUnRegistroDia: "S",
            paraDiasParcialmenteLaborados: "C",
            heSolicitudHorasExtra: true,
            heMinutos: 15
          
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
        this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'jornadalaboral']);
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
