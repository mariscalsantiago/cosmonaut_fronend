import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-informacionbasica',
  templateUrl: './informacionbasica.component.html',
  styleUrls: ['./informacionbasica.component.scss']
})
export class InformacionbasicaComponent implements OnInit {

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
