import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IDSEComponent } from "./IDSE/idse/idse.component";
import { imssRoutingModule } from "./imss-routing.module";
import { IdseDetalleComponent } from './IDSE/idse-detalle/idse-detalle.component';


@NgModule({
    declarations:[IDSEComponent, IdseDetalleComponent],
    imports:[CommonModule,FormsModule,imssRoutingModule]
})
export class imssModule{

}