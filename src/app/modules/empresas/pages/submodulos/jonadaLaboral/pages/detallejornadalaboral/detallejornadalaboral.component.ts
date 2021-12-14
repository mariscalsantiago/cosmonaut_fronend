import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { JornadalaboralService } from '../../services/jornadalaboral.service';

@Component({
  selector: 'app-detallejornadalaboral',
  templateUrl: './detallejornadalaboral.component.html',
  styleUrls: ['./detallejornadalaboral.component.scss']
})
export class DetallejornadalaboralComponent implements OnInit {
  @ViewChild("nombre") public nombre!: ElementRef;
  public myForm!: FormGroup;

  public submitInvalido: boolean = false;
  public esInsert: boolean = false;
  public id_empresa: number = 0;
  public activadoISR: boolean = false;
  public arreglotipojornadas: any = [];
  public peticion: any = [];
  public arreglosumahoras: any = [];
  public arreglodetalleJornada: any = [];
  public horarioComida: boolean = false;
  public jornada: any;
  public horaSalida: any;
  public hr: number = 0;
  public hrEntrada: number = 0;
  public newValue: any;
  public hrComida: number = 0;
  public newValueComida: any;
  public hrSalida: number = 0;
  public hrInicioComidaTemporar: number = 0;


  constructor(private formbuilder: FormBuilder, private activeprd: ActivatedRoute,
    private routerPrd: Router, private jornadaPrd: JornadalaboralService,
    private catalogosPrd: CatalogosService, private modalPrd: ModalService) {

    this.activeprd.params.subscribe(datos => {
      this.esInsert = (datos["tipoinsert"] == 'nuevo');
      this.id_empresa = datos["id"]
    });

  }

  ngOnInit(): void {


    let objdetrep = history.state.data == undefined ? {} : history.state.data;
    if (!this.esInsert) {
      
      this.jornadaPrd.getdetalleJornadaHorario(this.id_empresa, objdetrep.jornadaId).subscribe(datos => {
        this.arreglodetalleJornada = datos.datos
        console.log(this.arreglodetalleJornada);
        this.myForm = this.crearForm(this.arreglodetalleJornada);

        this.selectJornadaInicial(this.myForm.controls.sumaHorasJornadaId)
        this.hrDeSalida(undefined);
        this.hrInicio(undefined);

      });;
    } else {

      this.myForm = this.crearForm((objdetrep));
      this.selectJornada(this.myForm.controls.sumaHorasJornadaId)

    }

    this.catalogosPrd.getTipoJornadas(true).subscribe(datos => this.arreglotipojornadas = datos.datos);
    this.catalogosPrd.getSumaHras(true).subscribe(datos => this.arreglosumahoras = datos.datos);


  }

  ngAfterViewInit(): void {

    // this.nombre.nativeElement.focus();

  }


