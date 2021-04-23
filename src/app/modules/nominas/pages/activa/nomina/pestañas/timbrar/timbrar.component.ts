import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { NominasService } from 'src/app/modules/nominas/services/nominas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';

@Component({
  selector: 'app-timbrar',
  templateUrl: './timbrar.component.html',
  styleUrls: ['./timbrar.component.scss']
})
export class TimbrarComponent implements OnInit {
  @Output() salida = new EventEmitter();
  public cargando:boolean = false;

  public arreglo:any = [];
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  constructor(private nominasPrd:NominasService,private empleadoPrd:EmpleadosService,private ventana:VentanaemergenteService,
    private modalPrd:ModalService) { }

  ngOnInit(): void {

    this.empleadoPrd.getEmpleadosCompania(112).subscribe(datos =>{
      this.arreglo = [datos.datos[0]];


      let columnas:Array<tabla> = [
        new tabla("nombrecompleto","Empleados"),
        new tabla("tipo","Método de pago",false,false,true),
        new tabla("total","Total neto",false,false,true),
        new tabla("fecha","Fecha de pago de timbrado",false,false,true),
        new tabla("status","Estatus ",false,false,true)
  
      ];
  
  
      for(let item of this.arreglo){
          item["nombrecompleto"]="Santiago Dario Ocampo";
          item["rfc"]="OCSA8809087Z7";
          item["diaslaborados"]="BBVA Bancomer";
          item["percepciones"]="$16,499.96";
          item["tipo"]="Transferencia";
          item["total"]="$13,271.36";
          item["status"]="Sin timbrar";
          item["fecha"]=new DatePipe("es-MX").transform(new Date(),"dd-MMM-yy")?.replace(".","");
      }
      let filas:Array<any> = this.arreglo;
  
      this.arreglotabla = {
        columnas:columnas,
        filas:filas
      }


    });

    



  }


  public recibirTabla(obj:any){

    let datos = obj.datos;
       switch(obj.type){
          case "desglosar":
              datos.cargandoDetalle = false;
            break;
       }
  }

  public definirFecha(){
    this.ventana.showVentana(this.ventana.timbrado,{ventanaalerta:true});
  }


  public guardar(){
      this.ventana.showVentana(this.ventana.timbrar,{ventanaalerta:true}).then(datos =>{

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        setTimeout(() => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.salida.emit({type:"timbrar"});
        }, 2000);

      });;
  }

  public continuar(){
      this.guardar();
  }

}
