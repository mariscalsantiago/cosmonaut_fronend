import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
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
import { NominaactivaTimbrarComponent } from './ventanasemergentes/tiposventanas/nominaactiva-timbrar/nominaactiva-timbrar.component';
import { SubirFotoPerfilComponent } from './ventanasemergentes/tiposventanas/subir-foto-perfil/subir-foto-perfil.component';
import { VentanaPercepcionesComponent } from './ventanasemergentes/tiposventanas/ventana-percepciones/ventana-percepciones.component';
import { VentanaEventosComponent } from './ventanasemergentes/tiposventanas/ventana-eventos/ventana-eventos.component';
import { VentanaAdminTimbradoDispersionComponent } from './ventanasemergentes/tiposventanas/ventana-adminTimDisper/ventana-adminTimDisper.component';
import { VentanaDeduccionesComponent } from './ventanasemergentes/tiposventanas/ventana-deducciones/ventana-deducciones.component';
import { VentanaResumenDispersionComponent } from './ventanasemergentes/tiposventanas/ventana-resumen-dispersion/ventana-resumen-dispersion.component';
import { VentanaResumenTimbradoComponent } from './ventanasemergentes/tiposventanas/ventana-resumen-timbrado/ventana-resumen-timbrado.component';
import { VentanaSubirDocumentoComponent } from './ventanasemergentes/tiposventanas/ventana-subirdocumento/ventana-subirdocumento.component'
import { VentanaDetalleCuentaComponent} from './ventanasemergentes/tiposventanas/ventana-detallecuenta/ventana-detallecuenta.component'
import { VentanaDetalleCompensacionComponent} from './ventanasemergentes/tiposventanas/ventana-detallecompesacion/ventana-detallecompesacion.component'
import { VentanaNominanuevaextraordinariaComponent } from './ventanasemergentes/tiposventanas/ventana-nominanuevaextraordinaria/ventana-nominanuevaextraordinaria.component';
import { NominanuevaPtuComponent } from './ventanasemergentes/tiposventanas/nominanueva-ptu/nominanueva-ptu.component';
import { VentanaTablaISRComponent } from './ventanasemergentes/tiposventanas/ventana-tablaisr/ventana-tablaisr.component';
import { VentanaTablaISNComponent } from './ventanasemergentes/tiposventanas/ventana-tablaisn/ventana-tablaisn.component';
import { VentanaSubcidioComponent } from './ventanasemergentes/tiposventanas/ventana-subcidio/ventana-subcidio.component';
import { TagComponent } from './tag/tag.component';
import { VentanaNominaNuevaFiniquitoLiquidacionComponent } from './ventanasemergentes/tiposventanas/ventana-nominanuevafiniquitoliquidacion/ventana-nominanuevafiniquitoliquidacion.component';
import { FormatosDirective } from './directivas/formatos.directive';
import { EditarmensajeChatComponent } from './ventanasemergentes/tiposventanas/editarmensaje-chat/editarmensaje-chat.component';
import { TooltipPipe } from './pipes/tooltip.pipe';
import { CoreModule } from '../core/core.module';
import { BooleanPipe } from './pipes/boolean.pipe';
import { HoraPipe } from './pipes/hora.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { CentrarPipe } from './pipes/centrar.pipe';
import { ShowPipe } from './pipes/show.pipe';
import { TooltipModule } from 'ng-uikit-pro-standard';
import { ListaEmpleadosComponent } from './ventanasemergentes/tiposventanas/lista-empleados/lista-empleados.component';
import { BannerCarouselComponent } from './banner-carousel/banner-carousel.component';
import { AnuncioListadoComponent } from './anuncio-listado/anuncio-listado.component';
import { CursoListadoComponent } from './curso-listado/curso-listado.component';

@NgModule({
  declarations: [

    AlertasComponent,
    LoadingComponent,
    BannerCarouselComponent,
    AnuncioListadoComponent,
    CursoListadoComponent,
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
    VentanaEventosComponent,
    VentanaAdminTimbradoDispersionComponent,
    VentanaDeduccionesComponent,
    VentanaResumenDispersionComponent,
    VentanaResumenTimbradoComponent,
    VentanaSubirDocumentoComponent,
    VentanaNominanuevaextraordinariaComponent,
    NominanuevaPtuComponent,
    VentanaTablaISRComponent,
    VentanaTablaISNComponent,
    VentanaSubcidioComponent,
    TagComponent,
    VentanaNominaNuevaFiniquitoLiquidacionComponent,
    VentanaDetalleCuentaComponent,
    VentanaDetalleCompensacionComponent,
    FormatosDirective,
    EditarmensajeChatComponent,
    TooltipPipe,
    BooleanPipe,
    HoraPipe,
    FilterPipe,
    HighlightPipe,
    CentrarPipe,
    ShowPipe,
    ListaEmpleadosComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    TooltipModule,
  ],
  exports: [
    AlertasComponent,
    LoadingComponent,
    AlertQuestionsComponent,
    BannerCarouselComponent,
    AnuncioListadoComponent,
    CursoListadoComponent,
    TablapaginadoComponent,
    SubirarchivoComponent,
    MayusculasDirective,
    SolonumerosDirective,
    TamanioVentanaDirective,
    CalendarioComponent,
    VentanaemergenteprincipalComponent,
    ChatbootComponent,
    HighlightPipe,
    ShowPipe,
    CentrarPipe,
    AlfanumericoDirective,
    TagComponent,
    FormatosDirective,
    TooltipPipe,
    BooleanPipe,
    HoraPipe],
  providers: [CurrencyPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShareModule { }
