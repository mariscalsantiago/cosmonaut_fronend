import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {

  public arreglopintar: any = [false, false, false, false, false];

  constructor() { }

  ngOnInit(): void {
  }


  public cambiarStatus(valor: any) {

    for (let x = 0; x < this.arreglopintar.length; x++) {

      if (x == valor) {
        continue;
      }

      this.arreglopintar[x] = false;

    }

    this.arreglopintar[valor] = !this.arreglopintar[valor];


    console.log(this.arreglopintar);
  }








}
