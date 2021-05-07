import { Component, OnInit } from '@angular/core';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';





@Component({
  selector: 'app-detalleempresas',
  templateUrl: './detalleempresas.component.html',
  styleUrls: ['./detalleempresas.component.scss']
})




export class DetalleempresasComponent implements OnInit {

  public titulo:string = `CONFIGURACIÓN EMPRESA`;

  constructor(private configPrd:ConfiguracionesService) {

    
   }

  ngOnInit(): void {
    let mm:any = document.getElementById("navegadorTabs");
    mm.scrollLeft = this.configPrd.getScrollCompany(mm.scrollLeft);
    mm.addEventListener('scroll', ()=> {
      
      mm.scrollLeft = this.configPrd.getScrollCompany(mm.scrollLeft);
    })
  }

  public getConfiguracion(){
    
    
  }



}
