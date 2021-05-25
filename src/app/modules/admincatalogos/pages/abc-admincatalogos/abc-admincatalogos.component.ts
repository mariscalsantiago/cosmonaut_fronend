import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tabla } from 'src/app/core/data/tabla';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { AdminCatalogosService } from '../../services/admincatalogos.service';


@Component({
  selector: 'app-abc-admincatalogos',
  templateUrl: './abc-admincatalogos.component.html',
  styleUrls: ['./abc-admincatalogos.component.scss']
})
export class ABCAdminCatalogosComponent implements OnInit {


  public cargando: Boolean = false;
  public tipoguardad: boolean = false;
  public myForm!: FormGroup;


  /*
    Directivas de filtros
  */


  public id_compania: number = 0;
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



  constructor(private routerPrd: Router, private adminCatalogosPrd: AdminCatalogosService,
    private companiPrd: SharedCompaniaService, private modalPrd: ModalService) { }

  ngOnInit(): void {
    
    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;
    this.cargando = true;

    this.companiPrd.getAllCompany().subscribe(datos => this.arregloCompany = datos.datos);

    this.crearTabla();

  }

  public crearTabla() {
    //this.arreglo = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("descripcion", "Descripción"),
      new tabla("clave", "Clave")
    ]



    this.arreglotabla = {
      columnas: [],
      filas: []
    };

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = [{
      descripcion : "ALBANESA",
      clave : "22"
    },
    {
      descripcion : "ALEMANA",
      clave : "21"
    }];
    //this.arreglotabla.columnas = columnas;
    //this.arreglotabla.filas = this.arreglo;

    this.cargando = false;
  }





  public verdetalle(obj: any) {

      this.routerPrd.navigate(['admincatalogos', 'detalle_admincatalogos', "modificar"], { state: { company: this.arregloCompany } });

  }

  public cancelar() {
    
    this.routerPrd.navigate(['/admincatalogos/detalle_admincatalogos/detalle']);
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
        centrocClienteId: (this.id_compania) == 0 ? "" : this.id_compania
      },
      tipoPersonaId: {
        tipoPersonaId: 3
      }
    }

    this.cargando = true;

    /*this.usuariosPrd.filtrar(peticion).subscribe(datos => {
      this.arreglo = datos.datos;

      this.procesarTabla({ datos: this.arreglo });

      this.cargando = false;
    });*/

  }


  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "editar":
        this.verdetalle(obj.datos);
        break;
    }

  }

  public enviarPeticion(){


  }
}

