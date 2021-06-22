import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { DetalleUsuarioComponent } from './pages/detalle-usuario/detalle-usuario.component';


export const routes: Routes = [

  {
    path: '',
    children: [
      {
        path: '',
        component: UsuariosComponent
      },
      {
        path: 'usuarios',
        component: UsuariosComponent
      }, 
      {
        path: 'detalle_usuario',
        component: DetalleUsuarioComponent
      },      
      {
        path: 'usuarios/detalle_usuario',
        component: DetalleUsuarioComponent
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class usuariosRoutingModule { }