import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { format } from 'path';
import { Noticia } from 'src/app/core/modelos/noticia';

@Component({
  selector: 'app-curso-listado',
  templateUrl: './curso-listado.component.html',
  styleUrls: ['./curso-listado.component.scss']
})
export class CursoListadoComponent implements OnInit {

  @Input() public noticias: Noticia[] = [];
  @Output() onClick = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  tieneContenido(noticia: Noticia): boolean {
    return !!noticia.contenido;
  }

  public redireccion(id:  any) {
    for(let item of this.noticias){
      if(item.noticiaId === id){
        let url = item.contenido;
        window.open(url, "_blank");

      } 
    }

  }

  onClicked(noticia: Noticia) {
    this.onClick.emit(noticia);
  }

}
