import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShareModule } from "src/app/shared/share.module";
import { IDSEComponent } from "src/app/modules/IMSS/IDSE/idse/idse.component";
import { imssRoutingModule } from "src/app/modules/IMSS/imss-routing.module";
import { SuaComponent } from "src/app/modules/IMSS/sua/sua/sua.component";
import { VariabilidadComponent } from "src/app/modules/IMSS/variabilidad/variabilidad/variabilidad.component";
import { ConfrontaComponent } from './confronta/confronta/confronta.component';
import { DetalleconfrontaComponent } from './confronta/detalleconfronta/detalleconfronta.component';
import { TooltipModule } from 'ng-uikit-pro-standard';


@NgModule({
    declarations:[IDSEComponent, SuaComponent, VariabilidadComponent, ConfrontaComponent, DetalleconfrontaComponent],
    imports:[CommonModule,FormsModule,imssRoutingModule, TooltipModule,ShareModule, ReactiveFormsModule]
    })
export class imssModule{

}