import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetalleconceptospercepcionesComponent } from "./pages/detalleconceptospercepciones/detalleconceptospercepciones.component";
import { DetalleconceptosdeduccionesComponent } from "./pages/detalleconceptosdeducciones/detalleconceptosdeducciones.component";
import { ListasconceptospercepcionesComponent } from "./pages/listasconceptospercepciones/listasconceptospercepciones.component";


const rutas:Routes = [{
    path:'',children:[
        {path:'conceptos',component:ListasconceptospercepcionesComponent},
        {path:'conceptosPercepciones/:tipoinsert',component:DetalleconceptospercepcionesComponent},
        {path:'conceptosDeducciones/:tipoinsert',component:DetalleconceptosdeduccionesComponent}

    ]
}];

@NgModule({
    imports:[RouterModule.forChild(rutas)]
})
export class empresasConceptosRoutingModule{

}