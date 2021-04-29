import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ShareModule } from "src/app/shared/share.module";
import { empleadosDocumentosRoutingModule } from "./empleados-documentos-routing.module";
import { DocumentosComponent } from './pages/documentos/documentos.component';

@NgModule({
    declarations:[ DocumentosComponent],
    imports: [CommonModule, empleadosDocumentosRoutingModule, FormsModule,ReactiveFormsModule, HttpClientModule,ShareModule],
    providers:[]
    
})
export class empleadosDocumentosModule{

}