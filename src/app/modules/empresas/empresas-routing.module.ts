import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { ListaEmpresasComponent } from './pages/listaempresas/listaempresas.component';


const routes: Routes = [{
  path:'',children:[
     {path:'empresas',component:ListaEmpresasComponent},
     //{path:'empresas/:id',component:EmpresasComponent,loadChildren:()=> import('./pages/submodulos/personal/empleados-personal.module').then(m => m.EmpleadosPersonalModule)},
     //{path:'empresas/:id',component:EmpresasComponent,loadChildren:()=> import('./pages/submodulos/empleo/empleados-empleo.module').then(m => m.empleadosEmpleoModule)}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class EmpresasRoutingModule { }