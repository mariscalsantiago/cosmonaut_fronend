import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { ListaEmpresasComponent } from './pages/listaempresas/listaempresas.component';


const routes: Routes = [{
  path:'',
  children:[
    {
       path:'listaempresas',
       component:ListaEmpresasComponent
    },
    {
      path: 'listaempresas/empresas/:tipoinsert',
      component: EmpresasComponent
    },
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class EmpresasRoutingModule { }