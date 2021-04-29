import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { empleadosEventosRoutingModule } from "./empleados-eventos-routing.module";
import { EventosComponent } from './pages/eventos/eventos.component';

@NgModule({
    imports:[CommonModule,FormsModule,ReactiveFormsModule,empleadosEventosRoutingModule],
    declarations: [EventosComponent]
})
export class empleadosEventosModule{

}