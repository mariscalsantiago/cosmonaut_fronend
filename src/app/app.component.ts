import { AfterContentInit, Component, ElementRef, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
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

    console.log("ENVIOREMENT DISPONIBLE",environment.mensaje);

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
    

    let coloralterado = this.hexadecimalChangeColor(colormenu,0.8);
    let coloralterado2 = this.hexadecimalChangeColor(colormenu,0.2);
    document.documentElement.style.setProperty('--principal', colormenu);
    document.documentElement.style.setProperty('--fondo', colorfondo);   
    document.documentElement.style.setProperty('--principalhide', coloralterado);   
    document.documentElement.style.setProperty('--principalhide100', coloralterado2);   
    
    
    


    return;
    for(let item of Object.values(document.styleSheets)){
      let stylesheet:any = item;
      for(let i = 0; i < stylesheet.cssRules.length; i++) {

        let menu:Array<estructura> = this.estilosPrd.getMenu();
        for(let regla of menu){
          if(stylesheet.cssRules[i].selectorText?.includes(regla.etiqueta)) {
            for(let selector of regla.selector){
              stylesheet.cssRules[i].style.removeProperty(selector,"background-color");
             // stylesheet.cssRules[i].style.setProperty(selector,regla.contraste?"white":colormenu);
            }
          }
        }
        let fondo:Array<estructura> = this.estilosPrd.getFondo();
        for(let regla of fondo){
          if(stylesheet.cssRules[i].selectorText?.includes(regla.etiqueta)) {
            for(let selector of regla.selector){
              //stylesheet.cssRules[i].style.setProperty(selector,regla.contraste?"white":colorfondo);
            }
          }
        }
      }
    } 
  }

  hexToRGB(hex:string,hide:number) {

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${hide})`;;
  }

 


  private hexadecimalChangeColor(color:string,hide:number):string{
      return this.hexToRGB(color,hide);
  }
}
