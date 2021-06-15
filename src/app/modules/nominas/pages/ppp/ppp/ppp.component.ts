import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';


@Component({
  selector: 'app-ppp',
  templateUrl: './ppp.component.html',
  styleUrls: ['./ppp.component.scss']
})
export class PPPComponent implements OnInit {



  public cargando: Boolean = false;
  public tipoguardad: boolean = false;





  /*
    Directivas de filtros
  */


  public id_company: number = 0;
  public idnumEmpleado: any = "";
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


  public activarMultiseleccion: boolean = false;


  constructor(private routerPrd: Router,
    private companiPrd: SharedCompaniaService, private modalPrd: ModalService) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;
    this.cargando = true;
    this.filtrar();

    this.companiPrd.getAllCompany().subscribe(datos => this.arregloCompany = datos.datos);

  }

  public procesarTabla(datos: any) {
    this.arreglo = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("personaId", "ID", false, false, true),
      new tabla("nombre", "Nombre"),
      new tabla("apellidoPaterno", "Primer apellido"),
      new tabla("apellidoMaterno", "Segundo apellido"),
      new tabla("razonSocial", "Centro de costos"),
      new tabla("emailCorporativo", "Correo empresarial"),
      new tabla("fechaAlta", "Fecha de registro en el sistema"),
      new tabla("activo", "Estatus")
    ]





    if (this.arreglo !== undefined) {
      for (let item of this.arreglo) {
        var datePipe = new DatePipe("es-MX");
        item.fechaAlta = (new Date(item.fechaAlta).toUTCString()).replace(" 00:00:00 GMT", "");
        item.fechaAlta = datePipe.transform(item.fechaAlta, 'dd-MMM-y')?.replace(".", "");

        item["centrocClientenombre"] = item.centrocClienteId.nombre;

      }
    }


    this.arreglotabla = {
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
    let mensaje = `¿Deseas descargar layaut de lo seleccionado?`;

    this.modalPrd.showMessageDialog(this.modalPrd.warning, mensaje).then(valor => {
      if (valor) {
        let arregloUsuario: any = [];

        for (let item of this.arreglo) {

          if (item["seleccionado"]) {

            arregloUsuario.push({ personaId: item["personaId"], esActivo: this.tipoguardad });

          }
        }


        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        /*this.usuariosPrd.modificarListaActivos(arregloUsuario).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(valor => {
            if (valor) {
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
        });*/
      }
    });



  }





  public filtrar() {
    
    this.cargando = true;

    let peticion = {
      numeroEmpleado: this.idnumEmpleado,
      nombre: this.nombre,
      primerApellidoEmpleado: this.apellidoPat,
      segundoApellidoEmpleado: this.apellidoMat,
      grupoNomina: this.correoempresarial,
      idEmpresa: this.id_company,
      idEmpresaActual: this.id_company
    }


   /* this.usuariosPrd.filtrar(peticion).subscribe(datos => {
      this.arreglo = datos.datos;

      this.procesarTabla({ datos: this.arreglo });

      this.cargando = false;
    });*/

  }


  public recibirTabla(obj: any) {


    switch (obj.type) {
      case "filaseleccionada":
        this.activarMultiseleccion = obj.datos;
        break;

    }

  }


}








