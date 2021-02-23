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
  public numeroitems: number = 5;


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
  @Input() public imagen:any;

  @Output() public salida = new EventEmitter();

  public arreglotemp: any = [];




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
      this.paginar();

    }else{
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


  public btnEditar(item:any){
    this.salida.emit({type:"editar",datos:item}); 
  }

  public btnEliminar(item:any){
    this.salida.emit({type:"eliminar",datos:item});   
  }

  public btnVer(item:any){
    this.salida.emit({type:"ver",datos:item});   
  }
  public btnDesglosar(item:any){
    this.salida.emit({type:"desglosar",datos:item}); 
  }


  public eventoclick(evento:tabla,item:any){

    if(evento.eventoclick){
        this.salida.emit({type:"columna",datos:item});        
    }

  }

}
