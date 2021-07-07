import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { empresasCuentasBancariasRoutingModule } from "./empresascuentasbancarias-routing.module";
import { ListascuentasbancariasComponent } from './pages/listascuentasbancarias/listascuentasbancarias.component';
import { DetallecuentasbancariasComponent } from './pages/detallecuentasbancarias/detallecuentasbancarias.component';
import { ShareModule } from "src/app/shared/share.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CuentasbancariasService } from "./services/cuentasbancarias.service";
import { HttpClientModule } from "@angular/common/http";
import { TooltipModule } from 'ng-uikit-pro-standard';

@NgModule({
    imports:[CommonModule,empresasCuentasBancariasRoutingModule,ShareModule,FormsModule,ReactiveFormsModule,
    HttpClientModule, TooltipModule],
    declarations: [ListascuentasbancariasComponent, DetallecuentasbancariasComponent],
    providers:[CuentasbancariasService]
})
export class empresasCuentasBancariasModule{

}