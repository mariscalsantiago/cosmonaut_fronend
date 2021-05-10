import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminListaUsuariosComponent } from './administracionusuarios/pages/admin-lista-usuarios/admin-lista-usuarios.component';
import { AdminDetalleUsuariosComponent } from './administracionusuarios/pages/admin-detalle-usuarios/admin-detalle-usuarios.component';

const rutas:Routes = [{
  path:'',children:[
    {path:'usuarios',component:AdminListaUsuariosComponent},
    {path:'usuarios/detalle',component:AdminDetalleUsuariosComponent}
  ]
}];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(rutas)
  ],
  exports:[RouterModule]
})
export class AdministracionusuariosroutingModule { }
