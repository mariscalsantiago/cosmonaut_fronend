import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminListaUsuariosComponent } from './administracionusuarios/pages/admin-lista-usuarios/admin-lista-usuarios.component';
import { AdminDetalleUsuariosComponent } from './administracionusuarios/pages/admin-detalle-usuarios/admin-detalle-usuarios.component';
import { ShareModule } from 'src/app/shared/share.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdministracionusuariosroutingModule } from './administracionusuariosrouting.module';



@NgModule({
  declarations: [AdminListaUsuariosComponent,AdminDetalleUsuariosComponent],
  imports: [
    CommonModule,ShareModule,HttpClientModule,FormsModule,ReactiveFormsModule
  ]
})
export class AdministracionusuariosModule { }
