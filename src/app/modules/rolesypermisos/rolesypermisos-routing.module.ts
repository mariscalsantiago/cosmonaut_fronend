import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleRolesComponent } from './pages/detalle-roles/detalle-roles.component';
import { ListarolesComponent } from './pages/listaroles/listaroles.component';



const routes:Routes = [
 
  {
    path: '',
    children: [
      {
        path: 'lista',component:ListarolesComponent
      },
      {
        path: 'lista/rol',component:DetalleRolesComponent
      }
    ]
  }];;


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports:[RouterModule]
})
export class RolesypermisosRoutingModule { }
