import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { ListaempleadosComponent } from './pages/listaempleados/listaempleados.component';



const routes: Routes = [{
  path:'',children:[
     {path:'empleados',component:ListaempleadosComponent},
     {path:'empleados/:id',component:EmpleadoComponent,loadChildren:()=> import('./pages/submodulos/personal/empleados-personal.module').then(m => m.EmpleadosPersonalModule)},
     {path:'empleados/:id',component:EmpleadoComponent,loadChildren:()=> import('./pages/submodulos/empleo/empleados-empleo.module').then(m => m.empleadosEmpleoModule)}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class empleadosRoutingModule { }