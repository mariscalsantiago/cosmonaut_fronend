import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertasComponent } from './alertas/alertas.component';



@NgModule({
  declarations: [

    AlertasComponent

  ],
  imports: [
    CommonModule
  ],
  exports:[AlertasComponent]
})
export class ShareModule { }
