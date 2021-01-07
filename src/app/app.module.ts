import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    AuthModule
  ],
  providers: [MDBSpinningPreloader],
  bootstrap: [AppComponent]
})
export class AppModule { }
