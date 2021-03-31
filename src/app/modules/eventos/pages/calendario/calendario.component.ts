import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendarioevento',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  public apareceListadoEventos:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
