import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAlfanumerico]'
})
export class AlfanumericoDirective {

  @Input() appAlfanumerico:string = "false";

  constructor(private el: ElementRef) { }

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    if (event.code != 'Backspace' && event.code  !== 'Tab')
      if (!((event.key >= 'A' && event.key <= 'Z') || (event.key >= 'a' && event.key <= 'z'))) {
        if(this.appAlfanumerico == 'true'){
            if(!(event.key >= '0' && event.key <= '9')){
              event.preventDefault();
            }
        }else{
          event.preventDefault();
        }
      }else{
        console.log("confinua alfanumerico")
      }
  }

}
