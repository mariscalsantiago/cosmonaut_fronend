import { Component, HostListener, Input, OnInit, Output ,EventEmitter, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-ventanaemergenteprincipal',
  templateUrl: './ventanaemergenteprincipal.component.html',
  styleUrls: ['./ventanaemergenteprincipal.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class VentanaemergenteprincipalComponent implements OnInit {

  

  @Input() public titulo:string = "";
  @Input() public ventanaalerta:boolean = false;

  public tamanio:number = 0;
  public leftP:number = 200;

  public scrollTop:any;
  public content:any;

  public bodymodal:any;
  public tamanioVentanaEmergente:any;

  @Output() salida = new EventEmitter<any>();

  @Input() public mostrar = {
    nuevanomina:false,
    timbrado:false
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;

    this.content = document.getElementById("contenido");
    this.bodymodal = document.getElementById("bodyemergente");
    this.scrollTop = this.content.scrollTop;

    this.tamanio = this.content.scrollWidth;
    
    this.tamanioVentanaEmergente =  this.bodymodal.scrollWidth / 2;
    this.leftP = (this.tamanio / 2) - this.tamanioVentanaEmergente;

    
  }

  constructor() { 




  }

  ngOnInit(): void {

    this.content = document.getElementById("contenido");
    this.bodymodal = document.getElementById("bodyemergente");
    this.scrollTop = this.content.scrollTop;

    this.tamanio = this.content.scrollWidth;
    
   

    this.tamanioVentanaEmergente =  (this.ventanaalerta?350:this.bodymodal.scrollWidth) / 2;
    this.leftP = (this.tamanio / 2) - this.tamanioVentanaEmergente;

    this.content.style.overflow = "hidden";


    console.log("Este es el valor del boolean",this.ventanaalerta);
  }


  public cerrarModal(){
    this.salida.emit({type:"modal"});
  }


  public recibirEmergente($event:any){
      switch($event.type){
          case "cancelar":
             this.cerrarModal();
            break;
          case "guardar":
            this.salida.emit($event);
            break;
      }
  }


  

}
