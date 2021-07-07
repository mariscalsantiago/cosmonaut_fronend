import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { empresasTablaValoresComponentRoutingModule } from "./empresastablavalores-routing.module";
import { ListasTablaValoresComponent } from './pages/listastablavalores/listastablavalores.component';
import { ShareModule } from "src/app/shared/share.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TablaValoresService } from "./services/tablavalores.service";
import { HttpClientModule } from "@angular/common/http";
import { CoreModule } from "src/app/core/core.module";
import { TooltipModule } from 'ng-uikit-pro-standard';

@NgModule({
    imports:[CommonModule,empresasTablaValoresComponentRoutingModule,ShareModule,FormsModule,ReactiveFormsModule,
    HttpClientModule,CoreModule, TooltipModule],
    declarations: [ListasTablaValoresComponent],
    providers:[TablaValoresService]
})
export class empresasTablaValoresModule{

}