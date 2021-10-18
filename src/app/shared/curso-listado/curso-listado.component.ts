import { Component, Input, OnInit } from '@angular/core';
import { Noticia } from 'src/app/core/modelos/noticia';

@Component({
  selector: 'app-curso-listado',
  templateUrl: './curso-listado.component.html',
  styleUrls: ['./curso-listado.component.scss']
})
export class CursoListadoComponent implements OnInit {

  @Input() public noticias: Noticia[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
