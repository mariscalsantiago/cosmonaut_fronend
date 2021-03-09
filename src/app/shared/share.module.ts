import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertasComponent } from './alertas/alertas.component';
import { LoadingComponent } from './loading/loading.component';
import { AlertQuestionsComponent } from './alert-questions/alert-questions.component';
import { TablapaginadoComponent } from './tablapaginado/tablapaginado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubirarchivoComponent } from './subirarchivo/subirarchivo.component';
import { ManipularfilesDirective } from './directivas/manipularfiles.directive';
import { HttpClientModule } from '@angular/common/http';
import { MayusculasDirective } from './directivas/mayusculas.directive';
import { SolonumerosDirective } from './directivas/solonumeros.directive';
import { TamanioVentanaDirective } from './directivas/tamanio-ventana.directive';


@NgModule({
  declarations: [

    AlertasComponent,

    LoadingComponent,

    AlertQuestionsComponent,

    TablapaginadoComponent,

    SubirarchivoComponent,
    ManipularfilesDirective,
    MayusculasDirective,
    SolonumerosDirective,
    TamanioVentanaDirective

  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,HttpClientModule
  ],
  exports: [AlertasComponent, LoadingComponent, AlertQuestionsComponent, TablapaginadoComponent, SubirarchivoComponent,MayusculasDirective,SolonumerosDirective,TamanioVentanaDirective]
})
export class ShareModule { }
