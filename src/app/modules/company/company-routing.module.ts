import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './pages/company.component';


const routes: Routes = [
 
{
  path: '',
  children: [
    {
      path: 'company',
      component: CompanyComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class companyRoutingModule { }