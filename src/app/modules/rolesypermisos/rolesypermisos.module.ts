import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesypermisosRoutingModule } from './rolesypermisos-routing.module';
import { ListarolesComponent } from './pages/listaroles/listaroles.component';
import { DetalleRolesComponent } from './pages/detalle-roles/detalle-roles.component';
import { ShareModule } from 'src/app/shared/share.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ListarolesComponent, DetalleRolesComponent],
  imports: [
    CommonModule,RolesypermisosRoutingModule,ShareModule,FormsModule,ReactiveFormsModule
  ]
})
export class RolesypermisosModule { }
