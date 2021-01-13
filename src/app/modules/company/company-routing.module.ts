import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './pages/company/company.component'
import { DetalleCompanyComponent} from './pages/detalle-company/detalle_company.component'


const routes: Routes = [
 
{
  path: '',
  children: [
    {
      path: 'company',
      component: CompanyComponent
    },
    {
      path: 'company/detalle_company',
      component: DetalleCompanyComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class companyRoutingModule { }