import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { DetalleUsuarioComponent } from './pages/detalle-usuario/detalle-usuario.component';
import { CompaniasResolver } from './resolver/companias.resolver';
import { RolesResolver } from './resolver/roles.resolver';


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
        component: DetalleUsuarioComponent,resolve:{companias:CompaniasResolver,roles:RolesResolver}
      },      
      {
        path: 'usuarios/detalle_usuario',
        component: DetalleUsuarioComponent,resolve:{companias:CompaniasResolver,roles:RolesResolver}
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class usuariosRoutingModule { }