import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleUsuarioComponent } from './pages/detalle-usuario/detalle-usuario.component';


const routes: Routes = [
 
{
  path: '',
  children: [
    {
      path: 'usuarios',
      component: DetalleUsuarioComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class usuariosRoutingModule { }