  public crearForm(obj: any) {

    if (!this.esInsert) {

      for (let item of obj.nclHorarioJornada) {

        if (item.dia == 1 && item.esActivo == true) {
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if (item.horaInicioComida != undefined) {
            let splitHIC = item.horaInicioComida.split(' ');
            let horaHIC = splitHIC[1];
            let splitFHIC = horaHIC.split('.');
            obj.horaInicioComida = splitFHIC[0];
          }
          if (item.horaFinComida != undefined) {
            let splitHFC = item.horaFinComida.split(' ');
            let horaHFC = splitHFC[1];
            let splitFHFC = horaHFC.split('.');
            obj.horaFinComida = splitFHFC[0];
          }
          obj.lunes = true;

        }
        if (item.dia == 1) {
          this.arreglodetalleJornada.horarioJornadaId1 = item.horarioJornadaId;
        }
        if (item.dia == 2 && item.esActivo == true) {
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if (item.horaInicioComida != undefined) {
            let splitHIC = item.horaInicioComida.split(' ');
            let horaHIC = splitHIC[1];
            let splitFHIC = horaHIC.split('.');
            obj.horaInicioComida = splitFHIC[0];
          }
          if (item.horaFinComida != undefined) {
            let splitHFC = item.horaFinComida.split(' ');
            let horaHFC = splitHFC[1];
            let splitFHFC = horaHFC.split('.');
            obj.horaFinComida = splitFHFC[0];
          }
          obj.martes = true;

        }
        if (item.dia == 2) {
          this.arreglodetalleJornada.horarioJornadaId2 = item.horarioJornadaId;
        }
        if (item.dia == 3 && item.esActivo == true) {
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if (item.horaInicioComida != undefined) {
            let splitHIC = item.horaInicioComida.split(' ');
            let horaHIC = splitHIC[1];
            let splitFHIC = horaHIC.split('.');
            obj.horaInicioComida = splitFHIC[0];
          }
          if (item.horaFinComida != undefined) {
            let splitHFC = item.horaFinComida.split(' ');
            let horaHFC = splitHFC[1];
            let splitFHFC = horaHFC.split('.');
            obj.horaFinComida = splitFHFC[0];
          }
          obj.miercoles = true;
        }
        if (item.dia == 3) {
          this.arreglodetalleJornada.horarioJornadaId3 = item.horarioJornadaId;
        }
        if (item.dia == 4 && item.esActivo == true) {
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if (item.horaInicioComida != undefined) {
            let splitHIC = item.horaInicioComida.split(' ');
            let horaHIC = splitHIC[1];
            let splitFHIC = horaHIC.split('.');
            obj.horaInicioComida = splitFHIC[0];
          }
          if (item.horaFinComida != undefined) {
            let splitHFC = item.horaFinComida.split(' ');
            let horaHFC = splitHFC[1];
            let splitFHFC = horaHFC.split('.');
            obj.horaFinComida = splitFHFC[0];
          }
          obj.jueves = true;
        }
        if (item.dia == 4) {
          this.arreglodetalleJornada.horarioJornadaId4 = item.horarioJornadaId;
        }
        if (item.dia == 5 && item.esActivo == true) {
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if (item.horaInicioComida != undefined) {
            let splitHIC = item.horaInicioComida.split(' ');
            let horaHIC = splitHIC[1];
            let splitFHIC = horaHIC.split('.');
            obj.horaInicioComida = splitFHIC[0];
          }
          if (item.horaFinComida != undefined) {
            let splitHFC = item.horaFinComida.split(' ');
            let horaHFC = splitHFC[1];
            let splitFHFC = horaHFC.split('.');
            obj.horaFinComida = splitFHFC[0];
          }
          obj.viernes = true;

        }
        if (item.dia == 5) {
          this.arreglodetalleJornada.horarioJornadaId5 = item.horarioJornadaId;
        }
        if (item.dia == 6 && item.esActivo == true) {
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if (item.horaInicioComida != undefined) {
            let splitHIC = item.horaInicioComida.split(' ');
            let horaHIC = splitHIC[1];
            let splitFHIC = horaHIC.split('.');
            obj.horaInicioComida = splitFHIC[0];
          }
          if (item.horaFinComida != undefined) {
            let splitHFC = item.horaFinComida.split(' ');
            let horaHFC = splitHFC[1];
            let splitFHFC = horaHFC.split('.');
            obj.horaFinComida = splitFHFC[0];
          }
          obj.sabado = true;

        }
        if (item.dia == 6) {
          this.arreglodetalleJornada.horarioJornadaId6 = item.horarioJornadaId;
        }
        if (item.dia == 7 && item.esActivo == true) {
          let splitHE = item.horaEntrada.split(' ');
          let horaHE = splitHE[1];
          let splitFHE = horaHE.split('.');
          obj.horaEntrada = splitFHE[0];
          let splitHS = item.horaSalida.split(' ');
          let horaHS = splitHS[1];
          let splitFHS = horaHS.split('.');
          obj.horaSalida = splitFHS[0];
          if (item.horaInicioComida != undefined) {
            let splitHIC = item.horaInicioComida.split(' ');
            let horaHIC = splitHIC[1];
            let splitFHIC = horaHIC.split('.');
            obj.horaInicioComida = splitFHIC[0];
          }
          if (item.horaFinComida != undefined) {
            let splitHFC = item.horaFinComida.split(' ');
            let horaHFC = splitHFC[1];
            let splitFHFC = horaHFC.split('.');
            obj.horaFinComida = splitFHFC[0];
          }
          obj.domingo = true;

        }
        if (item.dia == 7) {
          this.arreglodetalleJornada.horarioJornadaId7 = item.horarioJornadaId;
        }
      }

    } else {

      obj.lunes = true;
      obj.martes = true;
      obj.miercoles = true;
      obj.jueves = true;
      obj.viernes = true;
    }
    
    return this.formbuilder.group({
      nombre: [obj.nombre, [Validators.required]],
      tipoJornadaId: [obj.tipoJornadaId?.tipoJornadaId, [Validators.required]],
      sumaHorasJornadaId: [obj.sumaHorasJornadaId?.sumaHorasJornadaId, [Validators.required]],
      horaEntrada: [obj.horaEntrada, [Validators.required]],
      horaSalida: [obj.horaSalida, [Validators.required]],
      horaInicioComida: [obj.horaInicioComida, [Validators.required]],
      horaFinComida: [obj.horaFinComida, [Validators.required]],
      lunes: obj.lunes,
      martes: obj.martes,
      miercoles: obj.miercoles,
      jueves: obj.jueves,
      viernes: obj.viernes,
      sabado: obj.sabado,
      domingo: obj.domingo,
      jornadaId: obj.jornadaId


    });
  }

