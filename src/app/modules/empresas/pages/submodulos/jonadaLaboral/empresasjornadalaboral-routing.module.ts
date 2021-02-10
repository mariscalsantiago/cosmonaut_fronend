import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetallejornadalaboralComponent } from "./pages/detallejornadalaboral/detallejornadalaboral.component";
import { ListajornadalaboralComponent } from "./pages/listajornadalaboral/listajornadalaboral.component";



const rutas:Routes = [

    { path:'',children:[

        {

            path:'jornadalaboral',component:ListajornadalaboralComponent,
        },
        {

            path:'jornadalaboral/:tipoinsert',component:DetallejornadalaboralComponent,
        }

    ] }

];

@NgModule({
    imports:[RouterModule.forChild(rutas)]
})
export class empresasJornadaLaboralModuleRouting{

}