import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetalleconceptospercepcionesComponent } from "./pages/detalleconceptospercepciones/detalleconceptospercepciones.component";
import { ListasconceptospercepcionesComponent } from "./pages/listasconceptospercepciones/listasconceptospercepciones.component";

const rutas:Routes = [{
    path:'',children:[
        {path:'conceptos',component:ListasconceptospercepcionesComponent},
        {path:'conceptos/:tipoinsert',component:DetalleconceptospercepcionesComponent}
    ]
}];

@NgModule({
    imports:[RouterModule.forChild(rutas)]
})
export class empresasConceptosRoutingModule{

}