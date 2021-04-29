import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { empleadosKardexRoutingModule } from "./empleados-kardex-routing.module";
import { KardexComponent } from './pages/kardex/kardex.component';

@NgModule({
    declarations:[ KardexComponent],
    imports:[CommonModule,empleadosKardexRoutingModule,FormsModule,ReactiveFormsModule],
    providers:[]
    
})
export class empleadosKardexModule{

}