import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';


import { AuthComponent } from './layout/autentificacion/auth/auth.component';
import { FooterComponent } from './layout/footer/footer/footer.component';
import { ContenidoComponent } from './layout/contenido/contenido/contenido.component';
import { NavComponent } from './layout/nav/nav/nav.component';
import { ShareModule } from './shared/share.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './core/interceptores/interceptor.service';


//Importamos para el lenguaje en mis fechas (SAMV)
import localeEn from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEn, 'es-MX');


@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    FooterComponent,
    ContenidoComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModulesPro.forRoot(),
    //importación de modulos personalizados (Core, auth...etc)
    CoreModule,
    AuthModule,
    ShareModule
  ],
  providers: [MDBSpinningPreloader,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService, multi: true
    },
    {
      provide:LOCALE_ID,useValue:'es-MX'
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