  public correctoHoraComida(): Boolean {

    debugger;
    let respuesta: boolean = true;
    let horaComidaFin = Number(this.myForm.controls.horaFinComida.value.substring(0, 2));
    if(this.myForm.controls.tipoJornadaId.value === '02'){
      
      let horaInicioComida = Number(this.myForm.controls.horaInicioComida.value.substring(0, 2));
      if (horaInicioComida != null && horaInicioComida != 0) {

      if (horaComidaFin <= horaInicioComida) {
          this.modalPrd.showMessageDialog(this.modalPrd.error, 'La hora fin de comida debe ser mayor que la hora de inicio de comida');
          this.myForm.controls.horaFinComida.setValue("");
          respuesta = false;
        }
      }

    
    }
    else{  
      debugger;
    if (horaComidaFin != null && horaComidaFin != 0) {
      let horaSalidaFin = Number(this.myForm.controls.horaSalida.value.substring(0, 2));
      let horaEntrada = Number(this.myForm.controls.horaEntrada.value.substring(0, 2));

      let horaInicioComida = Number(this.myForm.controls.horaInicioComida.value.substring(0, 2));
      if ((horaInicioComida >= horaSalidaFin) || (horaInicioComida <= horaEntrada)) {
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'La hora de la comida esta fuera del horario laboral');
        this.myForm.controls.horaFinComida.setValue("");
        this.myForm.controls.horaInicioComida.setValue("");
        respuesta = false;
      }
    }
    let horaInicioComida = Number(this.myForm.controls.horaInicioComida.value.substring(0, 2));
    if (horaInicioComida != null && horaInicioComida != 0) {


      if (horaComidaFin <= horaInicioComida) {
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'La hora fin de comida debe ser mayor que la hora de inicio de comida');
        this.myForm.controls.horaFinComida.setValue("");
        respuesta = false;
      }
    }
    }
    return respuesta;
  }

  public enviarPeticion() {
    
    this.submitInvalido = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }
