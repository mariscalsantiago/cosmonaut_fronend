import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Noticia } from 'src/app/core/modelos/noticia';
import { GeneralSinGrupos } from 'src/app/core/modelos/generalSinGrupo';

@Component({
  selector: 'app-anuncio-listado',
  templateUrl: './anuncio-listado.component.html',
  styleUrls: ['./anuncio-listado.component.scss']
})

export class AnuncioListadoComponent implements OnInit {

  @Input() public noticias: GeneralSinGrupos[] = [];
  @Output() onClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  tieneContenido(noticias: GeneralSinGrupos): boolean {
    

    return !!noticias.noticiaId;
  }

  onClicked(noticia: Noticia) {
    this.onClick.emit(noticia);
  }
}