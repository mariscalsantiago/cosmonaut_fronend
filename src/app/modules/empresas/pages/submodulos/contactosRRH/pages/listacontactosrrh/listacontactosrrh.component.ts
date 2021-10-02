import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { UsuariocontactorrhService } from '../services/usuariocontactorrh.service';
import { DatePipe } from '@angular/common';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

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

  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  constructor(private router: Router, private usuariosPrd: UsuariocontactorrhService, private CanRouterPrd: ActivatedRoute,
    private configuracionesPrd:ConfiguracionesService) { }

  ngOnInit(): void {


    this.establecerPermisos();
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
          new tabla("apellidoPaterno", "Primer apellido"),
          new tabla("apellidoMaterno", "Segundo apellido"),
          new tabla("curp", "CURP"),
          new tabla("emailCorporativo", "Correo empresarial"),
          //new tabla("fechaAlta", "Fecha de registro en el sistema"),
          new tabla("esActivo", "Estatus de contacto")
        ];
        if(datos.datos !== undefined){
          for(let item of datos.datos){

            let datepipe = new DatePipe("es-MX");
            item.fechaAlta = datepipe.transform(item.fechaAlta , 'dd-MMM-y')?.replace(".","");;

                if(item.activo){
                  item.esActivo = 'Activo'
                 }
                 if(!item.activo){
                 item.esActivo = 'Inactivo'
                 }
          }
        }
        this.arreglotabla.columnas = columnas;
        this.arreglotabla.filas = datos.datos;
        this.cargando = false;
      });

    });

  }




 



 public establecerPermisos(){
    this.esRegistrar = this.configuracionesPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionesPrd.getPermisos("Consultar");
    this.esEditar = this.configuracionesPrd.getPermisos("Editar");
    this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
  }


  
    public filtrar() {




    this.cargando = true;



    let peticion = {
      nombre: this.nombre,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      contactoInicialEmailPersonal:this.correoP?.toLowerCase(),
      emailCorporativo:this.correoE?.toLowerCase(),
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
        new tabla("apellidoPaterno", "Primer apellido"),
        new tabla("apellidoMaterno", "Segundo apellido"),
        new tabla("curp", "CURP"),
        new tabla("emailCorporativo", "Correo empresarial"),
        new tabla("fechaAlta", "Fecha de registro en el sistema"),
        new tabla("activo", "Estatus")
      ];

      if(datos.datos !== undefined){
        for(let item of datos.datos){
          
          let datepipe = new DatePipe("es-MX");
          item.fechaAlta = datepipe.transform(item.fechaAlta , 'dd-MMM-y')?.replace(".","");

          item.esActivo = item.activo;

          if(item.esActivo){
          item.esActivo = true
          }
          if(!item.esActivo){
          item.esActivo = false
          }

        }
      }

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
