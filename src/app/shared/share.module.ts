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
import { VentanaSolicitudVacacionesComponent } from './ventanasemergentes/tiposventanas/ventana-solicitud-vacaciones/ventana-solicitud-vacaciones.component';
import { VentanaSolicitudCargaMasivaEventosComponent } from './ventanasemergentes/tiposventanas/ventana-solicitud-carga-masiva-eventos/ventana-solicitud-carga-masiva-eventos.component';
import { VentanaSolicitudIncapacidadComponent } from './ventanasemergentes/tiposventanas/ventana-solicitud-incapacidad/ventana-solicitud-incapacidad.component';
import { VentanaSolicitudHorasExtrasComponent } from './ventanasemergentes/tiposventanas/ventana-solicitud-horas-extras/ventana-solicitud-horas-extras.component';
import { VentanaSolicitudDiasEconomicosComponent } from './ventanasemergentes/tiposventanas/ventana-solicitud-dias-economicos/ventana-solicitud-dias-economicos.component';
import { VentanaRegistroFaltasComponent } from './ventanasemergentes/tiposventanas/ventana-registro-faltas/ventana-registro-faltas.component';


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
    VentanaSolicitudVacacionesComponent,
    VentanaSolicitudCargaMasivaEventosComponent,
    VentanaSolicitudIncapacidadComponent,
    VentanaSolicitudHorasExtrasComponent,
    VentanaSolicitudDiasEconomicosComponent,
    VentanaRegistroFaltasComponent

  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,HttpClientModule
  ],
  exports: [AlertasComponent, LoadingComponent, AlertQuestionsComponent, TablapaginadoComponent, SubirarchivoComponent,MayusculasDirective,SolonumerosDirective,TamanioVentanaDirective,
    CalendarioComponent,VentanaemergenteprincipalComponent]
})
export class ShareModule { }
