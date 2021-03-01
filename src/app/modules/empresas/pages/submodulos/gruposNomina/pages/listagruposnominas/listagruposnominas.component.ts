import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { GruponominasService } from '../../services/gruponominas.service';

@Component({
  selector: 'app-listagruposnominas',
  templateUrl: './listagruposnominas.component.html',
  styleUrls: ['./listagruposnominas.component.scss']
})
export class ListagruposnominasComponent implements OnInit {


  public tamanio: number = 0;
  public changeIconDown: boolean = false;
  public nombre: string = "";
  public razon: string = "";
  public idEsquema: number = 0;

  public cargando: boolean = false;
  public id_empresa: number = -1;
  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandodetallegrupo: boolean = false;


  public modal: boolean = false;
  public strTitulo: string = "";
  public iconType: string = "";
  public strsubtitulo: string = "";
  public indexSeleccionado: number = 0;

  public arregloEsquemaPago: any = [];






  public arreglo: any = [];
  public arreglodetalle: any = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;

    if (this.tamanio < 600) {

      this.modalWidth = "90%";

    } else {
      this.modalWidth = "55%";

    }
  }

  constructor(private gruposnominaPrd: GruponominasService, private routerPrd: Router,
    private routerActive: ActivatedRoute, private catalogosPrd: CatalogosService) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];

      this.cargando = true;

      this.gruposnominaPrd.getAll(this.id_empresa).subscribe(datos => {
        if (datos.datos != undefined)
          for (let item of datos.datos) {
            item.seleccionado = false;
            item.cargandoDetalle = false;
          }
        this.arreglo = datos.datos;
        this.cargando = false;
      });

    });


    this.catalogosPrd.getEsquemaPago().subscribe(datos => this.arregloEsquemaPago = datos.datos);

  }

  public filtrar() {


    let objEnviar = {

      nombre: this.nombre,
      esquemaPagoId: {
        esquemaPagoId: this.idEsquema
      }
    }

    this.gruposnominaPrd.filtrar(objEnviar).subscribe(datos => {

      if (datos.datos != undefined)
        for (let item of datos.datos) {
          item.seleccionado = false;
          item.cargandoDetalle = false;
        }
      this.arreglo = datos.datos;
      this.cargando = false;
    });


  }


  public eliminar(indice: any) {


    this.indexSeleccionado = indice;

    this.modal = true;
    this.strTitulo = "¿Deseas eliminar el grupo de nómina?";
    this.strsubtitulo = "Estas a punto de borrar un grupo de nómina";
    this.iconType = "warning";



  }

  public verdetalle(obj: any) {


    if (obj == undefined) {
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'gruposnomina', 'nuevo']);
    } else {
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'gruposnomina', 'editar'], { state: { data: obj } });
    }

  }

  apagando(indice: number) {



    this.arreglo[indice].cargandoDetalle = true;
    this.gruposnominaPrd.getGroupNomina(this.arreglo[indice].id).subscribe((datos) => {




      let temp = datos.datos;
      if (temp != undefined) {

        for (let llave in temp) {
          this.arreglo[indice][llave] = temp[llave];
        }

      }

      console.log(this.arreglo[indice]);



      this.arreglo[indice].cargandoDetalle = false;

    });


    for (let x = 0; x < this.arreglo.length; x++) {
      if (x == indice)
        continue;

      this.arreglo[x].seleccionado = false;
    }


    this.arreglo[indice].seleccionado = !this.arreglo[indice].seleccionado;

  }


  public traerModal(indice: any) {

    let elemento: any = document.getElementById("vetanaprincipaltabla")
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


    let gruponominaitem = this.arreglo[indice];

    this.cargandodetallegrupo = true;
    this.gruposnominaPrd.getGroupNominaEmpleado(gruponominaitem.id).subscribe(datos => {

      this.cargandodetallegrupo = false;


      this.arreglodetalle = datos.datos == undefined ? [] : datos.datos;


      console.log(datos);


    });

  }


  public recibir($evento: any) {

    this.modal = false;
    if (this.iconType == "warning") {

      if ($evento) {


        let id = this.arreglo[this.indexSeleccionado].id;
        this.gruposnominaPrd.eliminar(id).subscribe(datos => {
          let mensaje = datos.mensaje;
          let resultado = datos.resultado;

          this.strTitulo = mensaje;
          this.iconType = resultado ? "success" : "error";

          this.modal = true;

          if (resultado) {


            this.arreglo.splice(this.indexSeleccionado, 1);


          }


        });

      }

    }


  }

}
