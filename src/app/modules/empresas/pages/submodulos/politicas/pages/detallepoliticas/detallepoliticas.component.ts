import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
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
  public insertar: boolean = false;
  public cargando: Boolean = false;

  public submitEnviado: boolean = false;
  public esInsert: boolean = false;
  public id_empresa: number = 0;
  public calculoAntiguedadx: number = 0;

  constructor(private formBuilder: FormBuilder, private politicasPrd: PoliticasService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router,private modalPrd:ModalService) {
    
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
     
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;

    }


    const titulo = (this.insertar) ? "¿Deseas registrar la política" : "¿Deseas actualizar los datos de la política?";
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){

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

            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(["/empresa/detalle/" + this.id_empresa + "/politicas"]);
              }
            });


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
           
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
              if(datos.resultado){
                this.routerPrd.navigate(["/empresa/detalle/" + this.id_empresa + "/politicas"]);
              }
            });


          });
        }

      }
    });
  }


  public redirect(obj: any) {
    this.routerPrd.navigate(["/empresa/detalle/" + this.id_empresa + "/politicas"]);
  }
  get f() { return this.myFormpol.controls; }


}

