import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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





  public id_empresa: number = 0;
  public arreglo: any = [];
  /*public arreglo: any = [

    {
      clabe: "999999999999999999",
      csBanco: { bancoId: 13, codBanco: "044", nombreCorto: "SCOTIABANK", razonSocial: "Scotiabank Inverlat, S.A.", fechaInicio: "01/01/2017" },
      esActivo: true,
      basePeriodoId: "30D",
      centrocClienteId: 1,
      emClaveDelegacionalImss: 0,
      fechaAlta: "26/01/2021",
      nombre: "ASG-Modificar",
      razonSocial: "ASG",
      rfc: "MAVS970126HOZ",
      nombreCuenta: "Prueba",
      numeroCuenta: "9999999999"
    }

  ];*/

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }


  constructor(private routerPrd: Router, private activateRouter: ActivatedRoute,
    private cuentasPrd: CuentasbancariasService) { }

  ngOnInit(): void {

    debugger;
    this.activateRouter.params.subscribe(datos => {

      this.id_empresa = datos["id"];


      this.cargando = true;

      this.cuentasPrd.getCuentaBancariaByEmpresa(this.id_empresa).subscribe(peticion => {
        this.cargando = false;
        this.arreglo = peticion.datos;
        console.log(this.arreglo);
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
}
