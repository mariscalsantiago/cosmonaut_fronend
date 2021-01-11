import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './pages/usuarios.component';
import { usuariosRoutingModule } from './usuarios-routing.module';
import { ShareModule } from 'src/app/shared/share.module';



@NgModule({
  declarations: [UsuariosComponent],
  imports: [
    CommonModule,
    usuariosRoutingModule,
    ShareModule
  ]
})
export class UsuariosModule { }
