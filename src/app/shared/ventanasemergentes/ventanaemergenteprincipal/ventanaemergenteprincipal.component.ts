import { Component, HostListener, Input, OnInit, Output ,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-ventanaemergenteprincipal',
  templateUrl: './ventanaemergenteprincipal.component.html',
  styleUrls: ['./ventanaemergenteprincipal.component.scss']
})
export class VentanaemergenteprincipalComponent implements OnInit {


  @Input() public titulo:string = "";
  public tamanio:number = 0;
  public leftP:number = 200;

  public scrollTop:any;
  public content:any;

  public bodymodal:any;
  public tamanioVentanaEmergente:any;

  @Output() salida = new EventEmitter<any>();

  @Input() public mostrar = {
    cargamasiva:false,
    solicitudvacacaciones:false,
    solicitudIncapacidad:false,
    solicitudHorasExtras:false,
    solicitudDiasEconomicos:false
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
    
    this.tamanioVentanaEmergente =  this.bodymodal.scrollWidth / 2;
    this.leftP = (this.tamanio / 2) - this.tamanioVentanaEmergente;

    this.content.style.overflow = "hidden";
  }


  public cerrarModal(){
    this.salida.emit({type:"modal"});
  }


  public recibirEmergente($event:any){
      switch($event.type){
          case "cancelar":
             this.cerrarModal();
            break;
      }
  }


  

}
