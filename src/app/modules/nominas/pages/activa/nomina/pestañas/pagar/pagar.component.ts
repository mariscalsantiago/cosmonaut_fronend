import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { NominasService } from 'src/app/modules/nominas/services/nominas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.component.html',
  styleUrls: ['./pagar.component.scss']
})
export class PagarComponent implements OnInit {
  @Output() salida = new EventEmitter();

  public cargando:boolean = false;

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  }

  public arreglo:any = [];

  constructor(private modalPrd:ModalService,private nominasPrd:NominasService) { }



  ngOnInit(): void {


  
    this.arreglo = this.nominasPrd.arregloEmpleado;


    let columnas:Array<tabla> = [
      new tabla("nombrecompleto","Empleados"),
      new tabla("rfc","Número de empleado",true,false,true),
      new tabla("diaslaborados","Banco",false,false,true),
      new tabla("total","Total",false,false,true),
      new tabla("tipo","Tipo de pago",false,false,true)
    ];


    for(let item of this.arreglo){
        item["nombrecompleto"]=item.personaId.nombre+" "+item.personaId.apellidoPaterno;
        item["rfc"]=item.personaId.rfc;
        item["diaslaborados"]="BBVA Bancomer";
        item["percepciones"]="$26,200.00";
        item["tipo"]="Transferencia";
        item["total"]="$25,700.00";
    }

    let filas:Array<any> = this.arreglo;

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


  public recibirTabla(obj:any){


  }

}
