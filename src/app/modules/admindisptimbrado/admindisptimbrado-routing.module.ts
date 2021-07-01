import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminDispercionTimbradoComponent } from './pages/admindisptimbrado/admindisptimbrado.component';


export const routes: Routes = [
 
{
  path: '',
  children: [
    {
      path: '',
      component: AdminDispercionTimbradoComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class AdminDispercionTimbradoRoutingModule { }