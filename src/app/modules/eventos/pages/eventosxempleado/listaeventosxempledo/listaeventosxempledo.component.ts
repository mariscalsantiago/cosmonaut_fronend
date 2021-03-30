import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';

@Component({
  selector: 'app-listaeventosxempledo',
  templateUrl: './listaeventosxempledo.component.html',
  styleUrls: ['./listaeventosxempledo.component.scss']
})
export class ListaeventosxempledoComponent implements OnInit {

  public cargando:boolean = false;
  public aparecemodalito:boolean = false;
  public scrolly: string = '250px';
  public tamanio: number = 0;
  public modalWidth: string = "75%";
  public cargandodetallegrupo:boolean = false;

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;

    if (this.tamanio < 600) {

      this.modalWidth = "90%";

    } else {
      this.modalWidth = "75%";

    }
  }

  constructor(private router:Router) { }

  ngOnInit(): void {

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;
    
     let columnas:Array<tabla> = [
       new tabla("x","Nombre del empleado"),
       new tabla("x","Número de empleado",false,false,true),
       new tabla("x","Fecha solicitada",false,false,true),
       new tabla("x","Tiempo",false,false,true),
       new tabla("x","Estatus")
     ]

     this.arreglotabla.columnas = columnas;
     this.arreglotabla.filas = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
  }

  public recibirTabla(obj:any){
    
      this.traerModal(obj.indice);
  }

  public filtrar(){

  }

  public agregar(){
      this.router.navigate(['/eventos/eventosxempleado','nuevo']);
  }


  public traerModal(indice: any) {

    let elemento: any = document.getElementById("vetanaprincipaltabla")
    this.aparecemodalito = true;


    console.log("La modal",elemento.getBoundingClientRect().y);

    if (elemento.getBoundingClientRect().y < -40) {
      let numero = elemento.getBoundingClientRect().y;
      numero = Math.abs(numero);

      this.scrolly = numero + 400 + "px";


    } else {

      this.scrolly = "250px";
    }



    if (this.tamanio < 600) {

      this.modalWidth = "90%";

    } else {
      this.modalWidth = "75%";

    }



  }

}
