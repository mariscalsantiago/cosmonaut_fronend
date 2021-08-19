import { Component, HostListener, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KardexService } from 'src/app/modules/empleados/services/kardex.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { tabla } from 'src/app/core/data/tabla';
import { DatePipe } from '@angular/common';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { ContratocolaboradorService } from 'src/app/modules/empleados/services/contratocolaborador.service';
import { truncateSync } from 'fs';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.scss']
})
export class KardexComponent implements OnInit {

  public tamanio:number = 0;
  public cargando : Boolean = false;
  public arreglo: any = [];
  public cargandoIcon: boolean= false;
  public idEmpleado: number = 0;
  public idEmpresa: number = 0;
  public empleado: any = [];
  public peticion: any = [];
  public tipoMovimineto: string = '0';
  public arregloMovimientos: any = [];
  public contratoDesc: string | undefined;

  
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  };

  public arreglotablaDesglose:any = {
    columnas:[],
    filas:[]
};

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;
    this.tamanio = event.target.innerWidth;
  }



  constructor(private routerPrd: Router, private kardexPrd: KardexService,private modalPrd:ModalService, 
    private router:ActivatedRoute, private ventana:VentanaemergenteService,
    private usuariosSistemaPrd:UsuarioSistemaService,  private contratoColaboradorPrd: ContratocolaboradorService) { }

  ngOnInit(): void {

    

    this.router.params.subscribe(params => {
      this.idEmpleado = params["id"];
    });

    
    this.contratoColaboradorPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datos => {
      this.empleado = datos.datos;
      
      this.peticion = {
        fechaContrato: this.empleado.fechaContrato,
        personaId: {
            personaId: this.idEmpleado
        },
        centrocClienteId: {
            centrocClienteId: this.usuariosSistemaPrd.getIdEmpresa()
        }
      }
      
      this.cargando = true;
    
      this.kardexPrd.getListaMovimientos(this.peticion).subscribe(datos => {
        for(let item of datos.datos){

          if(this.arregloMovimientos.length != 0 ){
              this.contratoDesc = this.arregloMovimientos.find((itemmov: any) => itemmov.movimientoId === item.movimientoId)?.movimiento;
              if(this.contratoDesc !== undefined)
              continue;
              this.arregloMovimientos.push(item);
   
  
          }else{
              this.arregloMovimientos.push(item);
          }
        } 
          this.crearTabla(datos);
      });
   
    });;
    



  }


  public crearTabla(datos:any){
    
    this.arreglo = datos.datos;

    
    let columnas: Array<tabla> = [
      new tabla("tipoMovimiento", "Tipo de movimiento"),
      new tabla("fechaMovimiento", "Fecha de movimiento"),
      new tabla("registroPatronal", "Registro Patronal")
    ]


    this.arreglotabla = {
      columnas:[],
      filas:[]
    }


    if(this.arreglo !== undefined){
      for(let item of this.arreglo){
        item.fechaMovimiento = (new Date(item.fechaMovimiento).toUTCString()).replace(" 00:00:00 GMT", "");
        let datepipe = new DatePipe("es-MX");
        item.fechaMovimiento = datepipe.transform(item.fechaMovimiento , 'dd-MMM-y')?.replace(".","");

        item.tipoMovimiento= item.movimiento;
        item.registroPatronal= item.registroDescripcion;
      }
    }

    this.arreglotabla.columnas = columnas;
    this.arreglotabla.filas = this.arreglo;

    this.cargando = false;
  }


  public recibirTabla(obj: any) {
    
    if (obj.type == "desglosar") {
      
      let item = obj.datos;
       
      let columnas: Array<tabla> = [
       new tabla("politica", "Política"),
       new tabla("salariosDiarios", "Salario Diario"),
       //new tabla("salarioIntegrado", "Salario diario integrado"),
       new tabla("salarioCotización", "Salario base de cotización"),
       new tabla("estatusEmpleado", "Estatus de empleado"),
              
     ];
    

     item.politica = item.politicaDescripcion;
     item.salariosDiarios = item.salarioDiario.toFixed(2); 
     item.salarioCotización = item.salarioBaseCotizacion.toFixed(2); 
     item.estatusEmpleado = item.esActivo? "Activo":"Inactivo";

     this.arreglotablaDesglose.columnas = columnas;
     this.arreglotablaDesglose.filas = item;

     item.cargandoDetalle = false;
     
    }


  }

  public filtrar(){
    
    
    if(this.tipoMovimineto !== '0'){

    let peticionid = {
      fechaContrato: this.empleado.fechaContrato,
      movimientoImssId: this.tipoMovimineto,
      personaId: {
          personaId: this.idEmpleado
      },
      centrocClienteId: {
          centrocClienteId: this.usuariosSistemaPrd.getIdEmpresa()
      }
    }
    
      this.cargando = true;
    
      this.kardexPrd.getListaPorIdMovimiento(peticionid).subscribe(datos => {
          this.crearTabla(datos);
      });
    }else{
      this.kardexPrd.getListaMovimientos(this.peticion).subscribe(datos => {
        this.crearTabla(datos);
    });
    }

  }



}
