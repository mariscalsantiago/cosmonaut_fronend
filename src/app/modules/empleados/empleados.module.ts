import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { empleadosRoutingModule } from './empleados-routing.module';
import { ListaempleadosComponent } from './pages/listaempleados/listaempleados.component';
import { EmpleadoComponent } from './pages/empleado/empleado.component';


@NgModule({
    declarations: [ListaempleadosComponent, EmpleadoComponent],
    imports: [
      CommonModule,
      empleadosRoutingModule
    ],
    providers: []
  })
  export class EmpleadosModule { }
