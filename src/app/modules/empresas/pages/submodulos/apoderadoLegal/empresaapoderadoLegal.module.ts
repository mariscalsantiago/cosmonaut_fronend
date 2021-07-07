import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShareModule } from 'src/app/shared/share.module';
import { CoreModule } from 'src/app/core/core.module';
import { empresaApoderadoLegalRoutingModule } from "./empresaapoderadoLegal-routing.module";
import { DetalleapoderadoLegalComponent } from "./pages/detalleapoderadoLegal/detalleapoderadoLegal.component";
import { ListaapoderadoLegalComponent } from "./pages/listaapoderadoLegal/listaapoderadoLegal.component";
import { TooltipModule } from 'ng-uikit-pro-standard';
@NgModule({
   declarations:[DetalleapoderadoLegalComponent,ListaapoderadoLegalComponent],
   imports: [
      CommonModule,
      empresaApoderadoLegalRoutingModule,
      ShareModule,
      FormsModule,
      ReactiveFormsModule,
      CoreModule, TooltipModule
    ],
})
export class empresaApoderadoLegalModule{

}