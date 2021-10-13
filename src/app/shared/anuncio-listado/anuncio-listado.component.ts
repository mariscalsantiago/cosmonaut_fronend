import { Component, Input, OnInit } from '@angular/core';
import { AnuncioListado } from "../../core/modelos/anuncio-listado";


@Component({
  selector: 'app-anuncio-listado',
  templateUrl: './anuncio-listado.component.html',
  styleUrls: ['./anuncio-listado.component.scss']
})
export class AnuncioListadoComponent implements OnInit {


  @Input() public anuncios: AnuncioListado[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}