import { Component, OnInit ,Output,EventEmitter} from '@angular/core';

@Component({
  selector: 'app-ventana-registro-faltas',
  templateUrl: './ventana-registro-faltas.component.html',
  styleUrls: ['./ventana-registro-faltas.component.scss']
})
export class VentanaRegistroFaltasComponent implements OnInit {
  @Output() salida = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }


  public cancelar(){
    this.salida.emit({type:"cancelar"});
  }
}
