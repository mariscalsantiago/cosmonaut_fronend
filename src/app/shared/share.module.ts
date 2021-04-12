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
import { CalendarioComponent } from './calendario/calendario.component';
import { VentanaemergenteprincipalComponent } from './ventanasemergentes/ventanaemergenteprincipal/ventanaemergenteprincipal.component';
import { ChatbootComponent } from './chatboot/chatboot.component';
import { VentanaNuevanominaComponent } from './ventanasemergentes/tiposventanas/ventana-nuevanomina/ventana-nuevanomina.component';
import { AlfanumericoDirective } from './directivas/alfanumerico.directive';
import { NominaactivaFechatimbradoComponent } from './ventanasemergentes/tiposventanas/nominaactiva-fechatimbrado/nominaactiva-fechatimbrado.component';


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
    TamanioVentanaDirective,
    CalendarioComponent,
    VentanaemergenteprincipalComponent,
    ChatbootComponent,
    VentanaNuevanominaComponent,
    AlfanumericoDirective,
    NominaactivaFechatimbradoComponent

  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,HttpClientModule
  ],
  exports: [AlertasComponent, LoadingComponent, AlertQuestionsComponent, TablapaginadoComponent, SubirarchivoComponent,MayusculasDirective,SolonumerosDirective,TamanioVentanaDirective,
    CalendarioComponent,VentanaemergenteprincipalComponent,ChatbootComponent,AlfanumericoDirective]
})
export class ShareModule { }
