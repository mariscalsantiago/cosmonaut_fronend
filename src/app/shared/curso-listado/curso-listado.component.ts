import { CursoListado } from './../../core/modelos/curso-listado';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-curso-listado',
  templateUrl: './curso-listado.component.html',
  styleUrls: ['./curso-listado.component.scss']
})
export class CursoListadoComponent implements OnInit {

  @Input() public cursos: CursoListado[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
