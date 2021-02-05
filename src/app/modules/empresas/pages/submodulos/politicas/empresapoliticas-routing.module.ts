import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListapoliticasComponent } from "./pages/listapoliticas/listapoliticas.component";
import { DetallepoliticasComponent } from "./pages/detallepoliticas/detallepoliticas.component";
const rutas:Routes = [{
    path:'',
    children:[
        {
            path:'politicas',
            component:ListapoliticasComponent
        },
        {
            path:'politicas/:tipoinsert',
            component:DetallepoliticasComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class empresapoliticasRoutingModule {

}