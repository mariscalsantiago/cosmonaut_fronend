import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { CuentasbancariasService } from '../../services/cuentasbancarias.service';

@Component({
  selector: 'app-listascuentasbancarias',
  templateUrl: './listascuentasbancarias.component.html',
  styleUrls: ['./listascuentasbancarias.component.scss']
})
export class ListascuentasbancariasComponent implements OnInit {

  public tamanio: number = 0;
  public cargando: boolean = false;
  public changeIconDown: boolean = false;



  public arreglotabla: any = {
    columnas: [],
    filas: []
  };


  public arreglotablaDesglose: any = {
    columnas: [],
    filas: []
  };

  public id_empresa: number = 0;
  public arreglo: any = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  public esRegistrar:boolean = false;
  public esConsultar:boolean = false;
  public esEditar:boolean = false;
  public esEliminar:boolean = false;

  //Filtros de busqueda
  public clabe: string = '';
  public numeroCuenta: string = '';
  public banco: string = '';


  constructor(private routerPrd: Router, private activateRouter: ActivatedRoute,
    private cuentasPrd: CuentasbancariasService,private configuracionesPrd:ConfiguracionesService) { }

  ngOnInit(): void {


    this.establecerPermisos();

    
    this.activateRouter.params.subscribe(datos => {

      this.id_empresa = datos["id"];


      this.cargando = true;

      this.cuentasPrd.getCuentaBancariaByEmpresa(this.id_empresa).subscribe(datos => {
        let columnas: Array<tabla> = [
          new tabla("nombreCuenta", "Nombre cuenta"),
          new tabla("numeroCuenta", "Número de cuenta"),
          new tabla("nombrebanco", "Nombre banco"),
          new tabla("clabe", "Cuenta CLABE"),
          new tabla("activo", "Estatus de cuenta")
        ];

        

        if(datos.datos !== undefined){
          datos.datos.forEach((part:any) => {
            part.nombrebanco=part.bancoId?.nombreCorto;

            if(part.esActivo){
              part.activo = 'Activo'
             }
             if(!part.esActivo){
              part.activo = 'Inactivo'
             }
          });
        }
      

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

  apagando(indice:number){
    
    for(let x = 0;x < this.arreglo.length; x++){
      if(x == indice)
            continue;

      this.arreglo[x].seleccionado = false;
    }


    this.arreglo[indice].seleccionado = !this.arreglo[indice].seleccionado;
  
  }

  public verdetalle(obj: any) {

    if(obj == undefined){
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'cuentasbancarias', 'nuevo']);
    }else{
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'cuentasbancarias', 'editar'],{ state: { data: obj}});
    }



  }


  public obj: any;
 

  

  public recibirTabla(obj:any){
    switch(obj.type){

      case "editar":
        this.verdetalle(obj.datos);
        break;
      case "eliminar":
          //eliminar método
          break;
      case "desglosar":
            let item = obj.datos;

            this.cuentasPrd.getCuentaBancariaByEmpresa(this.id_empresa).subscribe(datos => {
              let temp = datos.datos;
              
              if (temp != undefined) {
    
                for (let llave in temp) {
                  item[llave] = temp[llave];
                }
    
              }
    
    
              let columnas: Array<tabla> = [
                new tabla("descripcion", "Descripcion"),
                new tabla("funcionCuenta", "Función de la cuenta "),
                new tabla("numInformacion", "Número de información"),
                new tabla("numSucursal", "Número de sucursal")
              ];
              
              item.funcionCuenta = item.funcionCuentaId?.descripcion;
    
    
              this.arreglotablaDesglose.columnas = columnas;
              this.arreglotablaDesglose.filas = item;
    
              item.cargandoDetalle = false;
    
            });
    
            break;

    }
  }
}
