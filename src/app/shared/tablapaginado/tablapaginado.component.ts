import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';

@Component({
  selector: 'app-tablapaginado',
  templateUrl: './tablapaginado.component.html',
  styleUrls: ['./tablapaginado.component.scss']
})
export class TablapaginadoComponent implements OnInit {

  @Input() public cargando: any = false;
  public arreglo: any = [];
  public numeroitems: number = 100;


  public arreglopaginas: Array<any> = [];

  estructuratabla: any;

  @Input() public datos: any = {
    columnas: [],
    filas: []
  }

  @Input() public ver: any;
  @Input() public editar: any;
  @Input() public eliminar: any;
  @Input() public desglosar: any;
  @Input() public imagen: any;
  @Input() public porcentaje: boolean = false;

  @Input() public icondefault: string = "default";

  @Output() public salida = new EventEmitter();

  public arreglotemp: any = [];


  public rutaimagenes: any = {

    "default": 'assets/imgs/logo.png',
    "usuario": 'assets/imgs/usuario.png',
    "empresa": 'assets/imgs/empresa_03.png'

  };


  constructor() { }

  ngOnInit(): void {



  }


  public cambia() {

    this.paginar();

  }

  public verdetalle(obj: any) {

  }


  ngOnChanges(changes: SimpleChanges) {



    if (this.datos.filas !== undefined) {
      this.arreglotemp = this.datos.filas;


      console.log(this.arreglotemp);

      this.paginar();

    } else {
      this.arreglo = undefined;
      this.arreglotemp = undefined;
    }

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

      this.acomodarPaginado();


      this.arreglo = this.arreglotemp.slice(0, Number(this.numeroitems));



    }

  }


  public arregloTemporalPaginas: any = [];
  public activarMas: boolean = false;
  public activarMenos: boolean = false;
  public activarSiguiente: boolean = false;
  public activarAntes: boolean = false;
  public indice: number = 0;
  public acomodarPaginado() {
    if (this.arreglopaginas !== undefined) {
      if (this.arreglopaginas.length > 3) {
        this.arregloTemporalPaginas = this.arreglopaginas;
        this.indice = 0;
        this.arreglopaginas = this.arregloTemporalPaginas.slice(this.indice * 3, (this.indice * 3) + 3);
        this.activarMas = true;
        this.activarSiguiente = true;
      } else {
        this.activarSiguiente = this.arreglopaginas.length > 1
        this.arregloTemporalPaginas = this.arreglopaginas;
      }
    }
  }

  public paginacambiar(item: any) {

    this.arreglo = this.arreglotemp.slice(item.numeropagina, item.llavepagina);
    for (let item of this.arreglopaginas) {
      item.activado = false;
    }

    item.activado = true;



    const indice = this.verificarIndice();//Se verifica el indice pero del arreglo del páginado

    this.activarAntes = !(indice === 0 && this.indice === 0);

    const elementosTotalArreglo = this.arreglotemp.length;


    if (indice == 2) {
      let totalElementosPaginado = ((this.indice + 1) * 3) * Number(this.numeroitems);
      if (totalElementosPaginado >= elementosTotalArreglo) {
        this.activarSiguiente = false;
      }
    }else{
      this.activarSiguiente = true;
    }



  }

  public mostrarListaPaginaSiguiente() {
    this.indice++;

    this.arreglopaginas = this.arregloTemporalPaginas.slice((this.indice * 3), (this.indice * 3) + 3);
    this.activarMenos = true;

    if ((this.indice * 3) + 3 >= this.arregloTemporalPaginas.length) {
      this.activarMas = false;
      if (this.arreglopaginas.length <= 1) {
        this.activarSiguiente = false;
      }
    }

    this.paginacambiar(this.arreglopaginas[0]);
  }

  public mostrarListaPaginaAnterior() {
    this.indice--;
    if (this.indice >= 0) {
      this.arreglopaginas = this.arregloTemporalPaginas.slice((this.indice * 3), (this.indice * 3) + 3);
      this.activarMenos = true;
      this.activarMas = true;
      this.activarSiguiente = true;
    }

    if (this.indice == 0) {
      this.indice = 0;
      this.activarMenos = false;
    }

    this.paginacambiar(this.arreglopaginas[2]);
  }


  public pasarSiguienteItem(tipoSiguiente: boolean) {

    let indicePagina = this.verificarIndice();

    if (tipoSiguiente) {
      if (indicePagina == 2) {
        this.mostrarListaPaginaSiguiente();
      } else {
        this.paginacambiar(this.arreglopaginas[indicePagina + 1]);
      }
    } else {
      if (indicePagina == 0) {
        this.mostrarListaPaginaAnterior();
      } else {
        this.paginacambiar(this.arreglopaginas[indicePagina - 1]);
      }
    }
  }

  private verificarIndice(): number {

    let indicePagina = 0;
    for (let item of this.arreglopaginas) {
      if (item.activado)
        break;
      indicePagina++;
    }

    return indicePagina;

  }



  public btnEditar(item: any) {
    this.salida.emit({ type: "editar", datos: item });
  }

  public btnEliminar(item: any) {
    this.salida.emit({ type: "eliminar", datos: item });
  }

  public btnVer(item: any) {
    this.salida.emit({ type: "ver", datos: item });
  }
  public btnDesglosar(item: any) {
    this.salida.emit({ type: "desglosar", datos: item });
  }


  public eventoclick(evento: tabla, item: any) {

    if (evento.eventoclick) {
      this.salida.emit({ type: "columna", datos: item });
    }

  }

}
