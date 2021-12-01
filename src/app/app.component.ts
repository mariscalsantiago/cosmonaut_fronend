import { AfterContentInit, Component, ElementRef, OnInit } from '@angular/core';
import { ConfiguracionesService } from './shared/services/configuraciones/configuraciones.service';
import { EstilosService, estructura } from './shared/services/configuraciones/estilos.service';
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
    private configuracionesPrd:ConfiguracionesService,private estilosPrd:EstilosService){
    
  }

  ngOnInit(){

  }


  ngAfterContentInit():void{
    this.configuracionesPrd.cambiarColor.subscribe(valor =>{
      switch(valor.type){
        case "vistaPrevia":
             this.cambiarColor(valor.datos.colormenu,valor.datos.colorfondo);
          break;
        case 'defecto':
          this.cambiarColor('','');
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

  private cambiarColor(colormenu:string,colorfondo:string):void{
    
    for(let item of Object.values(document.styleSheets)){
      let stylesheet:any = item;
      for(let i = 0; i < stylesheet.cssRules.length; i++) {

        let menu:Array<estructura> = this.estilosPrd.getMenu();
        for(let regla of menu){
          if(stylesheet.cssRules[i].selectorText?.includes(regla.etiqueta)) {
            for(let selector of regla.selector){
              stylesheet.cssRules[i].style.removeProperty(selector,"background-color");
              stylesheet.cssRules[i].style.setProperty(selector,regla.contraste?"white":colormenu);
            }
          }
        }
        let fondo:Array<estructura> = this.estilosPrd.getFondo();
        for(let regla of fondo){
          if(stylesheet.cssRules[i].selectorText?.includes(regla.etiqueta)) {
            for(let selector of regla.selector){
              stylesheet.cssRules[i].style.setProperty(selector,regla.contraste?"white":colorfondo);
            }
          }
        }
      }
    } 
  }
}
