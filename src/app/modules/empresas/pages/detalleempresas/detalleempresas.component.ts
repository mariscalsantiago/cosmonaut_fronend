import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';





@Component({
  selector: 'app-detalleempresas',
  templateUrl: './detalleempresas.component.html',
  styleUrls: ['./detalleempresas.component.scss']
})




export class DetalleempresasComponent implements OnInit {

  public titulo:string = `CONFIGURACIÓN EMPRESA`;
  public modulo: string = "";
  public subModulo: string = "";

  constructor(public configuracionPrd:ConfiguracionesService, private routerPrd: Router) {

    
   }

  ngOnInit(): void {
    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    let mm:any = document.getElementById("navegadorTabs");
    mm.scrollLeft = this.configuracionPrd.getScrollCompany(mm.scrollLeft);
    mm.addEventListener('scroll', ()=> {
      
      mm.scrollLeft = this.configuracionPrd.getScrollCompany(mm.scrollLeft);
    })





  }

  public getConfiguracion(){
   
    
  }

  public cancelar(){
    this.routerPrd.navigate(['/listaempresas']);  
  }

}
