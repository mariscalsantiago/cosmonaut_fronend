import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-subir-foto-perfil',
  templateUrl: './subir-foto-perfil.component.html',
  styleUrls: ['./subir-foto-perfil.component.scss']
})
export class SubirFotoPerfilComponent implements OnInit {


  public cargandoImg:boolean = false;
  public obj:any = {url:undefined}


  public imagen:string = "";

  @Output() salida = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
   }
 
   public aceptar(){
     this.salida.emit({type:"guardar",datos:this.imagen});
   }


   public recibirImagen(obj:any){
        this.imagen = obj;
   }

}
