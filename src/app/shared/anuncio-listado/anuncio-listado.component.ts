import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NoticiaAgrupado } from 'src/app/core/modelos/noticiaAgrupado';


@Component({
  selector: 'app-anuncio-listado',
  templateUrl: './anuncio-listado.component.html',
  styleUrls: ['./anuncio-listado.component.scss']
})

export class AnuncioListadoComponent implements OnInit {

  @Input() public noticias: NoticiaAgrupado[] = [];
  
  @Output() onClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  tieneContenido(noticias: NoticiaAgrupado): boolean {
    
    return !!noticias.noticiaId;
  }

  onClicked(noticia: NoticiaAgrupado) {
    this.onClick.emit(noticia);
  }
}