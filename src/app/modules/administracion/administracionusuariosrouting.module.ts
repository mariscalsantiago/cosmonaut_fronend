import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminListaUsuariosComponent } from './administracionusuarios/pages/admin-lista-usuarios/admin-lista-usuarios.component';
import { AdminDetalleUsuariosComponent } from './administracionusuarios/pages/admin-detalle-usuarios/admin-detalle-usuarios.component';

const rutas:Routes = [{
  path:'',children:[
    {path:'users',component:AdminListaUsuariosComponent},
    {path:'users/details',component:AdminDetalleUsuariosComponent}
  ]
}];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(rutas)
  ],
  exports: [RouterModule] 
})
export class AdministracionusuariosroutingModule { }
