import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertasComponent } from './alertas/alertas.component';
import { LoadingComponent } from './loading/loading.component';
import { AlertQuestionsComponent } from './alert-questions/alert-questions.component';
import { TablapaginadoComponent } from './tablapaginado/tablapaginado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [

    AlertasComponent,

    LoadingComponent,

    AlertQuestionsComponent,

    TablapaginadoComponent

  ],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule
  ],
  exports:[AlertasComponent,LoadingComponent,AlertQuestionsComponent,TablapaginadoComponent]
})
export class ShareModule { }
