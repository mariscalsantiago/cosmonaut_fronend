import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliticasService } from '../services/politicas.service';

@Component({
  selector: 'app-detallepoliticas',
  templateUrl: './detallepoliticas.component.html',
  styleUrls: ['./detallepoliticas.component.scss']
})
export class DetallepoliticasComponent implements OnInit {
  @ViewChild("nombre") public nombre!:ElementRef;
  public myFormpol!: FormGroup;
  public arreglo: any = [];
  public modal: boolean = false;
  public insertar: boolean = false;
  public iconType: string = "";
  public strTitulo: string = "";
  public cargando: Boolean = false;

  public submitEnviado: boolean = false;
  public esInsert: boolean = false;
  public id_empresa: number = 0;
  public calculoAntiguedadx: number = 0;

  constructor(private formBuilder: FormBuilder, private politicasPrd: PoliticasService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router) {
    
    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      this.id_empresa = datos["id"]
    });


  }

  ngOnInit(): void {
    
    let objdetrep = history.state.data == undefined ? {} : history.state.data;
    this.myFormpol = this.createFormrep((objdetrep));

  }
  ngAfterViewInit(): void{

    this.nombre.nativeElement.focus();

  }


  public createFormrep(obj: any) {
    debugger;
    if(!this.insertar){
      obj.calculoAntiguedadx = obj.calculoAntiguedadx == "C"?"contrato":"antiguedad";

    }
    return this.formBuilder.group({

      nombre: [obj.nombre, [Validators.required]],
      diasEconomicos: [obj.diasEconomicos, [Validators.required]],
      primaAniversario: [obj.primaAniversario],
      descuentaFaltas: [obj.descuentaFaltas],
      descuentaIncapacidades: [obj.descuentaIncapacidades],
      costoValesRestaurante: [obj.costoValesRestaurante],
      descuentoPropDia: [obj.descuentoPropDia],
      politicaId: obj.politicaId,
      calculoAntiguedadx:[obj.calculoAntiguedadx]

    });
  }




  public enviarPeticion() {


    this.submitEnviado = true;
    if (this.myFormpol.invalid) {
      this.iconType = "error";
      this.strTitulo = "Campos obligatorios o inválidos";
      this.modal = true;
      return;

    }



    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar la política" : "¿Deseas actualizar los datos de la política?";
    this.modal = true;
  }


  public redirect(obj: any) {
    
    this.modal = true;
    this.routerPrd.navigate(["/empresa/detalle/" + this.id_empresa + "/politicas"]);
    this.modal = false;


  }

  public recibir($evento: any) {
    
    this.modal = false;
    if (this.iconType == "warning") {
      if ($evento) {
        let obj = this.myFormpol.value;
        let antiguedad = obj.calculoAntiguedadx == "contrato"?"C":"A";
        if(antiguedad == "C"){
          this.calculoAntiguedadx = 2;
        }else{
          this.calculoAntiguedadx = 1;
        }

        let objEnviar: any = {
          nombre: obj.nombre,
          diasEconomicos: obj.diasEconomicos,
          primaAniversario: obj.primaAniversario,
          descuentaFaltas: obj.descuentaFaltas,
          descuentaIncapacidades: obj.descuentaIncapacidades,
          costoValesRestaurante: obj.costoValesRestaurante,
          descuentoPropDia: obj.descuentoPropDia,
          calculoAntiguedadx: antiguedad,
          centrocClienteId: {
            centrocClienteId: this.id_empresa
          },
          calculoAntiguedadId: {
            calculoAntiguedadxId: this.calculoAntiguedadx
          },

        }

        if (this.insertar) {
          

          this.politicasPrd.save(objEnviar).subscribe(datos => {

            this.iconType = datos.resultado ? "success" : "error";

            this.strTitulo = datos.mensaje;
            this.modal = true;


          });

        } else {

          

          let objEnviar: any = {
            politicaId: obj.politicaId,
            nombre: obj.nombre,
            diasEconomicos: obj.diasEconomicos,
            primaAniversario: obj.primaAniversario,
            descuentaFaltas: obj.descuentaFaltas,
            descuentaIncapacidades: obj.descuentaIncapacidades,
            costoValesRestaurante: obj.costoValesRestaurante,
            descuentoPropDia: obj.descuentoPropDia,
            centrocClienteId: {
              centrocClienteId: this.id_empresa
            },

            calculoAntiguedadx:  antiguedad,
            calculoAntiguedadId: {
              calculoAntiguedadxId: this.calculoAntiguedadx
            },
            beneficiosXPolitica: [
              {
                beneficioXPolitica: 23,
                aniosAntiguedad: 1,
                diasAguinaldo: 15,
                diasVacaciones: 10,
                primaVacacional: 0.5
              }
            ]
          }
          this.politicasPrd.modificar(objEnviar).subscribe(datos => {
            this.iconType = datos.resultado ? "success" : "error";
            this.strTitulo = datos.mensaje;
            this.modal = true;


          });
        }

      }
    } else {
      if (this.iconType == "success") {
        this.routerPrd.navigate(["/empresa/detalle/" + this.id_empresa + "/politicas"]);
      }

      this.modal = false;
    }
  }
  get f() { return this.myFormpol.controls; }


}

