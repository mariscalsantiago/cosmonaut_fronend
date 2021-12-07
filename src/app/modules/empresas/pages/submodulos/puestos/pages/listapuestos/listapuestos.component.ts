import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { PuestosService } from '../services/puestos.service';

@Component({
  selector: 'app-listapuestos',
  templateUrl: './listapuestos.component.html',
  styleUrls: ['./listapuestos.component.scss']
})
export class ListapuestosComponent implements OnInit {

  
  public insertar: boolean = false;
  public tamanio: number = 0;
  public cargando: Boolean = false;
  public id_empresa: number = 0;
  public id_area: number = 0;
  public changeIconDown: boolean = false;
  public objEnviar: any;

  public aparecemodalito: boolean = false;
  public scrolly: string = '5%';
  public modalWidth: string = "55%";
  public cargandodetallearea: boolean = false;
  public nombreCorto: string = "";
  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  public arreglo: any = [];
  public arreglodetalle: any = [];


  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;





  constructor(private routerPrd: Router, private puestosProd: PuestosService, private CanRouterPrd: ActivatedRoute,
    private modalPrd:ModalService,private configuracionesPrd:ConfiguracionesService) { }

  ngOnInit(): void {

    this.establecerPermisos();

    let documento: any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.cargando = true;

    this.CanRouterPrd.params.subscribe(datos => {

      this.id_empresa = datos["id"]
      this.puestosProd.getAllArea(this.id_empresa).subscribe(datos => {

        let columnas: Array<tabla> = [
          new tabla("nombreCorto", "Nombre del área"),
          new tabla("nombre", "Empresa"),
          new tabla("count", "Número de empleados",true,true,true)
        ];

        this.arreglotabla.columnas = columnas;
        this.arreglotabla.filas = datos.datos;
        


        this.cargando = false;
      });

    });

  }




 public establecerPermisos(){
  this.esRegistrar = this.configuracionesPrd.getPermisos("Registrar");
  this.esConsultar = this.configuracionesPrd.getPermisos("Consultar");
  this.esEditar = this.configuracionesPrd.getPermisos("Editar");
  this.esEliminar = this.configuracionesPrd.getPermisos("Eliminar");
}


  public verdetalle(obj: any) {

    this.cargando = true;
    let tipoinsert = (obj == undefined) ? 'nuevo' : 'modifica';
    this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'area', tipoinsert], { state: { datos: obj } });
    this.cargando = false;
  }

  public eliminar(obj: any) {

    
    this.objEnviar = {
      areaId: obj.areaId,
      descripcion: obj.descripcion,
      nombreCorto: obj.nombreCorto,
      fechaAlta: obj.fechaAlta,
      esActivo: obj.esActivo,
      centrocClienteId: obj.nclCentrocCliente.centrocClienteId
    }

    
    const titulo = "¿Deseas eliminar el área?";
    
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{

      if(valor){


        this.puestosProd.eliminar(this.objEnviar).subscribe(datos => {
         
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
          if (datos.resultado) {
            this.ngOnInit();
          }

        });
      }

      });

  }

  public traerModal(obj: any) {


    let elemento: any = document.getElementById("vetanaprincipaltabla")
    this.aparecemodalito = true;



    if (elemento.getBoundingClientRect().y < -40) {
      let numero = elemento.getBoundingClientRect().y;
      numero = Math.abs(numero);

      this.scrolly = numero + 100 + "px";


    } else {

      this.scrolly = "5%";
    }



    if (this.tamanio < 600) {

      this.modalWidth = "90%";

    } else {
      this.modalWidth = "55%";

    }


    let areapuestoitem = obj;

    this.cargandodetallearea = true;
    this.puestosProd.getdetalleArea(this.id_empresa, areapuestoitem.areaId).subscribe(datos => {

      this.cargandodetallearea = false;


      this.arreglodetalle = datos.datos == undefined ? [] : datos.datos;
      if (this.arreglodetalle !== undefined){
        for (let item of this.arreglodetalle){
          item.nombrecompleto = `${item.nombre == undefined ? '':item.nombre} ${item.apellidoPat == undefined ? '':item.apellidoPat} ${item.apellidoMat == undefined ? '':item.apellidoMat}`;
          
        }
      }
    });

  }

  public filtrar() {


    this.cargando = true;
    
    let peticion = 

      { 
        nombreCorto: this.nombreCorto,
        nclCentrocCliente:{ centrocClienteId: this.id_empresa}
      }

    this.puestosProd.filtrar(peticion).subscribe(datos => {
      let columnas: Array<tabla> = [
        new tabla("nombreCorto", "Nombre"),
        new tabla("nombre", "Empresa"),
        new tabla("count", "Número de empleados")
      ];

      this.arreglotabla.columnas = columnas;
      this.arreglotabla.filas = datos.datos;


      this.cargando = false;
    });
  }



  public recibirTabla(obj: any) {
    switch (obj.type) {

      case "editar":
        this.verdetalle(obj.datos);
        break;
      case "columna":
          this.traerModal(obj.datos);
        break;  
      case "eliminar":
        this.eliminar(obj.datos);
        break;

    }
  }
}



