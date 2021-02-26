import { Directive, ElementRef, HostListener, Input, EventEmitter, Output } from '@angular/core';


@Directive({
  selector: '[appMayusculas]'
})
export class MayusculasDirective {

  @Input() minusculas:boolean = false;

  constructor(private el: ElementRef) { }

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    //this.el.nativeElement.value = (!this.minusculas)? `${this.el.nativeElement.value}`.toString().toLocaleUpperCase():`${this.el.nativeElement.value}`.toString().toLocaleLowerCase();
  }


  @HostListener('focusout', ['$event.target'])
    onFocusout(target: any) {
      
      //this.el.nativeElement.value = "ALEJANDRO";


    }

  
}
