import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nomina-historicas',
  templateUrl: './nomina-historicas.component.html',
  styleUrls: ['./nomina-historicas.component.scss']
})
export class NominaHistoricasComponent implements OnInit {
  public activado = [
    { tab: true, form: true, disabled: false, seleccionado: true }];


  public desglosarDown:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }


  public btnDesglosar(){
      this.desglosarDown = !this.desglosarDown;
  }
}
