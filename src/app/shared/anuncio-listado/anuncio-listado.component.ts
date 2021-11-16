import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Noticia } from 'src/app/core/modelos/noticia';


@Component({
  selector: 'app-anuncio-listado',
  templateUrl: './anuncio-listado.component.html',
  styleUrls: ['./anuncio-listado.component.scss']
})
export class AnuncioListadoComponent implements OnInit {

  @Input() public noticias: Noticia[] = [];
  @Output() onClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  tieneContenido(noticia: Noticia): boolean {
    return !!noticia.contenido;
  }

  onClicked(noticia: Noticia) {
    this.onClick.emit(noticia);
  }
}