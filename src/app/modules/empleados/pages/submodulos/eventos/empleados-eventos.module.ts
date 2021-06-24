import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { empleadosEventosRoutingModule } from "./empleados-eventos-routing.module";
import { EventosComponent } from './pages/eventos/eventos.component';
import { ShareModule } from '../../../../../shared/share.module';

@NgModule({
    imports:[CommonModule,FormsModule,ReactiveFormsModule,empleadosEventosRoutingModule,ShareModule],
    declarations: [EventosComponent]
})
export class empleadosEventosModule{

}