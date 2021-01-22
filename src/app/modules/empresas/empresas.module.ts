import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresasRoutingModule } from './empresas-routing.module';
import { EmpresasComponent } from './pages/empresas/empresas.component';


@NgModule({
    declarations: [EmpresasComponent],
    imports: [
      CommonModule,
      EmpresasRoutingModule
    ],
    providers: []
  })
  export class EmpresasModule { }
