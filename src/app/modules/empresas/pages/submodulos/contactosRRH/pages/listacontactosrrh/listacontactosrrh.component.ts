import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { UsuariocontactorrhService } from '../services/usuariocontactorrh.service';

@Component({
  selector: 'app-listacontactosrrh',
  templateUrl: './listacontactosrrh.component.html',
  styleUrls: ['./listacontactosrrh.component.scss']
})
export class ListacontactosrrhComponent implements OnInit {


  public tamanio: number = 0;
  public cargando: boolean = false;
  public changeIconDown: boolean = false;

  public nombre: any;
  public apellidoPaterno: any;
  public apellidoMaterno: any;
  public correoE: string = "";
  public correoP: string = "";
  public id_empresa: number = 0;
  public arreglotabla: any = {
    columnas: [],
    filas: []
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  constructor(private router: Router, private usuariosPrd: UsuariocontactorrhService, private CanRouterPrd: ActivatedRoute) { }

  ngOnInit(): void {
    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos => {


      this.id_empresa = datos["id"];
      let peticion = {
        centrocClienteId: {
          centrocClienteId: this.id_empresa
        },
        tipoPersonaId: {
          tipoPersonaId: 4
        }
      }




      this.usuariosPrd.filtrar(peticion).subscribe(datos => {

        let columnas: Array<tabla> = [
          new tabla("personaId", "ID"),
          new tabla("nombre", "Nombre"),
          new tabla("apellidoPaterno", "Apellido paterno"),
          new tabla("apellidoMaterno", "Apellido materno"),
          new tabla("curp", "CURP"),
          new tabla("emailCorporativo", "Correo empresarial"),
          new tabla("fechaAlta", "Fecha de registro"),
          new tabla("activo", "Estatus")
        ]
        this.arreglotabla.columnas = columnas;
        this.arreglotabla.filas = datos.datos;
        this.cargando = false;
      });

    });

  }


  
    public filtrar() {




    this.cargando = true;



    let peticion = {
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      contactoInicialEmailPersonal:this.correoP,
      emailCorporativo:this.correoE,
      centrocClienteId: {
        centrocClienteId: this.id_empresa
      },
      tipoPersonaId: {
        tipoPersonaId: 4
      }
    }

    this.usuariosPrd.filtrar(peticion).subscribe(datos => {
      let columnas: Array<tabla> = [
        new tabla("personaId", "ID"),
        new tabla("nombre", "Nombre"),
        new tabla("apellidoPaterno", "Apellido paterno"),
        new tabla("apellidoMaterno", "Apellido materno"),
        new tabla("curp", "CURP"),
        new tabla("emailCorporativo", "Correo empresarial"),
        new tabla("fechaAlta", "Fecha de registro"),
        new tabla("activo", "Estatus")
      ]
      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = datos.datos;
      this.cargando = false;
    });
  }




  public verdetalle(obj: any) {

    if (obj == undefined) {

      this.router.navigate(['empresa/detalle', this.id_empresa, 'contactosrrh', 'nuevo']);
    } else {

      this.router.navigate(['empresa/detalle', this.id_empresa, 'contactosrrh', 'editar'], { state: { data: obj } });

    }


  }


  public recibirTabla(obj: any) {

    this.verdetalle(obj.datos);

  }

}
