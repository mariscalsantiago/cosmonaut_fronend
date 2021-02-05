import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { empleadosEmpleoRoutingModule } from "./empleados-empleo-routing.module";
import { EmpleoComponent } from './pages/empleo/empleo.component';

@NgModule({
    declarations:[EmpleoComponent],
    imports:[
        CommonModule,
        empleadosEmpleoRoutingModule
    ],
    providers:[]
})
export class empleadosEmpleoModule{

}