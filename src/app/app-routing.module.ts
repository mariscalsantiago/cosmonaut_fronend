import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProteccionRutasService } from './core/auth/proteccion-rutas.service';
import { AuthComponent } from './layout/autentificacion/auth/auth.component';
import { ContenidoComponent } from './layout/contenido/contenido/contenido.component';



export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '', component: ContenidoComponent, canActivate: [ProteccionRutasService], loadChildren: () => import('./modules/inicio/inicio.module').then(m => m.InicioModule) },
  { path: '', component: ContenidoComponent, canActivate: [ProteccionRutasService], loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule) },
  { path: '', component: ContenidoComponent, canActivate: [ProteccionRutasService], loadChildren: () => import('./modules/company/company.module').then(m => m.CompanyModule) },
  { path: '', component: ContenidoComponent, canActivate: [ProteccionRutasService], loadChildren: () => import('./modules/admincatalogos/admincatalogos.module').then(m => m.AdminCatalogosModule) },
  { path: '', component: ContenidoComponent, canActivate: [ProteccionRutasService], loadChildren: () => import('./modules/empleados/empleados.module').then(m => m.EmpleadosModule) },
  { path: '', component: ContenidoComponent, canActivate: [ProteccionRutasService], loadChildren: () => import('./modules/empresas/empresas.module').then(m => m.EmpresasModule) },
  { path: 'imss', component: ContenidoComponent, canActivate: [ProteccionRutasService], loadChildren: () => import('./modules/IMSS/imss.module').then(m => m.imssModule) },
  { path: 'eventos', component: ContenidoComponent, canActivate: [ProteccionRutasService], loadChildren: () => import('./modules/eventos/eventos.module').then(m => m.eventosModule) },
  { path: 'nominas', component: ContenidoComponent, canActivate: [ProteccionRutasService], loadChildren: () => import('./modules/nominas/nominas.module').then(m => m.nominasModule) },
  { path: 'rolesypermisos', component: ContenidoComponent, canActivate: [ProteccionRutasService], loadChildren: () => import('./modules/rolesypermisos/rolesypermisos.module').then(m => m.RolesypermisosModule) },
  { path: 'auth', component: AuthComponent, loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
]
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
