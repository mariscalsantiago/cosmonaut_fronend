import { CurrencyPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[formatos]'
})
export class FormatosDirective implements OnInit {
  public suscrita!: Subscription;
  public desactivarSuscribir: boolean = false;

  @Input() public moneda: boolean = false;
  @Input() public minusculas: boolean = false;
  @Input() public mayusculas: boolean = false;
  @Input() public especial: boolean = false;
  @Input() public alfanumericos: boolean = false;
  @Input() public letras: boolean = false;
  @Input() public numeros: boolean = false;
  @Input() public titlecase: boolean = false;
  @Input() public nochar: boolean = false;
  @Input() public curp: boolean = false;
  @Input() public rfc: boolean = false;
  @Input() public minimo: boolean = false;
  @Input() public control!: AbstractControl;
  @Input() public numerosDecimales:boolean = false;

  @Input() public correo: boolean = false;

  @HostListener("input", ["$event"])
  onInput(event: KeyboardEvent) {
    console.log("onInput");
    if (this.letras) {
      if (this.minusculas)
        this.el.nativeElement.value = `${this.el.nativeElement.value}`.toLowerCase();
      else if (this.mayusculas)
        this.el.nativeElement.value = `${this.el.nativeElement.value}`.toUpperCase();
      this.onFocusout(undefined);
    } else if (this.especial) {
      this.onFocusout(undefined);
    } else if (this.correo) {
      this.el.nativeElement.value = `${this.el.nativeElement.value}`.toLowerCase();
      this.onFocusout(undefined);
    } else if (this.nochar) {
      if (this.curp || this.rfc) {
        this.el.nativeElement.value = `${this.el.nativeElement.value}`.toUpperCase();
        this.onFocusout(undefined);
      }
    }
  }

  @HostListener("focus", ["$event"])
  public enter() {
    if (this.moneda) {
      this.el.nativeElement.value = this.el.nativeElement.value.replace("$", "").replaceAll(",", "");
    }
  }

  @HostListener("keydown", ["$event"])
  onkeyDown(event: KeyboardEvent) {
    this.desactivarSuscribir = true;
    if (this.numerosDecimales) {
      debugger;
      const regex = /[\d.\/]/g;


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
    }
    else if (this.moneda) {
      debugger;
      const regex = /[\d.\/]/g;


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
    } else if (this.letras || this.especial) {

      let expresionRegular = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]+$/i;
      const regex = new RegExp(expresionRegular);
      if (!regex.test(event.key)) {
        event.preventDefault();
      }

    } else if (this.nochar) {

      let expresionRegular = /^[A-Za-z0-9]+$/g;
      const regex = new RegExp(expresionRegular);
      if (!regex.test(event.key)) {
        event.preventDefault();
      }

    }
  }



  @HostListener("focusout", ["$event"])
  onFocusout(event: any) {
    this.desactivarSuscribir = false;
    if (this.moneda) {

      this.el.nativeElement.value = this.formatoMoneda(this.el.nativeElement.value);
      return;
    } else if (this.letras) {
      if (this.minusculas) {
        this.el.nativeElement.value = `${this.el.nativeElement.value}`.toLowerCase();
      } else if (this.mayusculas) {
        this.el.nativeElement.value = `${this.el.nativeElement.value}`.toUpperCase();
      }
    } else if (this.especial) {
      const valorCampo: string = this.el.nativeElement.value;
      const valorDividido: string[] = valorCampo.split(' ');
      const regex = /^(la|el|los|de|del|al|la)$/g;

      let cadena: string = '';

      valorDividido.forEach((dato, i) => {
        const es = (i === (valorDividido.length - 1) ? '' : ' ');
        if (regex.test(dato)) {
          cadena += dato + es;
        } else {
          cadena += dato.substring(0, 1).toUpperCase() +
            dato.substring(1, dato.length).toLowerCase() + es;
        }

      });
      this.render.setProperty(this.el.nativeElement, 'value', cadena);
    } else if (this.correo) {
      this.el.nativeElement.value = `${this.el.nativeElement.value}`.toLowerCase();
    }


    if (this.control)
      this.control.setValue(this.el.nativeElement.value);
  }
  @HostListener("change", ["$event"])
  onChange(event: KeyboardEvent) {
    console.log("Si cambia");
  }


  constructor(private el: ElementRef, private cp: CurrencyPipe, private render: Renderer2) {



  }




  ngOnInit(): void {
    console.log("Directiva");

    if (this.moneda) {
      this.el.nativeElement.value = this.formatoMoneda(this.el.nativeElement.value);
      if (this.control) {
        this.suscrita = this.control.valueChanges.subscribe(valor => {
          if (!this.desactivarSuscribir) {
            this.el.nativeElement.value = this.formatoMoneda(`${valor}`);
          }
        });
      }
    }

  }



  ngOnDestroy() {
    if (this.moneda && this.control) {
      this.suscrita.unsubscribe();
    }
  }
  private formatoMoneda(moneda: string) {
    let dandoFormato = Number(moneda.replace("$", "").replace(",", ""));
    return this.moneda ? this.cp.transform(dandoFormato) : moneda;
  }

}
