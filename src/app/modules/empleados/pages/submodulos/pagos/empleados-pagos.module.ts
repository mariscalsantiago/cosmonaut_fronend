import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { PagosComponent } from "./pages/pagos/pagos.component";
import { empleadosPagosRoutingModule } from './empleados-pagos-routing.module';
import { ShareModule } from "src/app/shared/share.module";

@NgModule({
    declarations: [PagosComponent],
    imports: [CommonModule, FormsModule,ReactiveFormsModule, HttpClientModule, empleadosPagosRoutingModule,ShareModule]
})
export class empleadosPagosModule {

}