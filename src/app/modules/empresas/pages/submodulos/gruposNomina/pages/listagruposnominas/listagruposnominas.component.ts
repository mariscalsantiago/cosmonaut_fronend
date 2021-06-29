import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { tabla } from 'src/app/core/data/tabla';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { SharedCompaniaService } from 'src/app/shared/services/compania/shared-compania.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { GruponominasService } from '../../services/gruponominas.service';

@Component({
  selector: 'app-listagruposnominas',
  templateUrl: './listagruposnominas.component.html',
  styleUrls: ['./listagruposnominas.component.scss']
})
export class ListagruposnominasComponent implements OnInit {


  public tamanio: number = 0;

  public nombre: string = "";
  public razonsocial: number = -1;
  public periodonomina: string = "";
  public changeIconDown:boolean = false;

  public cargando: boolean = false;
  public id_empresa: number = -1;
  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandodetallegrupo: boolean = false;

  public indexSeleccionado: number = 0;



  public arreglo: any = [];
  public arreglodetalle: any = [];
  public arregloperiodo: any = [];
  public arregloRazonSocial: any = [];

  public arreglotabla: any = {
    columnas: [],
    filas: []
  };

  public arreglotablaDesglose: any = {
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

    if (this.tamanio < 600) {

      this.modalWidth = "90%";

    } else {
      this.modalWidth = "55%";

    }
  }

  constructor(private gruposnominaPrd: GruponominasService, private routerPrd: Router,
    private routerActive: ActivatedRoute, private catalogosPrd: CatalogosService,
    private empresasPrd: SharedCompaniaService, private usuariosSistemaPrd: UsuarioSistemaService,
    private modalPrd: ModalService,private configuracionesPrd:ConfiguracionesService) { }

  ngOnInit(): void {

    this.establecerPermisos(); 

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.routerActive.params.subscribe(datos => {
      this.id_empresa = datos["id"];

      this.cargando = true;
      let objEnviar = {

        nombre: this.nombre,
        centrocClienteId: {
          centrocClienteId: this.id_empresa
        },
        periodicidadPagoId: {
          periodicidadPagoId: this.periodonomina
        }
      }

      this.gruposnominaPrd.filtrar(objEnviar).subscribe(datos => {

        this.preparandoTabla(datos);
      });


      this.catalogosPrd.getPeriocidadPago(true).subscribe(datos => this.arregloperiodo = datos.datos);
      this.empresasPrd.getAllEmp(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloRazonSocial = datos.datos);


      this.razonsocial = this.id_empresa;

    });


  }



 public establecerPermisos(){
  this.esRegistrar = this.configuracionesPrd.getPermisos("Registrar");
  this.esConsultar = this.configuracionesPrd.getPermisos("Consultar");
  this.esEditar = this.configuracionesPrd.getPermisos("Editar");
  this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
}


  public preparandoTabla(datos: any) {
    this.arreglo = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("nombre", "Nombre de grupo de nómina	"),
      new tabla("razon", "Razón social"),
      new tabla("periodo", "Período de nómina"),
      new tabla("numero", "Número de empleados", true, true,true)
    ];


    this.arreglotabla = {
      columnas:[],
      filas:[]
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;
    this.cargando = false;

    if (datos.datos != undefined)
      for (let item of datos.datos) {
        item.seleccionado = false;
        item.cargandoDetalle = false;
      }
    this.arreglo = datos.datos;

    this.cargando = false;
  }

  public filtrar() {


    let objEnviar = {

      nombre: this.nombre,
      centrocClienteId: {
        centrocClienteId: this.razonsocial
      },
      periodicidadPagoId: {
        periodicidadPagoId: this.periodonomina
      }
    }


    this.cargando = true;

    this.gruposnominaPrd.filtrar(objEnviar).subscribe(datos => {
      this.preparandoTabla(datos);
      this.cargando = false;

    });


  }


  public eliminar(indice: any) {
    this.indexSeleccionado = indice;


    const titulo = "¿Deseas eliminar el grupo de nómina?";


    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {
        let id = this.arreglo[this.indexSeleccionado].id;
        this.gruposnominaPrd.eliminar(id).subscribe(datos => {

          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);


          if (datos.resultado) {

            this.arreglo.splice(this.indexSeleccionado, 1);
            this.preparandoTabla({datos:this.arreglo});


          }


        });
      }
    });



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


      


    });

  }


  public recibirTabla(obj: any) {


    switch (obj.type) {

      case "columna":
        this.traerModal(obj.indice)
        break;
      case "editar":
        this.verdetalle(obj.datos);
        break;
      case "eliminar":
        this.eliminar(obj.indice);
        break;
      case "desglosar":
        let item = obj.datos;
        
        this.gruposnominaPrd.getGroupNomina(item.id).subscribe((datos) => {
          let temp = datos.datos;
          if (temp != undefined) {

            for (let llave in temp) {
              item[llave] = temp[llave];
            }

          }


          let columnas: Array<tabla> = [
            new tabla("nombre", "Nombre de grupo de nómina	"),
            new tabla("razon", " Razón social"),
            new tabla("nombrecuenta", " Cuenta bancaria"),
            new tabla("nombremoneda", "Moneda"),
            new tabla("periodo", "Periodo de nómina"),
            new tabla("baseperiododescripcion", "Calcular periodo de nómina con base a:"),
            new tabla("periodoaguinaldodescripcion", "Periodo para pago de aguinaldo"),
            new tabla("isrAguinaldoReglamentodescripcion", "Calcular ISR de aguinaldo aplicando reglamento:"),
            new tabla("ajustarBaseGravableFaltantesISR", "Ajustar base gravable del mes de periodos ordinarios faltantes"),
            new tabla("maneraCalcularSubsidiodescripcion", "Calcular subsidio al empleo de manera:"),
            new tabla("pagoComplementarioDes", "Pago complementario")
            
          ];
          item.pagoComplementarioDes = item.pagoComplementario ? "Si" : "No";
          item.nombrecuenta = item.cuentaBancoId?.nombreCuenta;
          item.nombremoneda = item.monedaId?.descripcion;
          item.baseperiododescripcion = item.basePeriodoId?.nombreCorto;
          item.ajustarBaseGravableFaltantesISR = item.ajustarBaseGravableFaltantes ? "Si" : "No";
          item.periodoaguinaldodescripcion = item.periodoAguinaldoId?.descripcion;
          item.isrAguinaldoReglamentodescripcion = item.esIsrAguinaldoReglamento ? "Si" : "No";
          item.maneraCalcularSubsidiodescripcion = (item.maneraCalcularSubsidio == 'P') ? 'Periódica' : 'Diaria';


          this.arreglotablaDesglose.columnas = columnas;
          this.arreglotablaDesglose.filas = item;

          item.cargandoDetalle = false;

        });

        break;
    }

  }


}
