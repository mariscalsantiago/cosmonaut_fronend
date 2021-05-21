import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminCatalogosComponent } from './pages/admincatalogos/admincatalogos.component';
import { DetalleAdminCatalogosComponent  } from './pages/detalle-admincatalogos/detalle-admincatalogos.component';
import { ABCAdminCatalogosComponent  } from './pages/abc-admincatalogos/abc-admincatalogos.component';


export const routes: Routes = [
 
{
  path: '',
  children: [
    {
      path: 'admincatalogos',
      component: AdminCatalogosComponent
    },{
        path: 'admincatalogos/detalle_admincatalogos/detalle',
        component: DetalleAdminCatalogosComponent
      }
      ,{
        path: 'admincatalogos/detalle_admincatalogos/modificar',
        component: ABCAdminCatalogosComponent
      }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class AdminCatalogosRoutingModule { }