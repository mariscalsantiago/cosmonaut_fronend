import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NominaComponent } from "./pages/activa/nomina/nomina.component";
import { NominasActivasComponent } from "./pages/activa/nominas-activas/nominas-activas.component";
import { NominaCalculadoraComponent } from "./pages/nomina-calculadora/nomina-calculadora.component";
import { NominaExtraordinariaComponent } from "./pages/nomina-extraordinaria/nominas-extraordinarias-activas/nomina-extraordinaria.component";
import { NominaDFiniquitoliquidacionActivasComponent } from "./pages/nomina-finiquitoliquidacion/nomina-dfiniquitoliquidacion-activas/nomina-dfiniquitoliquidacion-activas.component";
import { NominaHistoricasComponent } from "./pages/nomina-historicas/nomina-historicas.component";
import { NominaPTUComponent } from "./pages/nomina-ptu/nominas-ptu-activas/nomina-ptu.component";
import { PPPComponent } from "./pages/ppp/ppp/ppp.component";


const rutas: Routes = [
    {
        path: '', children: [
            { path: 'activas', component: NominasActivasComponent },
            { path: 'nomina', component: NominaComponent },
            { path: 'historicas', component: NominaHistoricasComponent },
            { path: 'nomina_extraordinaria', component: NominaExtraordinariaComponent },
            { path: 'finiquito_liquidacion', component: NominaDFiniquitoliquidacionActivasComponent },
            { path: 'calculadora', component: NominaCalculadoraComponent },
            { path: 'ptu', component: NominaPTUComponent },
            { path: 'ppp', component: PPPComponent }
        ]
    }
]


@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class nominasRoutingModule {

}