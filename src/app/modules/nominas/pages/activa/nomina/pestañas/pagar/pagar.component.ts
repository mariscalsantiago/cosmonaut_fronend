import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { NominasService } from 'src/app/modules/nominas/services/nominas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';

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

  constructor(private modalPrd:ModalService,private nominasPrd:NominasService,private empleadoPrd:EmpleadosService,
    private ventana:VentanaemergenteService) { }



  ngOnInit(): void {



    this.empleadoPrd.getEmpleadosCompania(112).subscribe(datos =>{
      this.arreglo = [datos.datos[0]];


      let columnas:Array<tabla> = [
        new tabla("nombrecompleto","Nombre"),
        new tabla("rfc","RFC",false,false,true),
        new tabla("diaslaborados","Banco",false,false,true),
        new tabla("total","Total",false,false,true),
        new tabla("tipo","Tipo de pago",false,false,true),
        new tabla("status","Estatus ",false,false,true)
      ];
  
  
      for(let item of this.arreglo){
          item["nombrecompleto"]="Santiago Dario Ocampo";
          item["rfc"]="OCSA8809087Z7";
          item["diaslaborados"]="BBVA Bancomer";
          item["percepciones"]="$16,499.96";
          item["tipo"]="Transferencia";
          item["total"]="$13,271.36";
          item["status"] = "No pagado";
      }
  
      let filas:Array<any> = this.arreglo;
  
      this.arreglotabla = {
        columnas:columnas,
        filas:filas
      }
  

    });
  
  

   
  }


  public continuar(){

    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas continuar?").then(valor =>{
      if(valor){
        this.salida.emit({type:"dispersar"});
      }
    });
  }

  public guardar(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas dispersar la nómina?").then(valor =>{
      if(valor){

        this.salida.emit({type:"dispersar"});

       
      }
    });
  }


  public recibirTabla(obj:any){


  }

}
