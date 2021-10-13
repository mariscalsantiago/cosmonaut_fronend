import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { NoticiasDetalleComponent } from './pages/noticias-detalle/noticias-detalle.component';

export const routes: Routes = [

  {
    path: '',
    children: [
      {
        path: '',
        component: NoticiasComponent
      },
      {
        path: 'usuarios',
        component: NoticiasComponent
      },
      {
        path: 'detalle_noticia',
        component: NoticiasDetalleComponent
      },
      {
        path: 'usuarios/detalle_noticia',
        component: NoticiasDetalleComponent
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticiasRoutingModule { }