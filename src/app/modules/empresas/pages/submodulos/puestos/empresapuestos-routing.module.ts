import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListapuestosComponent } from "./pages/listapuestos/listapuestos.component";
import { DetallepuestosComponent } from "./pages/detallepuestos/detallepuestos.component";
import { DetallepuestosareaComponent } from "./pages/detallepuestosarea/detallepuestosarea.component"

const rutas:Routes = [{
    path:'',
    children:[
        {
            path:'area',
            component:ListapuestosComponent
        },
        {
            path:'area/:tipoinsert',
            component:DetallepuestosComponent
        },
        {
            path:'puestos/:tipoinsert',
            component:DetallepuestosareaComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class empresapuestosRoutingModule {

}