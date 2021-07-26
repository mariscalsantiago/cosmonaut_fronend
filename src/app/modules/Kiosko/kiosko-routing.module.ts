import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EmpleadoComponent } from "../empleados/pages/empleado/empleado.component";
import { ExpedienteComponent } from "./pages/expediente/expediente.component";
import { TimbradoEmpleadosComponent } from "./pages/timbrado-empleados/timbrado-empleados.component";

const routes: Routes = [
    {
        path: '', children: [
            { path: 'expediente', component: ExpedienteComponent },
            { path: 'timbrados', component: TimbradoEmpleadosComponent },
            { path: 'perfil', component: EmpleadoComponent },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class kiosmoRoutingModule {

}