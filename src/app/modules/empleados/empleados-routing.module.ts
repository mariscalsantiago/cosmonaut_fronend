import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { FormBajaEmpleadoComponent } from './pages/form-baja-empleado/form-baja-empleado.component';
import { FormEmpleadoComponent } from './pages/form-empleado/form-empleado.component';
import { ListaempleadosComponent } from './pages/listaempleados/listaempleados.component';



const routes: Routes = [{
  path:'',children:[
     {path:'empleados',component:ListaempleadosComponent},
     {path:'empleados/empleado',component:FormEmpleadoComponent},
     {path:'empleados/bajaempleado',component:FormBajaEmpleadoComponent},
     {path:'empleados/:id',component:EmpleadoComponent,loadChildren:()=> import('./pages/submodulos/personal/empleados-personal.module').then(m => m.EmpleadosPersonalModule)},
     {path:'empleados/:id',component:EmpleadoComponent,loadChildren:()=> import('./pages/submodulos/empleo/empleados-empleo.module').then(m => m.empleadosEmpleoModule)},
     {path:'empleados/:id',component:EmpleadoComponent,loadChildren:()=> import('./pages/submodulos/pagos/empleados-pagos.module').then(m => m.empleadosPagosModule)},
     {path:'empleados/:id',component:EmpleadoComponent,loadChildren:()=> import('./pages/submodulos/eventos/empleados-eventos.module').then(m => m.empleadosEventosModule)},
     {path:'empleados/:id',component:EmpleadoComponent,loadChildren:()=> import('./pages/submodulos/documentos/empleados-documentos.module').then(m => m.empleadosDocumentosModule)}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class empleadosRoutingModule { }