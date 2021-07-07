import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { empleadosPersonalRoutingModule } from './empleados-personal-routing.module';
import { PersonalComponent } from './pages/personal/personal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/shared/share.module';


@NgModule({
    declarations: [PersonalComponent],
    imports: [
      CommonModule,
      empleadosPersonalRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      ShareModule
    ],
    providers: []
  })
  export class EmpleadosPersonalModule { }