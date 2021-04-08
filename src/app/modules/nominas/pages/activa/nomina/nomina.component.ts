import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nomina',
  templateUrl: './nomina.component.html',
  styleUrls: ['./nomina.component.scss']
})
export class NominaComponent implements OnInit {
  public activado = [
    { tab: true, form: true, disabled: false,seleccionado:true },
    { tab: false, form: false, disabled: false ,seleccionado:false},
    { tab: false, form: false, disabled: false ,seleccionado:false},
    { tab: false, form: false, disabled: false,seleccionado:false },
    { tab: false, form: false, disabled: false ,seleccionado:false}];

    public arreglo:any = new Array(1000);
  constructor() { }

  ngOnInit(): void {
  }


  public backTab(numero:number){

  }

}
