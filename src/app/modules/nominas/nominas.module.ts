import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { nominasRoutingModule } from "./nominas-routing.module";
import { NominasActivasComponent } from "./pages/nominas-activas/nominas-activas.component";

@NgModule({
    declarations:[NominasActivasComponent],
    imports:[CommonModule,ReactiveFormsModule,FormsModule,HttpClientModule,nominasRoutingModule]
})
export class nominasModule{

}