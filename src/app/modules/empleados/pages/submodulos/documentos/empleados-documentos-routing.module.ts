import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DocumentosComponent } from "./pages/documentos/documentos.component";

const routes:Routes = [{
    path:'',children:[
        {path:'documentos',component:DocumentosComponent}
    ]
}];

@NgModule(

    {
        imports:[RouterModule.forChild(routes)],
        exports:[RouterModule]
    }

)
export class empleadosDocumentosRoutingModule{

}