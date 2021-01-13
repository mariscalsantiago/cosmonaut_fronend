import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertasComponent } from './alertas/alertas.component';
import { LoadingComponent } from './loading/loading.component';
import { AlertQuestionsComponent } from './alert-questions/alert-questions.component';



@NgModule({
  declarations: [

    AlertasComponent,

    LoadingComponent,

    AlertQuestionsComponent

  ],
  imports: [
    CommonModule
  ],
  exports:[AlertasComponent,LoadingComponent,AlertQuestionsComponent]
})
export class ShareModule { }
