import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ShareModule } from "src/app/shared/share.module";
import { IdseDetalleComponent } from "./IDSE/idse-detalle/idse-detalle.component";
import { IDSEComponent } from "../IMSS/IDSE/idse/idse.component";

import { imssRoutingModule } from "./imss-routing.module";
import { SuaComponent } from "./sua/sua/sua.component";


@NgModule({
    declarations:[IDSEComponent, IdseDetalleComponent, SuaComponent],
    imports:[CommonModule,FormsModule,imssRoutingModule,ShareModule]
})
export class imssModule{

}