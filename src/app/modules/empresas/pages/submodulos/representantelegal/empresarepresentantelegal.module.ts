import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ShareModule } from 'src/app/shared/share.module';
import { CoreModule } from 'src/app/core/core.module';
import { empresaRepresentanteLegalRoutingModule } from "./empresarepresentantelegal-routing.module";
import { DetallerepresentantelegalComponent } from "./pages/detallerepresentantelegal/detallerepresentantelegal.component";
import { ListarepresentantelegalComponent } from "./pages/listarepresentantelegal/listarepresentantelegal.component";
import { TooltipModule} from 'ng-uikit-pro-standard'

@NgModule({
   declarations:[DetallerepresentantelegalComponent,ListarepresentantelegalComponent],
   imports: [
      CommonModule,
      empresaRepresentanteLegalRoutingModule,
      ShareModule,
      FormsModule,
      ReactiveFormsModule,
      CoreModule, TooltipModule 
    ],
})
export class empresaRepresentanteLegalModule{

}