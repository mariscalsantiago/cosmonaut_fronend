import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralesComponent } from './pages/generales/generales.component';



const routes:Routes = [
  {
      path:'',children:[
          {path:'generales',component:GeneralesComponent},
      ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class ReportesRoutingModule { }
