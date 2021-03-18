import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
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
  public tipoguardad: boolean = false;
  public multiseleccion: Boolean = false;
  public multiseleccionloading: boolean = false;
  public numeroitems: number = 5;
  public arreglotemp: any = [];
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

  constructor(private routerPrd: Router, private usuariosPrd: UsuarioService,
    private companiPrd: SharedCompaniaService, private modalPrd: ModalService) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;




    this.cargando = true;




    this.usuariosPrd.getAllUsers().subscribe(datos => {
      this.arreglotemp = datos.datos;
      
      for (let item of this.arreglotemp) {
        var datePipe = new DatePipe("es-MX");
        item.fechaAlta = (new Date(item.fechaAlta).toUTCString()).replace(" 00:00:00 GMT", "");
        item.fechaAlta = datePipe.transform(item.fechaAlta, 'dd MMM yyyy');
        console.log("HOLA ISDJFIDSJFOIDSFJO",item.fechaAlta);
      }
      this.cargando = false;

      if (this.arreglotemp === undefined)
        this.arreglo == undefined;
      else
        this.paginar();
    });

    this.companiPrd.getAllCompany().subscribe(datos => this.arregloCompany = datos.datos);

  }





  public verdetalle(obj: any) {


    if (obj == undefined) {

      this.routerPrd.navigate(['usuarios', 'detalle_usuario', "agregar"], { state: { company: this.arregloCompany } });

    } else {

      this.routerPrd.navigate(['usuarios', 'detalle_usuario', "actualizar", obj.personaId], { state: { company: this.arregloCompany } });
    }


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




  public guardarMultiseleccion(tipoguardad: boolean) {


    this.tipoguardad = tipoguardad;
    let mensaje = `¿Deseas ${tipoguardad ? "activar" : "desactivar"} estos usuarios?`;

    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {
        let arregloUsuario: any = [];

        for (let item of this.arreglotemp) {

          if (item["esActivo"]) {

            arregloUsuario.push({ personaId: item["personaId"], activo: this.tipoguardad });

          }
        }

        this.usuariosPrd.modificarListaActivos(arregloUsuario).subscribe(datos => {

          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);



          for (let item of arregloUsuario) {
            for (let item2 of this.arreglotemp) {
              if (item2.personaId === item.personaId) {
                item2["activo"] = item["activo"];
                item2["esActivo"] = false;
                break;
              }
            }
          }
        });
      }
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
        const fecha1 = new Date(this.fechaRegistro).toUTCString().replace("GMT", "");
        fechar = `${new Date(fecha1).getTime()}`;
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
      apellidoPaterno: this.apellidoPat,
      apellidoMaterno: this.apellidoMat,
      fechaAlta: fechar,
      emailCorporativo: this.correoempresarial,
      activo: "",
      centrocClienteId: {
        centrocClienteId: (this.id_company) == 0 ? "" : this.id_company
      },
      tipoPersonaId: {
        tipoPersonaId: 3
      }
    }





    this.usuariosPrd.filtrar(peticion).subscribe(datos => {
      this.arreglotemp = datos.datos;
      if (this.arreglotemp != undefined) {
        for (let item of this.arreglotemp) {
          item["centrocClienteId"] = {
            nombre: item["razonSocial"]
          }


          var datePipe = new DatePipe("es-MX");

          item.fechaAlta = (new Date(item.fechaAlta).toUTCString()).replace(" 00:00:00 GMT","");
           item.fechaAlta = datePipe.transform(item.fechaAlta, 'dd MMM yyyy');
        }
      } else {
        this.arreglo = undefined;
      }
      this.paginar();
      this.cargando = false;
    });








  }



  public paginar() {

    this.arreglopaginas = [];

    if (this.arreglotemp != undefined) {
      let paginas = this.arreglotemp.length / Number(this.numeroitems);


      let primero = true;
      paginas = Math.ceil(paginas);


      for (let x = 1; x <= paginas; x++) {

        this.arreglopaginas.push({ numeropagina: (x - 1) * Number(this.numeroitems), llavepagina: ((x - 1) * Number(this.numeroitems)) + Number(this.numeroitems), mostrar: x, activado: primero });
        primero = false;
      }

      this.arreglo = this.arreglotemp.slice(0, Number(this.numeroitems));
      

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
  }


  public verificaDisponibilidad() {

    let variable: boolean = false;

    if (this.arreglotemp !== undefined) {
      for (let item of this.arreglotemp) {

        if (item["esActivo"]) {

          variable = true;
          break;
        }

        variable = false;

      }
    }


    return variable;
  }
}








