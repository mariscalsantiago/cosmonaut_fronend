import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';



@Directive({
  selector: '[appMayusculas]'
})
export class MayusculasDirective {

  @Input() minusculas:boolean = false;

  constructor(private el: ElementRef, private render : Renderer2) { }

  @HostListener("input", ["$event"])
  onKeyDown(event: KeyboardEvent) {
   
  }


  @HostListener('focusout', ['$event.target'])
    onFocusout(target: any) {
      const valorCampo:string = this.el.nativeElement.value;
      const valorDividido:string[] = valorCampo.split(' ');
      const regex = /^(la|el|los|de|del|al|la)$/g;
  
      let cadena:string = '';
  
      valorDividido.forEach((dato, i) => {
        const es =  (i === (valorDividido.length - 1) ? '' : ' ');
        if (regex.test(dato)) { 
          cadena += dato + es;
        } else {
          cadena += dato.substring(0,1).toUpperCase() +
           dato.substring(1,dato.length).toLowerCase() +  es;
        }
        console.log(cadena);
      });
      this.render.setProperty(this.el.nativeElement, 'value', cadena);
    }
    
}
