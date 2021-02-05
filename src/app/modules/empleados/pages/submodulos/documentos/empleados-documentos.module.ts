import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { empleadosDocumentosRoutingModule } from "./empleados-documentos-routing.module";
import { DocumentosComponent } from './pages/documentos/documentos.component';

@NgModule({
    declarations:[ DocumentosComponent],
    imports:[CommonModule,empleadosDocumentosRoutingModule],
    providers:[]
    
})
export class empleadosDocumentosModule{

}