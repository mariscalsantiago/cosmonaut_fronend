import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListarepresentantelegalComponent } from "./pages/listarepresentantelegal/listarepresentantelegal.component";
const rutas:Routes = [{
    path:'',children:[
        {path:'representantelegal',component:ListarepresentantelegalComponent}
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class empresaRepresentanteLegalRoutingModule {

}