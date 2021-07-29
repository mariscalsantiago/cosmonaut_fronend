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
            {
                path: 'perfil', component: EmpleadoComponent, children: [
                    { path: ':id', loadChildren: () => import('../empleados/pages/submodulos/personal/empleados-personal.module').then(m => m.EmpleadosPersonalModule) },
                    { path: ':id', loadChildren: () => import('../empleados/pages/submodulos/empleo/empleados-empleo.module').then(m => m.empleadosEmpleoModule) },
                    { path: ':id', loadChildren: () => import('../empleados/pages/submodulos/pagos/empleados-pagos.module').then(m => m.empleadosPagosModule) },
                    { path: ':id', loadChildren: () => import('../empleados/pages/submodulos/eventos/empleados-eventos.module').then(m => m.empleadosEventosModule) },
                    { path: ':id', loadChildren: () => import('../empleados/pages/submodulos/documentos/empleados-documentos.module').then(m => m.empleadosDocumentosModule) },
                    { path: ':id', loadChildren: () => import('../empleados/pages/submodulos/kardex/empleados-kardex.module').then(m => m.empleadosKardexModule) }
                ]
            },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)]
})
export class kiosmoRoutingModule {

}