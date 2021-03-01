import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
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



  public strTitulo: string = "";
  public modal: boolean = false;
  public iconType: string = "";
  public arreglotabla: any = {
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
    private cuentasPrd: CuentasbancariasService) { }

  ngOnInit(): void {

    
    this.activateRouter.params.subscribe(datos => {

      this.id_empresa = datos["id"];


      this.cargando = true;

      this.cuentasPrd.getCuentaBancariaByEmpresa(this.id_empresa).subscribe(datos => {
        let columnas: Array<tabla> = [
          new tabla("nombreCuenta", "Nombre cuenta"),
          new tabla("numeroCuenta", "Número de cuenta"),
          new tabla("nombrebanco", "Nombre banco"),
          new tabla("clabe", "Cuenta CLABE"),
          new tabla("esActivo", "Estatus")
        ];

        console.log("datos de cuentas",datos);

        if(datos.datos !== undefined){
          datos.datos.forEach((part:any) => {
            part.nombrebanco=part.bancoId?.nombreCorto;
          });
        }
      

        this.arreglotabla.columnas = columnas;
        this.arreglotabla.filas = datos.datos;
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
  public eliminar(obj: any) {


    this.strTitulo = "¿Deseas eliminar la cuenta bancaria?";
    this.iconType = "warning";
    this.modal = true;

    this.obj = obj;

  }

  public recibir($event: any) {

    this.modal = false;


    let objenviar = {
      clabe:this.obj.clabe
    }

    console.log(objenviar);

   

    if (this.iconType == "warning") {
      if ($event) {
        this.cuentasPrd.eliminar(objenviar).subscribe(datos => {
          this.strTitulo = datos.mensaje;
          this.iconType = datos.resultado ? "success" : "error";
          this.modal = true;
        });
      }
    }
  }

  public recibirTabla(obj:any){
    switch(obj.type){

      case "editar":
        this.verdetalle(obj.datos);
        break;
        case "eliminar":
          this.eliminar(obj.datos);
          break;

    }
  }
}
