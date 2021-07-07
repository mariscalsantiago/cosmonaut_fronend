import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShareModule } from 'src/app/shared/share.module';
import { CoreModule } from 'src/app/core/core.module';
import { empresapoliticasRoutingModule } from "./empresapoliticas-routing.module";
import { DetallepoliticasComponent } from "./pages/detallepoliticas/detallepoliticas.component";
import { ListapoliticasComponent } from "./pages/listapoliticas/listapoliticas.component";
import { TooltipModule } from 'ng-uikit-pro-standard';

@NgModule({
   declarations:[DetallepoliticasComponent,ListapoliticasComponent],
   imports: [
      CommonModule,
      empresapoliticasRoutingModule,
      ShareModule,
      FormsModule,
      ReactiveFormsModule,
      CoreModule, TooltipModule
    ],
})
export class empresapoliticasModule{

}