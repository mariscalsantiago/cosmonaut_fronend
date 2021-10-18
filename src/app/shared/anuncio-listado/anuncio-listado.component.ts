import { Component, Input, OnInit } from '@angular/core';
import { Noticia } from 'src/app/core/modelos/noticia';


@Component({
  selector: 'app-anuncio-listado',
  templateUrl: './anuncio-listado.component.html',
  styleUrls: ['./anuncio-listado.component.scss']
})
export class AnuncioListadoComponent implements OnInit {


  @Input() public noticias: Noticia[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}