import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProteccionRutasService } from './core/auth/proteccion-rutas.service';
import { InicioRutasService } from './core/auth/subdiviciones/inicio-rutas.service';
import { LoadingRutasService } from './core/auth/subdiviciones/loading-rutas.service';
import { ProteccionRutasLoginService } from './core/auth/subdiviciones/login-rutas.service';
import { AuthComponent } from './layout/autentificacion/auth/auth.component';
import { ContenidoComponent } from './layout/contenido/contenido/contenido.component';
import { ConfiguracionesService } from './shared/services/configuraciones/configuraciones.service';


export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'inicio', component: ContenidoComponent, canActivate: [InicioRutasService], loadChildren: () => import('./modules/inicio/inicio.module').then(m => m.InicioModule) },
  { path: 'usuarios', component: ContenidoComponent, canActivate: [ProteccionRutasService],canLoad:[LoadingRutasService], loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => ConfiguracionesService.establecerMenu(m,[2]).UsuariosModule) },
  { path: 'cliente', component: ContenidoComponent, canActivate: [ProteccionRutasService],canLoad:[LoadingRutasService], loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => ConfiguracionesService.establecerMenu(m,[1]).UsuariosModule) },
  { path: 'company', component: ContenidoComponent, canActivate: [ProteccionRutasService],canLoad:[LoadingRutasService], loadChildren: () => import('./modules/company/company.module').then(m => ConfiguracionesService.establecerMenu(m,[1]).companyModule) },
  { path: 'admincatalogos', component: ContenidoComponent, canActivate: [ProteccionRutasService],canLoad:[LoadingRutasService],  loadChildren: () => import('./modules/admincatalogos/admincatalogos.module').then(m => ConfiguracionesService.establecerMenu(m,[1]).AdminCatalogosModule) },
  { path: 'admintimbradodispersion', component: ContenidoComponent, canActivate: [ProteccionRutasService],canLoad:[LoadingRutasService],  loadChildren: () => import('./modules/admindisptimbrado/admindisptimbrado.module').then(m => ConfiguracionesService.establecerMenu(m,[1]).AdminCatalogosModuleTimbrado) },
  { path: 'empleados', component: ContenidoComponent, canActivate: [ProteccionRutasService],canLoad:[LoadingRutasService],  loadChildren: () => import('./modules/empleados/empleados.module').then(m => ConfiguracionesService.establecerMenu(m,[3]).EmpleadosModule) },
  { path: 'listaempresas', component: ContenidoComponent, canActivate: [ProteccionRutasService], canLoad:[LoadingRutasService], loadChildren: () => import('./modules/empresas/empresas.module').then(m => ConfiguracionesService.establecerMenu(m,[2]).EmpresasModule) },
  { path: 'empresa', component: ContenidoComponent, canActivate: [ProteccionRutasService], canLoad:[LoadingRutasService], loadChildren: () => import('./modules/empresas/empresas.module').then(m => ConfiguracionesService.establecerMenu(m,[2]).EmpresasModule) },
  { path: 'movimientos', component: ContenidoComponent, canActivate: [ProteccionRutasService], canLoad:[LoadingRutasService], loadChildren: () => import('./modules/empresas/empresas.module').then(m => ConfiguracionesService.establecerMenu(m,[2]).EmpresasModule) },
  { path: 'imss', component: ContenidoComponent, canActivate: [ProteccionRutasService], canLoad:[LoadingRutasService], loadChildren: () => import('./modules/IMSS/imss.module').then(m => ConfiguracionesService.establecerMenu(m,[6]).imssModule) },
  { path: 'eventos', component: ContenidoComponent, canActivate: [ProteccionRutasService],canLoad:[LoadingRutasService],  loadChildren: () => import('./modules/eventos/eventos.module').then(m => ConfiguracionesService.establecerMenu(m,[4]).eventosModule) },
  { path: 'nominas', component: ContenidoComponent, canActivate: [ProteccionRutasService],canLoad:[LoadingRutasService],  loadChildren: () => import('./modules/nominas/nominas.module').then(m => ConfiguracionesService.establecerMenu(m,[5]).nominasModule) },
  { path: 'rolesypermisos', component: ContenidoComponent, canActivate: [ProteccionRutasService],canLoad:[LoadingRutasService],  loadChildren: () => import('./modules/rolesypermisos/rolesypermisos.module').then(m => ConfiguracionesService.establecerMenu(m,[1,2]).RolesypermisosModule) },
  { path: 'chat', component: ContenidoComponent, canActivate: [ProteccionRutasService], canLoad:[LoadingRutasService], loadChildren: () => import('./modules/chat/chats.module').then(m => ConfiguracionesService.establecerMenu(m,[9]).ChatsModule) },
  { path: 'auth', component: AuthComponent,canActivate:[ProteccionRutasLoginService], loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: '**', redirectTo: '/auth/login', pathMatch: 'full' }
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule],
  
})


export class AppRoutingModule {

  constructor(){

  }

 }



