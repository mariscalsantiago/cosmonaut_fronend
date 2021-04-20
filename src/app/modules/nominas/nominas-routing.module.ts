import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NominaComponent } from "./pages/activa/nomina/nomina.component";
import { NominasActivasComponent } from "./pages/activa/nominas-activas/nominas-activas.component";
import { NominaHistoricasComponent } from "./pages/nomina-historicas/nomina-historicas.component";


const rutas: Routes = [
    {
        path: '', children: [
            { path: 'activas', component: NominasActivasComponent },
            { path: 'nomina', component: NominaComponent },
            { path: 'historicas', component: NominaHistoricasComponent }
        ]
    }
]


@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class nominasRoutingModule {

}