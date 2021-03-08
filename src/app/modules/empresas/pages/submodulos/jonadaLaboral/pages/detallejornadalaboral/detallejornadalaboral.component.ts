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
  @ViewChild("nombre") public nombre!:ElementRef;
  public myForm!: FormGroup;

  public submitInvalido: boolean = false;
  public esInsert: boolean = false;
  public id_empresa: number = 0;
  public activadoISR: boolean = false;
  public arreglotipojornadas:any = [];
  public peticion:any = [];



  constructor(private formbuilder: FormBuilder, private activeprd: ActivatedRoute,
    private routerPrd: Router, private jornadaPrd: JornadalaboralService,
    private catalogosPrd:CatalogosService,private modalPrd:ModalService) { 

      this.activeprd.params.subscribe(datos => {
        this.esInsert = (datos["tipoinsert"] == 'nuevo');
        this.id_empresa = datos["id"]
      });

    }

  ngOnInit(): void {
    debugger;

    let objdetrep = history.state.data == undefined ? {} : history.state.data;
    this.myForm = this.crearForm((objdetrep));


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
      jornadaId: obj.jornadaId


    });
  }


  


  public enviarPeticion() {




    this.submitInvalido = true;
    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }

    const titulo = this.esInsert ? "¿Deseas registrar la jornada laboral?" : "¿Deseas actualizar los datos de la jornada laboral?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){


        let obj = this.myForm.value;

        this.peticion = {

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

          this.jornadaPrd.save(this.peticion).subscribe(datos => {

           this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
             if(datos.resultado){
              this.routerPrd.navigate(['/empresa', 'detalle', this.id_empresa, 'jornadalaboral']);
             }
           });

          });
        } else {

          this.peticion.jornadaId = obj.jornadaId;

          this.jornadaPrd.modificar(this.peticion).subscribe(datos => {

            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
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

}
