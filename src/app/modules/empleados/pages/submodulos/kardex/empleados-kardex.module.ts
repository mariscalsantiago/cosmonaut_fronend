import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { empleadosKardexRoutingModule } from "./empleados-kardex-routing.module";
import { KardexComponent } from './pages/kardex/kardex.component';

@NgModule({
    declarations:[ KardexComponent],
    imports:[CommonModule,empleadosKardexRoutingModule],
    providers:[]
    
})
export class empleadosKardexModule{

}