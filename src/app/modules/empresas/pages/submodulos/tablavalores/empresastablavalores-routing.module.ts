import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListasTablaValoresComponent } from "./pages/listastablavalores/listastablavalores.component";

const rutas:Routes = [{
    path:'',children:[
        {path:'tablavalores',component:ListasTablaValoresComponent},
    ]
}];

@NgModule({
    imports:[RouterModule.forChild(rutas)]
})
export class empresasTablaValoresComponentRoutingModule{

}