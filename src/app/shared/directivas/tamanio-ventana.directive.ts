import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appTamanioVentana]'
})
export class TamanioVentanaDirective implements OnChanges {

  public tamanio:number = 0;

  @Input() public pixeles:number = 240;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth;
    this.tamanio = event.target.innerHeight;
    this.elemento.nativeElement.style.height = `${this.tamanio - this.pixeles}px`;
    console.log(this.elemento.nativeElement.style.height);

  }

  constructor(private elemento:ElementRef) {
    let documento: any = document.defaultView;
    this.tamanio = documento.innerHeight;
    this.elemento.nativeElement.style.height = `${this.tamanio - this.pixeles}px`;
    console.log("inicia con",this.pixeles);
   
    
   }


   ngOnChanges(changes: SimpleChanges): void{
    let documento: any = document.defaultView;
    this.tamanio = documento.innerHeight;
    this.elemento.nativeElement.style.height = `${this.tamanio - this.pixeles}px`;
   }



}
