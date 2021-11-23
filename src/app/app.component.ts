import { AfterContentInit, Component, ElementRef, OnInit } from '@angular/core';
import { ConfiguracionesService } from './shared/services/configuraciones/configuraciones.service';
import { NominaordinariaService } from './shared/services/nominas/nominaordinaria.service';
import { ServerSentEventService } from './shared/services/nominas/server-sent-event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterContentInit {
  title = 'cosmonaut-front';


  constructor(private SSE:ServerSentEventService,private element:ElementRef,
    private configuracionesPrd:ConfiguracionesService){
    
  }

  ngOnInit(){

  }


  ngAfterContentInit():void{
    this.configuracionesPrd.cambiarColor.subscribe(valor =>{
     if(valor.type){
      for(let item of Object.values(document.styleSheets)){
        let stylesheet:any = item;
        for(let i = 0; i < stylesheet.cssRules.length; i++) {
  
          let reglas:any = ["#sidebar ul li a","titulo-outlet","#navegadorTabsEncab"];
  
          for(let regla of reglas){
            if(stylesheet.cssRules[i].selectorText?.includes(regla)) {
              console.log(stylesheet.cssRules[i].selectorText);
              console.log(stylesheet.cssRules[i]);
              stylesheet.cssRules[i].style.setProperty("background-color",valor.color);
              
            }
          }
        }
      }   
    }
    });

  }

  private cambiarColorPersonalizado(){
      this.element.nativeElement.style.setProperty("","red");
  }

  public esconder(){
    let mm:any = document.getElementById("ventanaEmergente");
    mm.style.display = "none"

    this.SSE.verificador.next(true);
    
  }
}
