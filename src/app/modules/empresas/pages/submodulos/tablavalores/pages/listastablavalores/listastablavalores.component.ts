import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';


@Component({
  selector: 'app-listastablavalores',
  templateUrl: './listastablavalores.component.html',
  styleUrls: ['./listastablavalores.component.scss']
})
export class ListasTablaValoresComponent implements OnInit {


  public tamanio: number = 0;
  public cargando: boolean = false;
  public changeIconDown: boolean = false;
  public arreglopintar: any = [false, false, false, false];


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


  constructor(private routerPrd: Router, private activateRouter: ActivatedRoute) { }

  ngOnInit(): void {

    
    this.activateRouter.params.subscribe(datos => {

      this.id_empresa = datos["id"];


      this.cargando = true;

      /*this.cuentasPrd.getCuentaBancariaByEmpresa(this.id_empresa).subscribe(datos => {
        let columnas: Array<tabla> = [
          new tabla("nombreCuenta", "Nombre cuenta"),
          new tabla("numeroCuenta", "Número de cuenta"),
          new tabla("nombrebanco", "Nombre banco"),
          new tabla("clabe", "Cuenta CLABE"),
          new tabla("esActivo", "Estatus")
        ];

        

        if(datos.datos !== undefined){
          datos.datos.forEach((part:any) => {
            part.nombrebanco=part.bancoId?.nombreCorto;
          });
        }
      

        this.arreglotabla.columnas = columnas;
        this.arreglotabla.filas = datos.datos;
        this.cargando = false;
        
      });*/


    });

  }

  apagando(indice:number){
    
    for(let x = 0;x < this.arreglo.length; x++){
      if(x == indice)
            continue;

      this.arreglo[x].seleccionado = false;
    }
    

    this.arreglo[indice].seleccionado = !this.arreglo[indice].seleccionado;
  
  }



  public cambiarStatus(valor: any) {

    for (let x = 0; x < this.arreglopintar.length; x++) {

      if (x == valor) {
        continue;
      }

      this.arreglopintar[x] = false;

    }
    this.arreglopintar[valor] = !this.arreglopintar[valor];
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

            /*this.cuentasPrd.getCuentaBancariaByEmpresa(this.id_empresa).subscribe(datos => {
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
    
            });*/
    
            break;

    }
  }
}
