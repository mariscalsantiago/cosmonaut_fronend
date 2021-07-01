import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { table } from 'console';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EventosService } from '../../../services/eventos.service';

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

  public arreglo:any = [];

  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };


  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;






  public evento:any;

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

  constructor(private router:Router,private eventosPrd:EventosService,private usuariosSistemaPrd:UsuarioSistemaService,
    private modalPrd:ModalService,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {

    this.establecerPermisos();

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;


    this.cargando = true;

    this.eventosPrd.getByIdEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos =>{

      this.arreglo = datos.datos;
      this.generandoTabla();
    });
    
  }

  public generandoTabla(){
    let columnas:Array<tabla> = [
      new tabla("incidenciaDescripcion","Tipo de evento"),
      new tabla("nombrecompleado","Nombre del empleado"),
      new tabla("numeroEmpleado","Número de empleado",false,false,true),
      new tabla("fechaInicio","Fecha de inicio",false,false,true),
      new tabla("tiempo","Tiempo",false,false,true)
    ];

    this.arreglotabla = {
      columnas:[],
      filas:[]
    }

    if(this.arreglo !== undefined){
        for(let item of this.arreglo){
            item["nombrecompleado"] = `${item.nombre} ${item.apellidoPaterno} ${item.apellidoMaterno == undefined ? "":item.apellidoMaterno}`;
            var datePipe = new DatePipe("es-MX");
            item.fechaInicio = (new Date(item.fechaInicio).toUTCString()).replace(" 00:00:00 GMT", "");
            item.fechaInicio = datePipe.transform(item.fechaInicio, 'dd-MMM-y')?.replace(".","");
        }
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;

    this.cargando = false;
  }


  public establecerPermisos(){
    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esConsultar = this.configuracionPrd.getPermisos("Consultar");
  }

  public recibirTabla(obj:any){
    
    
      switch(obj.type){
         case "eliminar":
             this.eliminarIncidencia(obj.datos,obj.indice);
           break;
           case "ver":
             this.evento = obj.datos;
             
            this.traerModal(obj.indice);
            
             break;
      }
  }


  public eliminarIncidencia(obj:any,indice:number){
     this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas inactivar el evento?").then((valor)=>{
        if(valor){
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.eventosPrd.delete(obj.incidenciaId).subscribe(datos =>{
            
             this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
             this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
               if(datos.resultado){
                obj.esActivo = false;
                this.arreglo.splice(indice,1);
                this.arreglotabla = {
                  columnas: [
                    new tabla("incidenciaDescripcion","Tipo de evento"),
                    new tabla("nombrecompleado","Nombre del empleado"),
                    new tabla("numeroEmpleado","Número de empleado",false,false,true),
                    new tabla("fechaInicio","Fecha de inicio",false,false,true),
                    new tabla("tiempo","Tiempo",false,false,true)
                  ],
                  filas:this.arreglo
                }
               }
             });
          });
        }
     });
  }

  public filtrar(){

  }

  public agregar(){
      this.router.navigate(['/eventos/eventosxempleado','nuevo']);
  }


  public traerModal(indice: any) {

    let elemento: any = document.getElementById("vetanaprincipaltabla")
    this.aparecemodalito = true;


    

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
