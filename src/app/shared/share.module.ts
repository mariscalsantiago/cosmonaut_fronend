import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertasComponent } from './alertas/alertas.component';
import { LoadingComponent } from './loading/loading.component';



@NgModule({
  declarations: [

    AlertasComponent,

    LoadingComponent

  ],
  imports: [
    CommonModule
  ],
  exports:[AlertasComponent,LoadingComponent]
})
export class ShareModule { }
