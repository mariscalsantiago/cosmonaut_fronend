import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticiasContenidoComponent } from './pages/noticias-contenido/noticias-contenido.component';
import { NoticiasDetalleComponent } from './pages/noticias-detalle/noticias-detalle.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';

export const routes: Routes = [

  {
    path: '',
    children: [
      {
        path: '',
        component: NoticiasComponent
      },
      {
        path: 'cliente',
        component: NoticiasComponent
      },
      {
        path: 'detalle_noticia/:tipo',
        component: NoticiasDetalleComponent
      },
      {
        path: 'detalle_noticia/cliente/:tipo',
        component: NoticiasDetalleComponent
      },
      {
        path: 'contenido_noticia/:id',
        component: NoticiasContenidoComponent
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticiasRoutingModule { }