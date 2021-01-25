import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListarepresentantelegalComponent } from "./pages/listarepresentantelegal/listarepresentantelegal.component";
import { DetallerepresentantelegalComponent } from "./pages/detallerepresentantelegal/detallerepresentantelegal.component";
const rutas:Routes = [{
    path:'',
    children:[
        {
            path:'representantelegal',
            component:ListarepresentantelegalComponent
        },
        {
            path:'representantelegal/nuevo',
            component:DetallerepresentantelegalComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class empresaRepresentanteLegalRoutingModule {

}