import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';

import { UsuarioService } from './services/usuario.service';


import { CommonModule } from '@angular/common';
import { usuariosRoutingModule } from './usuarios-routing.module';
import { ShareModule } from 'src/app/shared/share.module';
import { DetalleUsuarioComponent } from './pages/detalle-usuario/detalle-usuario.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { CoreModule } from 'src/app/core/core.module';





@NgModule({
  declarations: [DetalleUsuarioComponent,UsuariosComponent],
  imports: [
    CommonModule,
    usuariosRoutingModule,
    ShareModule,
    FormsModule,ReactiveFormsModule,
    CoreModule
  ],
  providers: [
    UsuarioService
  ]
})
export class UsuariosModule { }
