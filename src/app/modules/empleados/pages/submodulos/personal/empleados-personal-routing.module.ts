import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonalComponent } from './pages/personal/personal.component';



const routes: Routes = [{
  path:'',
  children:[
    {path:'personal',component:PersonalComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class empleadosPersonalRoutingModule { }