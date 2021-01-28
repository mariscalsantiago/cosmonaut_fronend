import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GruponominasService } from '../../services/gruponominas.service';

@Component({
  selector: 'app-listagruposnominas',
  templateUrl: './listagruposnominas.component.html',
  styleUrls: ['./listagruposnominas.component.scss']
})
export class ListagruposnominasComponent implements OnInit {


  public tamanio:number = 0;
  public changeIconDown:boolean = false;
  public nombre:string = "";
  public cargando:boolean = false;
  public id_empresa:number = 0;

  public arreglo  = [

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
      nombreCuenta: "joel",
      numeroCuenta: "9999999999",
      seleccionado:false
    },
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
      nombreCuenta: "heidi",
      numeroCuenta: "9999999999",
      seleccionado:false
    },
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
      nombreCuenta: "areli",
      numeroCuenta: "9999999999",
      seleccionado:false
    }

  ];
  

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerWidth;
  }

  constructor(private gruposnominaPrd:GruponominasService,private routerPrd:Router,
    private routerActive:ActivatedRoute) { }

  ngOnInit(): void {

    let documento:any = document.defaultView;

    this.tamanio = documento.innerWidth;

    this.routerActive.params.subscribe(datos =>{
      this.id_empresa = datos["id"];
    });

  }

  public filtrar(){

  }


  public eliminar(obj:any){

  }

  public verdetalle(obj:any ){


    if(obj == undefined){
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'gruposnomina', 'nuevo']);
    }else{
      this.routerPrd.navigate(['empresa/detalle', this.id_empresa, 'gruposnomina', 'editar'],{ state: { data: obj}});
    }

  }

  apagando(indice:number){
    
    for(let x = 0;x < this.arreglo.length; x++){
      if(x == indice)
            continue;

      this.arreglo[x].seleccionado = false;
    }


    this.arreglo[indice].seleccionado = !this.arreglo[indice].seleccionado;
  
  }

}
