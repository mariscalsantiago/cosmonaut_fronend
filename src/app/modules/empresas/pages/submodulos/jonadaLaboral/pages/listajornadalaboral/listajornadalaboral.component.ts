import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { JornadalaboralService } from '../../services/jornadalaboral.service';

@Component({
  selector: 'app-listajornadalaboral',
  templateUrl: './listajornadalaboral.component.html',
  styleUrls: ['./listajornadalaboral.component.scss']
})
export class ListajornadalaboralComponent implements OnInit {


  public tamanio: number = 0;
  public objEnviar: any;
  public changeIconDown: boolean = false;
  public nombre: string = "";
  public cargando: boolean = false;
  public id_empresa: number = 0;
  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandodetallegrupo:boolean = false;


  public modal: boolean = false;
  public strTitulo: string = "";
  public iconType: string = "";
  public strsubtitulo: string = "";
  public indexSeleccionado: number = 0;






  public arreglo: any = [];
  public arreglodetalle:any = [];

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

  constructor(private jornadaPrd: JornadalaboralService, private routerPrd: Router,
    private routerActive: ActivatedRoute) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];

      this.cargando = true;

      this.jornadaPrd.getAllJornada(this.id_empresa).subscribe(datos => {
        if (datos.datos != undefined)
          for (let item of datos.datos) {
            item.seleccionado = false;
            item.cargandoDetalle = false;
          }
        this.arreglo = datos.datos;
        this.cargando = false;
        console.log("Jornada",this.arreglo);
      });

    });

  }

  public filtrar() {

  }


  public eliminar(obj: any) {

    debugger;
    this.objEnviar = {
      jornadaId: obj.jornadaId,
      centrocClienteId: {
        centrocClienteId: this.id_empresa
      }
    }

    this.modal = true;
    this.strTitulo = "¿Deseas eliminar el grupo de nómina?";
    //this.strsubtitulo = "Estas a punto de borrar un grupo de nómina";
    this.iconType = "warning";



  }

  public verdetalle(obj: any) {

debugger;
    if (obj == undefined) {
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'jornadalaboral', 'nuevo']);
    } else {
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'jornadalaboral', 'editar'], { state: { data: obj } });
    }

  }

  apagando(indice: number) {

    debugger;

    for(let x = 0;x < this.arreglo.length; x++){
      if(x == indice)
            continue;

      this.arreglo[x].seleccionado = false;
    }


    this.arreglo[indice].seleccionado = !this.arreglo[indice].seleccionado;
  
  }

  public traerModal(indice: any) {
    debugger;
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


    let jornadaitem = this.arreglo[indice];
    
    this.cargandodetallegrupo = true;
    this.jornadaPrd.getdetalleJornada(this.id_empresa,jornadaitem.jornadaId).subscribe(datos =>{

      this.cargandodetallegrupo = false;


      this.arreglodetalle = datos.datos == undefined ? []:datos.datos;


      console.log("empleados",this.arreglodetalle);
      

    });

  }


  public recibir($evento: any) {

    this.modal = false;
    if (this.iconType == "warning") {

      if ($evento) {

        this.jornadaPrd.eliminar(this.objEnviar).subscribe(datos => {
          let mensaje = datos.mensaje;
          let resultado = datos.resultado;

          this.strTitulo = mensaje;
          this.iconType = resultado ? "success" : "error";

          this.modal = true;

          if(resultado){


            this.arreglo.splice(this.indexSeleccionado,1);


          }


        });

      }

    }


  }

}
