import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './pages/inicio.component';
import { inicioRoutingModule } from './inicio-routing.module';



@NgModule({
  declarations: [InicioComponent],
  imports: [
    CommonModule,
    inicioRoutingModule
  ]
})
export class InicioModule { }
