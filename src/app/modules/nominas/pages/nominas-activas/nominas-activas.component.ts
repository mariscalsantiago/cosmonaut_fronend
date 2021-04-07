import { Component, OnInit } from '@angular/core';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';

@Component({
  selector: 'app-nominas-activas',
  templateUrl: './nominas-activas.component.html',
  styleUrls: ['./nominas-activas.component.scss']
})
export class NominasActivasComponent implements OnInit {


  public arreglo:any = [1,2,3,4,5,6,7,8,9,10]

  constructor(private ventana:VentanaemergenteService) { }

  ngOnInit(): void {
  }

  public agregar(){
      this.ventana.showVentana(this.ventana.nuevanomina);
  }

}
