import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShareModule } from 'src/app/shared/share.module';
import { CoreModule } from 'src/app/core/core.module';
import { empresapuestosRoutingModule } from "./empresapuestos-routing.module";
import { DetallepuestosComponent } from "./pages/detallepuestos/detallepuestos.component";
import { ListapuestosComponent } from "./pages/listapuestos/listapuestos.component";

@NgModule({
   declarations:[DetallepuestosComponent,ListapuestosComponent],
   imports: [
      CommonModule,
      empresapuestosRoutingModule,
      ShareModule,
      FormsModule,
      ReactiveFormsModule,
      CoreModule
    ],
})
export class empresapuestosModule{

}