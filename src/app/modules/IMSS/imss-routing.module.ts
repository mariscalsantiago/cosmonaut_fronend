import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IdseDetalleComponent } from "./IDSE/idse-detalle/idse-detalle.component";
import { IDSEComponent } from "./IDSE/idse/idse.component";


const rutas: Routes = [
    {
        path: '', children: [
            { path: 'idse', component: IDSEComponent },
            { path: 'idse/:id/detalle', component: IdseDetalleComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class imssRoutingModule {

}