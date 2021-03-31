import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioService } from '../../services/usuario.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {






  public cargando: Boolean = false;
  public tipoguardad: boolean = false;





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



  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public activarMultiseleccion:boolean = false;


  constructor(private routerPrd: Router, private usuariosPrd: UsuarioService,
    private companiPrd: SharedCompaniaService, private modalPrd: ModalService) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;




    this.cargando = true;


    debugger;
   this.filtrar();

    this.companiPrd.getAllCompany().subscribe(datos => this.arregloCompany = datos.datos);

  }
  
  public procesarTabla(datos:any){
    debugger;
    this.arreglo = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("personaId", "ID",false,false,true),
      new tabla("nombre", "Nombre"),
      new tabla("apellidoPaterno", "Apellido paterno"),
      new tabla("apellidoMaterno", "Apellido materno"),
      new tabla("razonSocial", "Centro de costos"),
      new tabla("emailCorporativo", "Correo empresarial"),
      new tabla("fechaAlta", "Fecha de registro"),
      new tabla("activo", "Estatus")
    ]




    console.log(this.arreglo);
    if (this.arreglo !== undefined) {
      for (let item of this.arreglo) {
        var datePipe = new DatePipe("es-MX");
        item.fechaAlta = (new Date(item.fechaAlta).toUTCString()).replace(" 00:00:00 GMT", "");
        item.fechaAlta = datePipe.transform(item.fechaAlta, 'dd-MMM-y')?.replace(".","");

        item["centrocClientenombre"] = item.centrocClienteId.nombre;

      }
    }


    this.arreglotabla =  {
      columnas: [],
      filas: []
    };

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
  }





  public verdetalle(obj: any) {


    if (obj == undefined) {

      this.routerPrd.navigate(['usuarios', 'detalle_usuario', "agregar"], { state: { company: this.arregloCompany } });

    } else {

      this.routerPrd.navigate(['usuarios', 'detalle_usuario', "actualizar", obj.personaId], { state: { company: this.arregloCompany } });
    }


  }







  public guardarMultiseleccion(tipoguardad: boolean) {


    this.tipoguardad = tipoguardad;
    let mensaje = `¿Deseas ${tipoguardad ? "activar" : "desactivar"} estos usuarios?`;

    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {
        let arregloUsuario: any = [];

        for (let item of this.arreglo) {

          if (item["seleccionado"]) {

            arregloUsuario.push({ personaId: item["personaId"], esActivo: this.tipoguardad });

          }
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        this.usuariosPrd.modificarListaActivos(arregloUsuario).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(valor =>{
            if(valor){
              for (let item of arregloUsuario) {
                for (let item2 of this.arreglo) {
                  if (item2.personaId === item.personaId) {
                    item2["esActivo"] = item["esActivo"];
                    item2["activo"] = item["esActivo"];
                    item2["seleccionado"] = false;
                    break;
                  }
                }
              }

              this.activarMultiseleccion = false;
            }
          });
        });
      }
    });



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
      esActivo: actboo,
      centrocClienteId: {
        centrocClienteId: (this.id_company) == 0 ? "" : this.id_company
      },
      tipoPersonaId: {
        tipoPersonaId: 3
      }
    }





    this.cargando = true;

    this.usuariosPrd.filtrar(peticion).subscribe(datos => {
      this.arreglo = datos.datos;
      console.log("Se va a filtrar",this.arreglo);
      
      this.procesarTabla({datos:this.arreglo});

      this.cargando = false;
    });

  }


  public recibirTabla(obj: any) {


    switch (obj.type) {
      case "editar":
        this.verdetalle(obj.datos);
        break;
      case "filaseleccionada":
        this.activarMultiseleccion = obj.datos;
        break;
    }

  }



}








