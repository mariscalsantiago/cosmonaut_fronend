import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './pages/company/company.component'
import { DetalleCompanyComponent} from './pages/detalle-company/detalle_company.component'
import { DetalleContactoComponent} from './pages/detalle-contacto/detalle-contacto.component'


const routes: Routes = [
 
{
  path: '',
  children: [
    {
      path: '',
      component: CompanyComponent
    },
    {
      path: 'detalle_company/:tipoinsert',
      component: DetalleCompanyComponent
    },
    {
      path: 'detalle_contacto/:tipoinsert',
      component: DetalleContactoComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class companyRoutingModule { }