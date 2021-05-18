import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShareModule } from "src/app/shared/share.module";
import { empleadosKardexRoutingModule } from "./empleados-kardex-routing.module";
import { KardexComponent } from './pages/kardex/kardex.component';

@NgModule({
    declarations:[ KardexComponent],
    imports:[CommonModule,empleadosKardexRoutingModule,FormsModule,ReactiveFormsModule,ShareModule],
    providers:[]
    
})
export class empleadosKardexModule{

}