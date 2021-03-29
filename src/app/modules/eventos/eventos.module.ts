import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { eventosRoutingModule } from "./eventos-routing.module";
import { ListaeventosxempledoComponent } from './pages/eventosxempleado/listaeventosxempledo/listaeventosxempledo.component';
import { ShareModule } from '../../shared/share.module';
import { DetalleeventoxempleadoComponent } from './pages/eventosxempleado/detalleeventoxempleado/detalleeventoxempleado.component';

@NgModule({
    declarations: [ListaeventosxempledoComponent, DetalleeventoxempleadoComponent],
    imports:[CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,eventosRoutingModule,ShareModule]
})
export class eventosModule{

}