import { CurrencyPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[formatos]'
})
export class FormatosDirective implements OnInit {
  public suscrita!:Subscription;
  public desactivarSuscribir:boolean = false;

  @Input() public moneda: boolean = false;
  @Input() public minusculas: boolean = false;
  @Input() public mayusculas: boolean = false;
  @Input() public alfanumericos: boolean = false;
  @Input() public letras: boolean = false;
  @Input() public numeros: boolean = false;
  @Input() public control!: AbstractControl;

  @HostListener("input", ["$event"])
  onInput(event: KeyboardEvent) {
       this.el.nativeElement.value = this.el.nativeElement.value.replace("$","").replace(",","");
  }

  @HostListener("keydown", ["$event"])
  onkeyDown(event: KeyboardEvent) {

    
    this.desactivarSuscribir = true;
    if (this.moneda) {
      const regex = /[\d.\/]/g;
      
      console.log(event.key);
      if (!regex.test(event.key) && (event.key !== "Backspace" && event.key !== "Tab" && event.key !== "ArrowLeft" && event.key !== "ArrowRight")) {
        event.preventDefault();
      } else {
        if (event.key == ".") {
          if (this.el.nativeElement.value.split(".").length > 1) {
            event.preventDefault();
          }
        }

        if (event.key === "Backspace" || event.key === "Tab") return;
        if (this.el.nativeElement.value.split(".")[1]?.length > 2) {

          event.preventDefault();
        }
      }
    }else if(this.numeros){
      
      const regex = /[\d.\/]/g;
      
      if (!regex.test(event.key) && (event.key !== "Backspace" && event.key !== "Tab")) {
        event.preventDefault();
      } else {
        if (event.key == ".") {
          if (this.el.nativeElement.value.split(".").length > 1) {
            event.preventDefault();
          }
        }

        if (event.key === "Backspace" || event.key === "Tab") return;
        if (this.el.nativeElement.value.split(".")[1]?.length >= 2) {

          event.preventDefault();
        }
      }
    }
  }



  @HostListener("focusout", ["$event"])
  lostfocu(event: KeyboardEvent) {
    this.desactivarSuscribir = false;
    if (this.moneda) {
      
      this.el.nativeElement.value = this.formatoMoneda(this.el.nativeElement.value);
    }
  }
  @HostListener("change", ["$event"])
  onChange(event: KeyboardEvent) {
    
  }


  constructor(private el: ElementRef, private cp: CurrencyPipe) {



  }




  ngOnInit(): void{
    if(this.control){
      this.suscrita =   this.control.valueChanges.subscribe(valor =>{
          if(!this.desactivarSuscribir){
            this.el.nativeElement.value = this.formatoMoneda(`${valor}`);
          }
        });
    }
  }


  ngOnDestroy(){
    if(this.moneda && this.control){
        this.suscrita.unsubscribe();
    }
  }
  private formatoMoneda(moneda: string) {
    let dandoFormato = Number(moneda.replace("$", "").replace(",", ""));
    return this.moneda ? this.cp.transform(dandoFormato) : moneda;
  }

}
