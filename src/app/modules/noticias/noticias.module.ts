import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { ShareModule } from 'src/app/shared/share.module';
import { NoticiasRoutingModule } from './noticias-routing.module';
import { NoticiasDetalleComponent } from './pages/noticias-detalle/noticias-detalle.component';
import { NoticiasComponent } from './pages/noticias/noticias.component';
import { NoticiasService } from './services/noticias.service';

@NgModule({
  declarations: [NoticiasComponent, NoticiasDetalleComponent],
  imports: [
    CommonModule,
    NoticiasRoutingModule,
    ShareModule,
    FormsModule, ReactiveFormsModule,
    CoreModule
  ],
  providers: [
    NoticiasService
  ]
})
export class UsuariosModule { }
