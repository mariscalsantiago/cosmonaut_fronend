import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShareModule } from "src/app/shared/share.module";
import { empleadosEmpleoRoutingModule } from "./empleados-empleo-routing.module";
import { EmpleoComponent } from './pages/empleo/empleo.component';

@NgModule({
    declarations: [EmpleoComponent],
    imports: [
        CommonModule,
        empleadosEmpleoRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ShareModule
    ],
    providers: []
})
export class empleadosEmpleoModule {

}