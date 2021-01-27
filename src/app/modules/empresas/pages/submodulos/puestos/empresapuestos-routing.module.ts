import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListapuestosComponent } from "./pages/listapuestos/listapuestos.component";
import { DetallepuestosComponent } from "./pages/detallepuestos/detallepuestos.component";
const rutas:Routes = [{
    path:'',
    children:[
        {
            path:'puestos',
            component:ListapuestosComponent
        },
        {
            path:'puestos/nuevo',
            component:DetallepuestosComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class empresapuestosRoutingModule {

}