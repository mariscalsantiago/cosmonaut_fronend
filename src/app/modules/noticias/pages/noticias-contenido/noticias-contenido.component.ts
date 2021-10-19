import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { Noticia } from './../../../../core/modelos/noticia';

@Component({
  selector: 'app-noticias-contenido',
  templateUrl: './noticias-contenido.component.html',
  styleUrls: ['./noticias-contenido.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NoticiasContenidoComponent implements OnInit {

  titulo = '';
  contenido = '';
  private editando: Noticia | undefined = undefined;

  constructor(
    private router: ActivatedRoute,
    public configuracion: ConfiguracionesService
  ) { }

  ngOnInit(): void {

    this.editando = !!history.state && !!history.state.noticia ? history.state.noticia as Noticia : undefined;

    if (this.editando) {
      this.titulo = this.editando.titulo;
      this.contenido = this.editando.contenido!;
    }

    this.router.params.subscribe(datos => {
      console.log(datos);
    });
  }
}
