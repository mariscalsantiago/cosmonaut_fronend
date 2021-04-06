import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSolonumeros]'
})
export class SolonumerosDirective {

  constructor(private el: ElementRef) { }

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    if (event.code != 'Backspace' && event.code  !== 'Tab')
      if (Number.isNaN(Number(event.key))) {
        event.preventDefault();
      }
  }

  // @HostListener("paste", ["$event"])
  // onPaste(event: ClipboardEvent) {
  //   this.run(this.el.nativeElement.value);
  // }


}
