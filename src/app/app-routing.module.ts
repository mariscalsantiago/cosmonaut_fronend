import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutenticacionService } from './core/auth/autenticacion.service';
import { AuthComponent } from './layout/autentificacion/auth/auth.component';
import { ContenidoComponent } from './layout/contenido/contenido/contenido.component';



const routes: Routes = [
  {path: '',  redirectTo: '/auth/login',  pathMatch: 'full'},
  {path:'',component:ContenidoComponent,canActivate:[AutenticacionService],loadChildren:()=> import('./modules/inicio/inicio.module').then(m => m.InicioModule)},
  {path:'',component:ContenidoComponent,canActivate:[AutenticacionService],loadChildren:()=> import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule)},
  {path: 'auth',  component: AuthComponent,  loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)},

{ path: '**', redirectTo: '/auth/login', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
