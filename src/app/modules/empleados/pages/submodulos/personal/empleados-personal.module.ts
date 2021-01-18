import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { empleadosPersonalRoutingModule } from './empleados-personal-routing.module';
import { PersonalComponent } from './pages/personal/personal.component';



@NgModule({
    declarations: [PersonalComponent],
    imports: [
      CommonModule,
      empleadosPersonalRoutingModule
    ],
    providers: []
  })
  export class EmpleadosPersonalModule { }