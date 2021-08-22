import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAlfanumerico]'
})
export class AlfanumericoDirective {

  @Input() appAlfanumerico:string = "false";

  constructor(private el: ElementRef) { }

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    let expresionRegular = /^[a-zA-Z0-9]+$/i;
    const regex = new RegExp(expresionRegular);
    if(!regex.test(event.key)){
        event.preventDefault();
    }
      
  }

}
