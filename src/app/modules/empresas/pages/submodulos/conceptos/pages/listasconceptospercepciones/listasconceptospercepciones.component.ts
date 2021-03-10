import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
import { ConceptosService } from '../../services/conceptos.service';

@Component({
  selector: 'app-listasconceptospercepciones',
  templateUrl: './listasconceptospercepciones.component.html',
  styleUrls: ['./listasconceptospercepciones.component.scss']
})
export class ListasconceptospercepcionesComponent implements OnInit {

  public tamanio: number = 0;
  public cargando: boolean = false;
  public changeIconDown: boolean = false;



  public arreglotablaPer: any = {
    columnas: [],
    filas: []
  };

  public arreglotablaDed: any = {
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


  constructor(private routerPrd: Router, private activateRouter: ActivatedRoute,
    private cuentasPrd: ConceptosService) { }

  ngOnInit(): void {

    
    this.activateRouter.params.subscribe(datos => {

      this.id_empresa = datos["id"];


      this.cargando = true;

      this.cuentasPrd.getCuentaBancariaByEmpresa(this.id_empresa).subscribe(datos => {
        let columnas: Array<tabla> = [
          new tabla("nombreCuenta", "Nombre de percepción"),
          new tabla("numeroCuenta", "Tipo de concepto"),
          new tabla("nombrebanco", "Descripción SAT"),
          new tabla("clabe", "Cuenta contable")
        ];

        console.log("datos de cuentas",datos);

  

        this.arreglotablaPer.columnas = columnas;
        this.arreglotablaPer.filas = datos.datos;
        this.cargando = false;
        
      });

      this.cuentasPrd.getCuentaBancariaByEmpresa(this.id_empresa).subscribe(datos => {
        let columnas: Array<tabla> = [
          new tabla("nombreCuenta", "Nombre de la deducción"),
          new tabla("nombrebanco", "Descripción SAT"),
          new tabla("clabe", "Cuenta contable")
        ];

        console.log("datos de cuentas",datos);

  

        this.arreglotablaDed.columnas = columnas;
        this.arreglotablaDed.filas = datos.datos;
        this.cargando = false;
        
      });


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

    }
  }
}
