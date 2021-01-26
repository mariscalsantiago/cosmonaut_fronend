import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {




  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  public cargando: Boolean = false;

  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public numeroitems: number = 5;
  public arreglotemp = [];
  public arreglopaginas: Array<any> = [];




  /*
    Directivas de filtros
  */


  public id_company: number = 0;
  public idUsuario: any = "";
  public nombre: string = "";
  public apellidoPat: string = "";
  public apellidoMat: string = "";
  public fechaRegistro: any = null;
  public correoempresarial: string = "";
  public activo: number = 0;




  /*
  
    Resultados desplegados en un array

  */

  public arreglo: any = [];
  public arregloCompany: any = [];
  public tamanio = 0;
  public changeIconDown: boolean = false;

  constructor(private routerPrd: Router, private usuariosPrd: UsuarioService) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;


    this.cargando = true;




    this.usuariosPrd.getAllUsers().subscribe(datos => {
      this.arreglotemp = datos.data;
      console.log(this.arreglotemp);
      this.cargando = false;
      this.paginar();
    });

    this.usuariosPrd.getAllCompany().subscribe(datos => this.arregloCompany = datos.data);

  }





  public verdetalle(obj: any) {


    let tipoinsert = (obj == undefined) ? 'new' : 'update';

    this.routerPrd.navigate(['usuarios', 'detalle_usuario', tipoinsert], { state: { data: obj, company: this.arregloCompany } });
    this.cargando = false;


  }


  public activarMultiseleccion() {
    this.multiseleccion = true;


    let temp = [];


    for (let item of this.arreglotemp) {
      let obj: any = {};
      for (let llave in item) {
        obj[llave] = item[llave];
      }
      temp.push(obj);
    }

    this.arreglo = temp;






  }


  public guardarMultiseleccion() {
    this.multiseleccionloading = true;
    let peticionEnviar = [];

    for (let item of this.arreglo) {
      peticionEnviar.push({
        personaId: item.personaId,
        esActivo: item.esActivo
      });
    }

    this.usuariosPrd.modificarListaActivos(peticionEnviar).subscribe(datos => {
      this.multiseleccionloading = false;
      this.multiseleccion = false;
    });
  }


  public cancelarMulti() {
    this.multiseleccionloading = false;
    this.multiseleccion = false;
    this.paginar();
  }


  public filtrar() {




    this.cargando = true;

    let fechar = "";

    if (this.fechaRegistro != undefined || this.fechaRegistro != null) {

      if (this.fechaRegistro != "") {


        let arre = this.fechaRegistro.split('-');
        fechar = arre[2] + "/" + arre[1] + "/" + arre[0];

      }

    }

    let actboo: string = "";

    if (this.activo == 1) {
      actboo = "true";
    } else if (this.activo == 2) {
      actboo = "false";
    }


    let peticion = {
      personaId: this.idUsuario,
      nombre: this.nombre,
      apellidoPat: this.apellidoPat,
      apellidoMat: this.apellidoMat,
      fechaAlta: fechar,
      emailCorp: this.correoempresarial,
      esActivo: "",
      representanteLegalCentrocClienteId: {
        centrocClienteId: (this.id_company) == 0 ? "" : this.id_company
      },
      tipoPersonaId: {
        tipoPersonaId: 3
      }
    }


    this.usuariosPrd.filtrar(peticion).subscribe(datos => {
      this.arreglo = datos.data;
      this.cargando = false;
    });








  }



  public paginar() {

    this.arreglopaginas = [];

    if (this.arreglotemp != undefined) {
      let paginas = this.arreglotemp.length / this.numeroitems;


      let primero = true;
      paginas = Math.ceil(paginas);

      for (let x = 1; x <= paginas; x++) {

        this.arreglopaginas.push({ numeropagina: (x - 1) * 2, llavepagina: ((x - 1) * 2) + this.numeroitems, mostrar: x, activado: primero });
        primero = false;
      }

      this.arreglo = this.arreglotemp.slice(0, this.numeroitems);
      console.log(this.arreglotemp);

    }

  }


  public paginacambiar(item: any) {


    this.arreglo = this.arreglotemp.slice(item.numeropagina, item.llavepagina);



    for (let item of this.arreglopaginas) {
      item.activado = false;
    }

    item.activado = true;


  }

  public cambia() {

    this.paginar();

  }


  public seleccionarTodosBool(input: any) {
    for (let item of this.arreglo)
      item.esActivo = input.checked;


    console.log(this.arreglotemp);
  }



}








