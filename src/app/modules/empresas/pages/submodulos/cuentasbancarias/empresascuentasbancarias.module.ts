import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { empresasCuentasBancariasRoutingModule } from "./empresascuentasbancarias-routing.module";
import { ListascuentasbancariasComponent } from './pages/listascuentasbancarias/listascuentasbancarias.component';
import { DetallecuentasbancariasComponent } from './pages/detallecuentasbancarias/detallecuentasbancarias.component';

@NgModule({
    imports:[CommonModule,empresasCuentasBancariasRoutingModule],
    declarations: [ListascuentasbancariasComponent, DetallecuentasbancariasComponent]
})
export class empresasCuentasBancariasModule{

}