import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IDSEComponent } from "src/app/modules/imss/idse/idse/idse.component";
import { imssRoutingModule } from "src/app/modules/imss/imss-routing.module";
import { IdseDetalleComponent } from 'src/app/modules/imss/idse/idse-detalle/idse-detalle.component';
import { ShareModule } from "src/app/shared/share.module";
import { SuaComponent } from "src/app/modules/imss/sua/sua/sua.component";


@NgModule({
    declarations:[IDSEComponent, IdseDetalleComponent, SuaComponent],
    imports:[CommonModule,FormsModule,imssRoutingModule,ShareModule]
})
export class imssModule{

}