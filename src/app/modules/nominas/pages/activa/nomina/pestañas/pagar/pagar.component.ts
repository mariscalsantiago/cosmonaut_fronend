import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.scss']
})
export class PagarComponent implements OnInit {
  @Output() salida = new EventEmitter();

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  }

  constructor(private modalPrd:ModalService) { }



  ngOnInit(): void {


    let columnas:Array<tabla> = [
      new tabla("nombre","Empleados"),
      new tabla("id","RFC",true,false,true),
      new tabla("x","Banco"),
      new tabla("x","Total"),
      new tabla("x","Tipo de pago"),
    ];

    let filas:Array<any> = [{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"},{nombre:'Santiago antonio',id:3,total:"$234.3"}];

    this.arreglotabla = {
      columnas:columnas,
      filas:filas
    }

   
  }


  public continuar(){

    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas continuar?").then(valor =>{
      if(valor){
        this.salida.emit({type:"dispersar"});
      }
    });
  }

  public guardar(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas disperar la nómina?").then(valor =>{
      if(valor){
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
         setTimeout(() => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.salida.emit({type:"dispersar"});
         }, 2000);
      }
    });
  }

}
