import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { PoliticasService } from '../services/politicas.service';

@Component({
  selector: 'app-listapoliticas',
  templateUrl: './listapoliticas.component.html',
  styleUrls: ['./listapoliticas.component.scss']
})
export class ListapoliticasComponent implements OnInit {


  public tamanio: number = 0;
  public cargando: Boolean = false;
  public id_empresa: number = 0;
  public changeIconDown: boolean = false;
  public objEnviar: any;
  public aparecemodalito: boolean = false;
  public aparecemodalitoempleado: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandodetallearea: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  public arreglo: any = [];
  public arreglodetalle: any = [];
  public arreglodetalleemp: any = [];



  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public arreglotablaDesglose:any = {
    columnas:[],
    filas:[]
  };


  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;






  constructor(private routerPrd: Router, private politicasProd: PoliticasService, private CanRouterPrd: ActivatedRoute,
    private modalPrd: ModalService,private configuracionesPrd:ConfiguracionesService) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos => {

      this.id_empresa = datos["id"]
      this.politicasProd.getAllPol(this.id_empresa).subscribe(datos => {
        
        this.traerdatosTabla(datos);
      });

    });

  }


  public establecerPermisos(){
    this.esRegistrar = this.configuracionesPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionesPrd.getPermisos("Consultar");
    this.esEditar = this.configuracionesPrd.getPermisos("Editar");
    this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
  }


  public traerdatosTabla(datos:any){
    this.arreglo = datos.datos;
    let columnas: Array<tabla> = [
      new tabla("nombre", "Nombre de política"),
      new tabla("count", "Número de empleados",true,true,true)
    ];


    this.arreglotabla = {
      columnas: [],
      filas: []
    };

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;

    this.cargando = false;
  }


  public verdetalle(obj: any) {

    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'politicas', tipoinsert], { state: { data: obj } });
    this.cargando = false;
  }
  public eliminar(obj: any) {


    this.objEnviar = {
      politicaId: obj.politicaId,
      centrocClienteId: {
        centrocClienteId: obj.centrocClienteId
      }
    }


    const titulo = "¿Deseas eliminar la politíca?";

    this.modalPrd.showMessageDialog(this.modalPrd.warning, titulo).then(valor => {
      if (valor) {


        this.politicasProd.eliminar(this.objEnviar).subscribe(datos => {
          this.cargando = false;
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
          if (datos.resultado) {
            this.politicasProd.getAllPol(this.id_empresa).subscribe(datos => {
              this.traerdatosTabla(datos);
            });
          }

        });
      }
    });;

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

    let politicaitem = this.arreglo[indice];
    this.cargandodetallearea = true;

    this.politicasProd.getTabBen(politicaitem.politicaId, this.id_empresa).subscribe(datos => {
      this.cargandodetallearea = false;
      this.arreglodetalle = datos.datos == undefined ? [] : datos.datos;
    });

  }
  public traerModalEmpleo(indice: any) {

    let elemento: any = document.getElementById("vetanaprincipaltabla")
    this.aparecemodalitoempleado = true;



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

    let politicaitem = this.arreglo[indice];
    this.cargandodetallearea = true;

    this.politicasProd.getdetallePolitica(politicaitem.politicaId, this.id_empresa).subscribe(datos => {
      this.cargandodetallearea = false;
      this.arreglodetalleemp = datos.datos == undefined ? [] : datos.datos;
    });

  }

  apagando(indice: number) {

    for (let x = 0; x < this.arreglo.length; x++) {
      if (x == indice)
        continue;

      this.arreglo[x].seleccionado = false;
    }


    this.arreglo[indice].seleccionado = !this.arreglo[indice].seleccionado;

  }


  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "editar":
          this.verdetalle(obj.datos);
        break;
      case "eliminar":
        this.eliminar(obj.datos);
        break;
      case "desglosar":
        
        let columnas: Array<tabla> = [
          new tabla("diasEconomicos", "Días económicos"),
          new tabla("primaAniversariodescripcion", "Prima vacacional"),
          new tabla("descuentaFaltasDescripcion", "Se descuentan faltas"),
          new tabla("descuentaIncapacidadesdescripcion", "Se descuentan incapacidades"),
          new tabla("costoValesRestaurantedescripcion", "Costo vales de restaurante"),
          new tabla("descuentoPropDiadescripcion", "Descuento proporción séptimo día"),
          new tabla("calculoAntiguedadxdescripcion", "Cálculos en base a :")
        ];


        let item = obj.datos;
        item.primaAniversariodescripcion= (item.primaAniversario)?'Al aniversario':'Por evento';
        item.descuentaFaltasDescripcion = (item.descuentaFaltas)?'Si':'No';
        item.descuentaIncapacidadesdescripcion = ((item.descuentaIncapacidades)?'Si':'No');
        item.costoValesRestaurantedescripcion = (item.costoValesRestaurante)?'Si':'No';
        item.descuentoPropDiadescripcion = (item.descuentoPropDia)?'Si':'No';
        item.calculoAntiguedadxdescripcion = (item.calculoAntiguedadId==2)?'Fecha de ingreso':'Fecha de antigüedad';

          
       
        this.arreglotablaDesglose.columnas = columnas;
        this.arreglotablaDesglose.filas = item;
        item.cargandoDetalle = false;
        
        break;
      case "tablabeneficio":
        this.traerModal(obj.indice);
        break;
      case "columna":
        this.traerModalEmpleo(obj.indice);
        break;
    }

  }







}


