import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './pages/inicio.component';
import { inicioRoutingModule } from './inicio-routing.module';
import { ShareModule } from 'src/app/shared/share.module';



@NgModule({
  declarations: [InicioComponent],
  imports: [
    CommonModule,
    inicioRoutingModule,
    ShareModule
  ]
})
export class InicioModule { }
