import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AlertasComponent } from './alertas/alertas.component';
import { LoadingComponent } from './loading/loading.component';
import { AlertQuestionsComponent } from './alert-questions/alert-questions.component';
import { TablapaginadoComponent } from './tablapaginado/tablapaginado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubirarchivoComponent } from './subirarchivo/subirarchivo.component';
import { ManipularfilesDirective } from './directivas/manipularfiles.directive';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MayusculasDirective } from './directivas/mayusculas.directive';
import { SolonumerosDirective } from './directivas/solonumeros.directive';
import { TamanioVentanaDirective } from './directivas/tamanio-ventana.directive';
import { CalendarioComponent } from './calendario/calendario.component';
import { VentanaemergenteprincipalComponent } from './ventanasemergentes/ventanaemergenteprincipal/ventanaemergenteprincipal.component';
import { ChatbootComponent } from './chatboot/chatboot.component';
import { VentanaNuevanominaComponent } from './ventanasemergentes/tiposventanas/ventana-nuevanomina/ventana-nuevanomina.component';
import { AlfanumericoDirective } from './directivas/alfanumerico.directive';
import { NominaactivaFechatimbradoComponent } from './ventanasemergentes/tiposventanas/nominaactiva-fechatimbrado/nominaactiva-fechatimbrado.component';
import { NominaactivaTimbrarComponent } from './ventanasemergentes/tiposventanas/nominaactiva-timbrar/nominaactiva-timbrar.component';
import { SubirFotoPerfilComponent } from './ventanasemergentes/tiposventanas/subir-foto-perfil/subir-foto-perfil.component';
import { VentanaPercepcionesComponent } from './ventanasemergentes/tiposventanas/ventana-percepciones/ventana-percepciones.component';
import { VentanaDeduccionesComponent } from './ventanasemergentes/tiposventanas/ventana-deducciones/ventana-deducciones.component';
import { VentanaResumenDispersionComponent } from './ventanasemergentes/tiposventanas/ventana-resumen-dispersion/ventana-resumen-dispersion.component';
import { VentanaResumenTimbradoComponent } from './ventanasemergentes/tiposventanas/ventana-resumen-timbrado/ventana-resumen-timbrado.component';
import { VentanaSubirDocumentoComponent } from './ventanasemergentes/tiposventanas/ventana-subirdocumento/ventana-subirdocumento.component'
import { VentanaNominanuevaextraordinariaComponent } from './ventanasemergentes/tiposventanas/ventana-nominanuevaextraordinaria/ventana-nominanuevaextraordinaria.component';
import { NominanuevaPtuComponent } from './ventanasemergentes/tiposventanas/nominanueva-ptu/nominanueva-ptu.component';
import { VentanaTablaISRComponent } from './ventanasemergentes/tiposventanas/ventana-tablaisr/ventana-tablaisr.component';
import { VentanaSubcidioComponent } from './ventanasemergentes/tiposventanas/ventana-subcidio/ventana-subcidio.component';
import { TagComponent } from './tag/tag.component';
import { VentanaNominaNuevaFiniquitoLiquidacionComponent } from './ventanasemergentes/tiposventanas/ventana-nominanuevafiniquitoliquidacion/ventana-nominanuevafiniquitoliquidacion.component';
import { FormatosDirective } from './directivas/formatos.directive';
import { EditarmensajeChatComponent } from './ventanasemergentes/tiposventanas/editarmensaje-chat/editarmensaje-chat.component';
import { TokenInterceptorService } from '../core/auth/token-interceptor.service';
import { TooltipPipe } from './pipes/tooltip.pipe';
import { BooleanPipe } from './pipes/boolean.pipe';


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
    NominaactivaFechatimbradoComponent,
    NominaactivaTimbrarComponent,
    SubirFotoPerfilComponent,
    VentanaPercepcionesComponent,
    VentanaDeduccionesComponent,
    VentanaResumenDispersionComponent,
    VentanaResumenTimbradoComponent,
    VentanaSubirDocumentoComponent,
    VentanaNominanuevaextraordinariaComponent,
    NominanuevaPtuComponent,
    VentanaTablaISRComponent,
    VentanaSubcidioComponent,
    TagComponent,
    VentanaNominaNuevaFiniquitoLiquidacionComponent,
    FormatosDirective,
    EditarmensajeChatComponent,
    TooltipPipe,
    BooleanPipe

  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule
  ],
  exports: [AlertasComponent, LoadingComponent, AlertQuestionsComponent, TablapaginadoComponent, SubirarchivoComponent, MayusculasDirective, SolonumerosDirective, TamanioVentanaDirective,
    CalendarioComponent, VentanaemergenteprincipalComponent, ChatbootComponent, AlfanumericoDirective,TagComponent,FormatosDirective, TooltipPipe, BooleanPipe],
  providers:[CurrencyPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShareModule { }
