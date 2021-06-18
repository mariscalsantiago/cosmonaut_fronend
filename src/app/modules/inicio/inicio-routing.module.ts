import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './pages/inicio.component';


const routes: Routes = [
 
{
  path: '',
  children: [
    {
      path: '',
      component: InicioComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class inicioRoutingModule { }
