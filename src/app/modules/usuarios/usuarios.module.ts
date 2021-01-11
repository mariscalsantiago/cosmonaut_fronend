import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { usuariosRoutingModule } from './usuarios-routing.module';
import { ShareModule } from 'src/app/shared/share.module';
import { DetalleUsuarioComponent } from './pages/detalle-usuario/detalle-usuario.component';



@NgModule({
  declarations: [DetalleUsuarioComponent, DetalleUsuarioComponent],
  imports: [
    CommonModule,
    usuariosRoutingModule,
    ShareModule
  ]
})
export class UsuariosModule { }
