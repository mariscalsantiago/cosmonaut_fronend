import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SolicitarComponent } from './pages/solicitar/solicitar.component';
import { EmpresaComponent } from './pages/empresa/empresa.component';

const routes: Routes = [
 
{
  path: '',
  children: [
    {
      path: 'login',
      component: LoginComponent
    },
    {
      path: 'solicitar',
      component: SolicitarComponent
    },
    {
      path: 'empresa',
      component: EmpresaComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class AuthRoutingModule { }
