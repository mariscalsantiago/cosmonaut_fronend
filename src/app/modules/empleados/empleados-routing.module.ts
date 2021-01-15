import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { ListaempleadosComponent } from './pages/listaempleados/listaempleados.component';



const routes: Routes = [{
  path:'',children:[
     {path:'empleados',component:ListaempleadosComponent},
     {path:'empleados/:id',component:EmpleadoComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class empleadosRoutingModule { }