import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListaapoderadoLegalComponent } from "./pages/listaapoderadoLegal/listaapoderadoLegal.component";
import { DetalleapoderadoLegalComponent } from "./pages/detalleapoderadoLegal/detalleapoderadoLegal.component";
const rutas:Routes = [{
    path:'',
    children:[
        {
            path:'apoderadoLegal',
            component:ListaapoderadoLegalComponent
        },
        {
            path:'apoderadoLegal/:tipoinsert',
            component:DetalleapoderadoLegalComponent
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class empresaApoderadoLegalRoutingModule {

}