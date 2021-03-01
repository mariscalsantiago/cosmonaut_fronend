import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PuestosService } from '../services/puestos.service';

@Component({
  selector: 'app-detallepuestos',
  templateUrl: './detallepuestos.component.html',
  styleUrls: ['./detallepuestos.component.scss']
})
export class DetallepuestosComponent implements OnInit {

@ViewChild("nombre") public nombre!:ElementRef;

  public myForm!: FormGroup;
  public arreglo: any = [];
  public arreglodetalle: any = [];
  public modal: boolean = false;
  public modalpuesto: boolean = false;
  public insertar: boolean = false;
  public listpuesto: boolean = true;
  public iconType: string = "";
  public strTitulo: string = "";
  public objdetrep: any;
  public cargando: Boolean = false;
  public empresas: any;
  public puestos: any;
  public areas: any;
  public tamanio: number = 0;
  public id_empresa: number = 0;
  public nom_empresa: string = "";
  public puestoIdReporta: number = 2;

  public puestonuevo: boolean = false;
  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandolistapuesto: boolean = false;
  public submitEnviado:boolean = false;

  constructor(private formBuilder: FormBuilder, private puestosPrd: PuestosService, private routerActivePrd: ActivatedRoute,
    private routerPrd: Router) {

    this.routerActivePrd.params.subscribe(datos => {
      this.insertar = (datos["tipoinsert"] == 'nuevo');
      this.id_empresa = datos["id"]

    });

  }

  ngOnInit(): void {


    this.areas = history.state.datos == undefined ? {} : history.state.datos;


    this.puestosPrd.getAllCompany(this.id_empresa).subscribe(datos => {
      this.empresas = datos.datos;

      if (this.empresas != undefined) {

        this.nom_empresa = this.empresas.nombre

        if (this.insertar) {
          this.myForm = this.createForm((this.areas));
        }
        else {
          this.myForm = this.createFormMod((this.areas));
          this.puestonuevo = true;
        }
      }

    });

    console.log(this.areas);


    if (this.insertar) {
      this.myForm = this.createForm((this.areas));


    }
    else {
      this.myForm = this.createFormMod((this.areas));
      this.listaPuestos();
      this.listpuesto = false;
    }

  }

  ngAfterViewInit(): void{

    this.nombre.nativeElement.focus();

  }


  public createForm(obj: any) {
    return this.formBuilder.group({

      nombre: [{ value: this.nom_empresa, disabled: this.insertar }, [Validators.required]],
      nombreCorto: [obj.nombreCorto, [Validators.required]],
      puesto: [obj.puesto, [Validators.required]],
      areaId: obj.areaId

    });
  }


  public createFormMod(obj: any) {
    return this.formBuilder.group({

      nombre: [{ value: this.nom_empresa, disabled: !this.insertar }, [Validators.required]],
      nombreCorto: [obj.nombreCorto, [Validators.required]],
      areaId: obj.areaId

    });
  }

  public listaPuestos() {

    this.puestosPrd.getListPues(this.id_empresa, this.areas.areaId).subscribe(datos => {
      this.cargando = true;
      this.arreglo = datos.datos;
      this.cargando = false;
    });
  }


  public traerModal(indice: any) {

    let elemento: any = document.getElementById("vetanaprincipaltablapuesto")
    this.aparecemodalito = true;



    if (elemento.getBoundingClientRect().y < -40) {
      let numero = elemento.getBoundingClientRect().y;
      numero = Math.abs(numero);

      this.scrolly = numero + 100 + "px";


    } else {

      this.scrolly = "5%";
    }



    if (this.tamanio < 600) {

      this.modalWidth = "90%";

    } else {
      this.modalWidth = "55%";

    }



    this.cargandolistapuesto = true;
    this.puestosPrd.getAllArea(this.id_empresa).subscribe(datos => {

      this.cargandolistapuesto = false;


      this.arreglodetalle = datos.datos == undefined ? [] : datos.datos;



    });

  }

  public verdetalle(obj: any) {
    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'puestos', tipoinsert], { state: { datos: this.areas, data: obj } });
    this.cargando = false;
  }

  public enviarPeticion() {


    this.submitEnviado = true;
    if (this.myForm.invalid) {
      this.iconType = "error";
      this.strTitulo = "Campos obligatorios o inválidos";
      this.modal = true;
      return;

    }


    this.iconType = "warning";
    this.strTitulo = (this.insertar) ? "¿Deseas registrar el área?" : "¿Deseas actualizar los datos del área?";
    this.modal = true;
  }



  public redirect(obj: any) {
    this.modal = true;
    this.routerPrd.navigate(["/empresa/detalle/" + this.id_empresa + "/area"]);
    this.modal = false;

  }

  public recibir($evento: any) {

    this.modal = false;
    if (this.iconType == "warning") {
      if ($evento) {
        let obj = this.myForm.value;

        let objEnviar: any = {
          descripcion: obj.nombreCorto,
          nombreCorto: obj.nombreCorto,
          centrocClienteId: this.id_empresa,
          nclPuestoDto: [
            {
              descripcion: obj.puesto,
              nombreCorto: obj.puesto,
              centrocClienteId: this.id_empresa
            }
          ]
        }

        if (this.insertar) {
          this.puestosPrd.save(objEnviar).subscribe(datos => {

            this.iconType = datos.resultado ? "success" : "error";
            this.strTitulo = datos.mensaje;
            this.modal = true;

          });

        } else {

          let objEnviarMod: any = {
            areaId: obj.areaId,
            descripcion: obj.nombreCorto,
            nombreCorto: obj.nombreCorto,
            centrocClienteId: this.id_empresa,
            nclPuestoDto:
              [

              ]
          }
          this.puestosPrd.modificar(objEnviarMod).subscribe(datos => {
            this.iconType = datos.resultado ? "success" : "error";
            this.strTitulo = datos.mensaje;
            this.modal = true;


          });
        }

      }
    } else {
      if (this.iconType == "success") {
        this.routerPrd.navigate(["/empresa/detalle/" + this.id_empresa + "/area"]);
      }

      this.modal = false;
    }
  }
  get f() { return this.myForm.controls; }


}