debugger;
   if(this.myForm.controls.tipoJornadaId.value == 1 || this.myForm.controls.tipoJornadaId.value == 2){
      if (this.myForm.controls.horaInicioComida.value && !this.myForm.controls.horaFinComida.value) {
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'La hora fin de comida debe ser capturada');
        //this.myForm.controls.horaFinComida.setValue("");
        return;
      }
      else if (!this.myForm.controls.horaInicioComida.value && this.myForm.controls.horaFinComida.value) {
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'La hora inicio de comida debe ser capturada');
        //this.myForm.controls.horaFinComida.setValue("");
        return;
      }
      else if (this.myForm.controls.horaFinComida.value && this.myForm.controls.horaInicioComida.value) {
        if (!this.correctoHoraComida()) {
          return;
      }
    }
   }

    const titulo = this.esInsert ? "¿Deseas registrar la jornada laboral?" : "¿Deseas actualizar los datos de la jornada laboral?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (this.myForm.value.sumaHorasJornadaId === '1') {
        this.myForm.value.horaSalida = this.horaSalida;
      }
      if (valor) {

        debugger;
        let obj = this.myForm.getRawValue();

        if (!obj.lunes) { obj.lunes = false }
        if (!obj.martes) { obj.martes = false }
        if (!obj.miercoles) { obj.miercoles = false }
        if (!obj.jueves) { obj.jueves = false }
        if (!obj.viernes) { obj.viernes = false }
        if (!obj.sabado) { obj.sabado = false }
        if (!obj.domingo) { obj.domingo = false }
        if (obj.horaInicioComida != null) {
          this.horarioComida = true
        } else {
          this.horarioComida = false
        }

        this.peticion = {
          tipoJornadaId: {
            tipoJornadaId: obj.tipoJornadaId,
          },
          nombre: obj.nombre,
          mismoHorario: false,
          horarioComida: this.horarioComida,
          sumaHorasJornadaId: {
            sumaHorasJornadaId: obj.sumaHorasJornadaId,
          },
          horaEntrada: obj.horaEntrada,
          horaInicioComida: obj.horaInicioComida,
          horaFinComida: obj.horaFinComida,
          horaSalida: obj.horaSalida,
          centrocClienteId: {
            centrocClienteId: this.id_empresa

          },

          nclHorarioJornada: [
            {
              dia: 1,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.lunes

            },
            {
              dia: 2,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.martes

            },
            {
              dia: 3,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.miercoles

            },
            {
              dia: 4,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.jueves

            },
            {
              dia: 5,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.viernes

            },
            {
              dia: 6,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.sabado

            },
            {
              dia: 7,
              horaEntrada: obj.horaEntrada,
              horaInicioComida: obj.horaInicioComida,
              horaFinComida: obj.horaFinComida,
              horaSalida: obj.horaSalida,
              esActivo: obj.domingo

            }
          ]
        };

        if (this.esInsert) {

          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.jornadaPrd.save(this.peticion).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'jornadalaboral']);
              }
            });

          });
        } else {
          debugger;

          if (String(obj.sumaHorasJornadaId) === '1') {

            if (this.horaSalida !== undefined) {
              this.hrInicio(obj.horaEntrada)
              obj.horaSalida = this.horaSalida;
            }

          }
          this.peticion = {
            jornadaId: obj.jornadaId,
            tipoJornadaId: {
              tipoJornadaId: obj.tipoJornadaId,
            },
            nombre: obj.nombre,
            mismoHorario: false,
            horarioComida: this.horarioComida,
            sumaHorasJornadaId: {
              sumaHorasJornadaId: obj.sumaHorasJornadaId,
            },
            horaEntrada: obj.horaEntrada,
            horaInicioComida: obj.horaInicioComida,
            horaFinComida: obj.horaFinComida,
            horaSalida: obj.horaSalida,
            centrocClienteId: {
              centrocClienteId: this.id_empresa

            },

            nclHorarioJornada: [
              {
                dia: 1,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId1,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.lunes

              },
              {
                dia: 2,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId2,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.martes

              },
              {
                dia: 3,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId3,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.miercoles

              },
              {
                dia: 4,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId4,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.jueves

              },
              {
                dia: 5,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId5,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.viernes

              },
              {
                dia: 6,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId6,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.sabado

              },
              {
                dia: 7,
                horarioJornadaId: this.arreglodetalleJornada.horarioJornadaId7,
                horaEntrada: obj.horaEntrada,
                horaInicioComida: obj.horaInicioComida,
                horaFinComida: obj.horaFinComida,
                horaSalida: obj.horaSalida,
                esActivo: obj.domingo

              }
            ]
          };
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.jornadaPrd.modificar(this.peticion).subscribe(datos => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
              if (datos.resultado) {
                this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'jornadalaboral']);
              }
            });

          });

        }
      }
    });


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

  public selectJornadaInicial(op: any) {
    debugger;
    this.myForm.controls.horaFinComida.disable();
    this.myForm.controls.horaInicioComida.disable();
    this.jornada = String(op.value);
    if (this.jornada == '1') {
      this.myForm.controls.horaSalida.disable();
      this.myForm.controls.horaInicioComida.setValidators([]);
      this.myForm.controls.horaInicioComida.updateValueAndValidity();
      this.myForm.controls.horaFinComida.setValidators([]);
      this.myForm.controls.horaFinComida.updateValueAndValidity();
    }
    if (this.jornada == '2') {
      this.myForm.controls.horaSalida.enable();
      this.myForm.controls.horaInicioComida.setValidators([]);
      this.myForm.controls.horaInicioComida.updateValueAndValidity();
      this.myForm.controls.horaFinComida.setValidators([]);
      this.myForm.controls.horaFinComida.updateValueAndValidity();


    }

      if (this.jornada == '3') {
      let horaSalida = this.myForm.controls.horaSalida.value;
        if(!this.esInsert){
            this.myForm.controls.horaInicioComida.enable();
            this.myForm.controls.horaFinComida.enable();
        }
        else if (horaSalida !== undefined && this.esInsert) {
          this.hrSalida = Number(horaSalida.substring(0, 2));
          this.myForm.controls.horaInicioComida.enable();
        }
     // this.myForm.controls.horaInicioComida.setValue('');
     // this.myForm.controls.horaFinComida.setValue('');  
      this.myForm.controls.horaSalida.enable();
      this.myForm.controls.horaInicioComida.setValidators([Validators.required]);
      this.myForm.controls.horaInicioComida.updateValueAndValidity();
      this.myForm.controls.horaFinComida.setValidators([Validators.required]);
      this.myForm.controls.horaFinComida.updateValueAndValidity();

    }


  }

  public selectJornada(op: any) {
    debugger;
    this.myForm.clearValidators();
    this.myForm.controls.horaFinComida.disable();
    this.myForm.controls.horaInicioComida.disable();
    this.jornada = String(op.value);
    if (this.jornada == '1') {
      this.myForm.controls.horaInicioComida.setValue(null);
      this.myForm.controls.horaFinComida.setValue(null);  
      this.myForm.controls.horaEntrada.setValue(null);
      this.myForm.controls.horaSalida.setValue(null); 
      
      this.myForm.controls.horaSalida.disable();
      this.myForm.controls.horaInicioComida.setValidators([]);
      this.myForm.controls.horaInicioComida.updateValueAndValidity();
      this.myForm.controls.horaFinComida.setValidators([]);
      this.myForm.controls.horaFinComida.updateValueAndValidity();
    }
    if (this.jornada == '2') {
      this.myForm.controls.horaInicioComida.setValue(null);
      this.myForm.controls.horaFinComida.setValue(null);  
      this.myForm.controls.horaEntrada.setValue(null);
      this.myForm.controls.horaSalida.setValue(null); 

      this.myForm.controls.horaSalida.enable();
      this.myForm.controls.horaInicioComida.setValidators([]);
      this.myForm.controls.horaInicioComida.updateValueAndValidity();
      this.myForm.controls.horaFinComida.setValidators([]);
      this.myForm.controls.horaFinComida.updateValueAndValidity();


    }

      if (this.jornada == '3') {
        debugger;
      let horaSalida = this.myForm.controls.horaSalida.value;
        if(!this.esInsert){
            this.myForm.controls.horaInicioComida.enable();
            this.myForm.controls.horaFinComida.enable();
        }
        else if (horaSalida !== undefined && this.esInsert) {
          this.hrSalida = Number(horaSalida.substring(0, 2));
          this.myForm.controls.horaInicioComida.enable();
        }
        this.myForm.controls.horaInicioComida.setValue(null);
        this.myForm.controls.horaFinComida.setValue(null);  
        this.myForm.controls.horaEntrada.setValue(null);
        this.myForm.controls.horaSalida.setValue(null);
        
      this.myForm.controls.horaSalida.enable();
      this.myForm.controls.horaInicioComida.setValidators([Validators.required]);
      this.myForm.controls.horaInicioComida.updateValueAndValidity();
      this.myForm.controls.horaFinComida.setValidators([Validators.required]);
      this.myForm.controls.horaFinComida.updateValueAndValidity();

    }


  }


  public hrDeOpcionalJornadaOcho(response: any) {
debugger;
    let horaSalidaFin;
    let horaSalida = this.myForm.controls.horaSalida.value;
    if (response !== undefined) {
      horaSalidaFin = response.value;
    }
    if (horaSalida !== undefined) {
      horaSalidaFin = horaSalida;
    }
    if (horaSalidaFin !== undefined) {     
      if(this.jornada === '1'){
      this.myForm.controls.horaInicioComida.enable();
      this.myForm.controls.horaFinComida.enable();
      }
    }
  }



  public hrDeSalida(response: any) {
    debugger;    

    let horaSalidaFin;
    let horaSalida = this.myForm.controls.horaSalida.value;
    if (response !== undefined) {
      horaSalidaFin = response.value;
    }
    if (horaSalida !== undefined) {
      horaSalidaFin = horaSalida;
    }
    if (horaSalidaFin !== undefined) {
      this.hrSalida = Number(horaSalidaFin.substring(0, 2));
      if(this.jornada !== '1'){
      this.myForm.controls.horaInicioComida.enable();
      }
    }
  }


  public hrInicioComida(response: any) {
    debugger;
    if (response.value !== undefined) {
    

      this.hrComida = Number(response.value.substring(0, 2));
      this.newValueComida = response.value.replace(response.value.substring(0, 2), Number(response.value.substring(0, 2)) + 1)      
      if (this.hrSalida ===0){
        let horaSalida = this.myForm.controls.horaSalida.value;
        this.hrSalida= Number(horaSalida.substring(0, 2));;
    }
      if(this.myForm.controls.tipoJornadaId.value === '02'){

        if (this.hrComida >= this.hrEntrada && this.hrComida < this.hrSalida) {
          this.myForm.controls.horaFinComida.enable();
          this.myForm.controls.horaFinComida.setValue(this.newValueComida);
          this.myForm.value.horaFinComida = this.newValueComida;
          this.hrDeSalida(undefined);
  
        } else {
          this.modalPrd.showMessageDialog(this.modalPrd.error, 'La hora de la comida esta fuera del horario laboral');
          this.myForm.controls.horaFinComida.setValue("");
          this.myForm.controls.horaInicioComida.setValue("");
        }

      }else{  
      if (this.hrComida >= this.hrEntrada && this.hrComida < this.hrSalida) {
        this.myForm.controls.horaFinComida.enable();
        this.myForm.controls.horaFinComida.setValue(this.newValueComida);
        this.myForm.value.horaFinComida = this.newValueComida;
        this.hrDeSalida(undefined);

      } else {
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'La hora de la comida debe ser mayor a la hora de entrada y menor a la hora de salida');
        this.myForm.controls.horaFinComida.setValue("");
        this.myForm.controls.horaInicioComida.setValue("");
      }
    }

    }
  }


  public hrFinComida(response: any) {
    debugger;
    if (response.value !== undefined) {

    
      this.hrComida = Number(response.value.substring(0, 2));
      let horaInicioComida = Number(this.myForm.controls.horaInicioComida.value.substring(0, 2));
      this.newValueComida = response.value.replace(response.value.substring(0, 2), Number(response.value.substring(0, 2)) + 1)

      if(this.myForm.controls.tipoJornadaId.value === '02'){

        if (this.hrComida >= this.hrEntrada && this.hrComida < this.hrSalida && this.hrComida > horaInicioComida) {
          this.myForm.controls.horaFinComida.setValue(this.newValueComida);
          this.myForm.value.horaFinComida = this.newValueComida;
          this.hrDeSalida(undefined);
  
        } else {
          this.modalPrd.showMessageDialog(this.modalPrd.error, 'La hora de la comida esta fuera del horario laboral');
          this.myForm.controls.horaFinComida.setValue("");
        }

      }else{  
      if (this.hrComida >= this.hrEntrada && this.hrComida < this.hrSalida && this.hrComida > horaInicioComida) {
        this.newValueComida = response.value.replace(response.value.substring(0, 2), Number(response.value.substring(0, 2)))
        this.myForm.controls.horaFinComida.setValue(this.newValueComida);
        this.myForm.value.horaFinComida = this.newValueComida;
        this.hrDeSalida(undefined);

      } else {
        this.modalPrd.showMessageDialog(this.modalPrd.error, 'La hora fin de la comida debe ser menor a la hora de salida y mayor a la hora de entrada e inicio de ásta');
        this.myForm.controls.horaFinComida.setValue("");        
      }
    }

    }
  }


  public hrInicio(response: any) {
    let horaSalida;
    if(response == undefined){
      horaSalida = this.myForm.controls.horaEntrada.value;
    }else{
      horaSalida = response.value;
    }
    if (this.jornada === '1') {
      this.myForm.controls.horaSalida.disable();
      if (response.value !== undefined) {
        this.hrEntrada = Number(horaSalida.substring(0, 2));
        this.hr = Number(response.value.substring(0, 2)) + 8;
        this.newValue = response.value.replace(response.value.substring(0, 2), Number(response.value.substring(0, 2)) + 8)


      } else {
        this.hr = Number(response.substring(0, 2)) + 8;
        this.newValue = response.replace(response.substring(0, 2), Number(response.substring(0, 2)) + 8)
      }

      if (this.hr === 8 || this.hr === 9) {
        this.newValue = response.value.replace(response.value.substring(0, 2), '0' + String(this.hr))
      }
      if (this.hr > 23) {
        this.newValue = response.value.replace(response.value.substring(0, 2), '0' + String(this.hr - 24))
      }

      this.myForm.controls.horaSalida.setValue(this.newValue);
      this.myForm.value.horaSalida = this.newValue;

      this.horaSalida = this.newValue;

    } else {
      if (horaSalida !== undefined) {
        this.hrEntrada = Number(horaSalida.substring(0, 2));
      }
    }

  }

}
