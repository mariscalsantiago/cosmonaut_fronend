import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShareModule } from "src/app/shared/share.module";
import { empresasJornadaLaboralModuleRouting } from "./empresasjornadalaboral-routing.module";
import { DetallejornadalaboralComponent } from "./pages/detallejornadalaboral/detallejornadalaboral.component";
import { ListajornadalaboralComponent } from "./pages/listajornadalaboral/listajornadalaboral.component";
import { JornadalaboralService } from "./services/jornadalaboral.service";
import { TooltipModule } from 'ng-uikit-pro-standard';


@NgModule({
    declarations:[ListajornadalaboralComponent,DetallejornadalaboralComponent],
    imports:[CommonModule,FormsModule,ReactiveFormsModule,empresasJornadaLaboralModuleRouting,TooltipModule,ShareModule],
    providers:[JornadalaboralService]
})
export class empresasJornadaLaboralModule{

}