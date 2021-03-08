import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTamanioVentana]'
})
export class TamanioVentanaDirective {

  public tamanio:number = 0;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;


    this.tamanio = event.target.innerHeight;
    console.log(this.tamanio);

    this.elemento.nativeElement.style.height = `${this.tamanio - 240}px`;

  }

  constructor(private elemento:ElementRef) { }

}
