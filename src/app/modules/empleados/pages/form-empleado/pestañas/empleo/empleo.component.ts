import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-empleo',
  templateUrl: './empleo.component.html',
  styleUrls: ['./empleo.component.scss']
})
export class EmpleoComponent implements OnInit {
  public arreglopintar: any = [false];

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


  public cancelar(){
    
  }
}
