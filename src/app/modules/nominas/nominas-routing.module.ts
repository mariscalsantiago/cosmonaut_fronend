import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NominasActivasComponent } from "./pages/nominas-activas/nominas-activas.component";


const rutas: Routes = [
    {
        path: '', children: [
            { path: 'activas', component: NominasActivasComponent }
        ]
    }
]


@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class nominasRoutingModule {

}