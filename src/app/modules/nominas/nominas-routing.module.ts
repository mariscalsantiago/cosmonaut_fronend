import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NominaComponent } from "./pages/activa/nomina/nomina.component";
import { NominasActivasComponent } from "./pages/activa/nominas-activas/nominas-activas.component";


const rutas: Routes = [
    {
        path: '', children: [
            { path: 'activas', component: NominasActivasComponent },
            { path: 'nomina', component: NominaComponent }
        ]
    }
]


@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class nominasRoutingModule {

}