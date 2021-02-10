import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-empleado',
  templateUrl: './form-empleado.component.html',
  styleUrls: ['./form-empleado.component.scss']
})
export class FormEmpleadoComponent implements OnInit {

  public activado = [{ tab: true, form: true, disabled: false }, { tab: false, form: false, disabled: false }, { tab: false, form: false, disabled: false },
  { tab: false, form: false, disabled: false }, { tab: false, form: false, disabled: false }, { tab: false, form: false, disabled: false }];

  constructor() { }

  ngOnInit(): void {
  }


  public recibir(elemento: any) {
    console.log(elemento);

    switch (elemento.type) {
      case "informacion":

        this.activado[1].tab = true;
        this.activado[1].form = true;
        this.activado[1].disabled = false;
        this.activado[0].form = false;
        break;
      case "domicilio":

        this.activado[2].tab = true;
        this.activado[2].form = true;
        this.activado[2].disabled = false;
        this.activado[1].form = false;
        break;
      case "preferencias":

        this.activado[3].tab = true;
        this.activado[3].form = true;
        this.activado[3].disabled = false;
        this.activado[2].form = false;
        break;
      case "empleo":

        this.activado[4].tab = true;
        this.activado[4].form = true;
        this.activado[4].disabled = false;
        this.activado[3].form = false;
        break;
      case "detalle":

        this.activado[5].tab = true;
        this.activado[5].form = true;
        this.activado[5].disabled = false;
        this.activado[4].form = false;
        break;
    }

  }

}
