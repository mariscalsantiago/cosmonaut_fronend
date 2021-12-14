import { DatePipe } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { table } from 'console';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EventosService } from '../../../services/eventos.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';

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
  public objFiltro: any = [];
  public nombre: any = "";
  public apellidoPaterno: any = "";
  public apellidoMaterno: any = "";
  public esActivo: any ="0";
  public tipoIncidenciaId : any = "0";
  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public arregloIncidenciaTipo: any = [];

  public modulo: string = "";
  public subModulo: string = "";

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
    private modalPrd:ModalService,public configuracionPrd:ConfiguracionesService,  private catalogosPrd: CatalogosService, ) { }

  ngOnInit(): void {

    this.establecerPermisos();
    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;


    this.cargando = true;
    this.filtrar();
    
  }

  public generandoTabla(){
    
    let columnas:Array<tabla> = [
      new tabla("incidenciaDescripcion","Tipo de evento"),
      new tabla("nombrecompleado","Nombre del empleado"),
      new tabla("numeroEmpleado","Número de empleado",false,false,true),
      new tabla("fechaInicio","Fecha de inicio",false,false,true),
      new tabla("cantidad","Cantidad",false,false,true),
      new tabla("unidadM","Unidad de Medida",false,false,true)
      
    ];

    this.arreglotabla = {
      columnas:[],
      filas:[]
    }

    if(this.arreglo !== undefined){
      
        for(let item of this.arreglo){
            item["nombrecompleado"] = `${item.nombre} ${item.apellidoPaterno} ${item.apellidoMaterno == undefined ? "":item.apellidoMaterno}`;
            let datepipe = new DatePipe("es-MX");
            item.fechaInicio = datepipe.transform(item.fechaInicio , 'dd-MMM-y')?.replace(".","");
            item.fechaAplicacion = datepipe.transform(item.fechaAplicacion , 'dd-MMM-y')?.replace(".","");
            item.fechaFin = datepipe.transform(item.fechaFin , 'dd-MMM-y')?.replace(".","");
            if(item.tipoIncidenciaId == 5){
                if(item.unidadMedidaId !== undefined){
                    if(item.unidadMedidaId == 2){
                      item.unidadM = 'Días';
                      item.cantidad = item.heTiempo;
                      
                    }
                    else if(item.unidadMedidaId == 3){
                      item.unidadM = 'Monto';
                      item.cantidad = item.monto;
                    }
                }else{
                  if(item.duracion !== undefined){
                    item.cantidad = item.duracion;
                    item.unidadM = 'Días';
                  }
                }
            }   
            else if(item.tipoIncidenciaId == 8){
                item.unidadM = 'Monto';
                item.cantidad = item.monto;
            }  
            
            else if(item.tipoIncidenciaId == 13 || item.tipoIncidenciaId == 14){
              if(item.unidadMedidaId !== undefined){
                if(item.unidadMedidaId == 1){
                  item.unidadM = 'Horas';
                  if(item.heTiempo !== 0 && item.heTiempo !== undefined){
                    item.cantidad = item.heTiempo;
                  }else{
                    item.cantidad = item.duracion;  
                  }
                }
                else if(item.unidadMedidaId == 3){
                  item.unidadM = 'Monto';
                  item.cantidad = item.monto;
                }
              }  
            }else{
              item.unidadM = 'Días';
              if(item.duracion !== 0){
                item.cantidad = item.duracion;
              }else{
                item.cantidad = item.heTiempo;
              }
            }           
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
     this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas eliminar el evento?").then((valor)=>{
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
                    new tabla("cantidad","Cantidad",false,false,true),
                    new tabla("unidadM","Unidad de Medida",false,false,true)
                    
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
    
    this.objFiltro = [];
    this.catalogosPrd.getTipoIncidencia(true).subscribe(datos => {this.arregloIncidenciaTipo = datos.datos;});

    this.cargando = true;
    if(this.nombre != ''){
      this.objFiltro = {
        ...this.objFiltro,
        nombre: this.nombre
      };
      }
      if(this.apellidoPaterno != ''){
        this.objFiltro = {
          ...this.objFiltro,
          apellidoPaterno: this.apellidoPaterno
        };
      } 
      if(this.apellidoMaterno != ''){
          this.objFiltro = {
            ...this.objFiltro,
            apellidoMaterno: this.apellidoMaterno
          };
      }
      if(this.tipoIncidenciaId != "0"){
        this.objFiltro = {
          ...this.objFiltro,
          tipoIncidenciaId: Number(this.tipoIncidenciaId)
        };
    }
      this.objFiltro = {
        ...this.objFiltro,
        esActivo: true,
        clienteId: this.usuariosSistemaPrd.getIdEmpresa()
      };
      this.eventosPrd.filtro(this.objFiltro).subscribe(datos =>{

        this.arreglo = datos.datos;
        this.generandoTabla();
      });
  }

  public agregar(){
      this.router.navigate(['/eventos/eventosxempleado','nuevo']);
  }

  public inicio(){
    this.router.navigate(['/inicio']);
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
