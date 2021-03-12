import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { empresasConceptosRoutingModule } from "./empresasconceptos-routing.module";
import { ListasconceptospercepcionesComponent } from './pages/listasconceptospercepciones/listasconceptospercepciones.component';
import { DetalleconceptospercepcionesComponent } from './pages/detalleconceptospercepciones/detalleconceptospercepciones.component';
import { DetalleconceptosdeduccionesComponent } from './pages/detalleconceptosdeducciones/detalleconceptosdeducciones.component';
import { ShareModule } from "src/app/shared/share.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConceptosService } from "./services/conceptos.service";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    imports:[CommonModule,empresasConceptosRoutingModule,ShareModule,FormsModule,ReactiveFormsModule,
    HttpClientModule],
    declarations: [ListasconceptospercepcionesComponent, DetalleconceptospercepcionesComponent,DetalleconceptosdeduccionesComponent],
    providers:[ConceptosService]
})
export class empresasConceptosModule{

}