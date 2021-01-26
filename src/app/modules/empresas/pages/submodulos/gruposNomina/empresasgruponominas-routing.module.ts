import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListagruposnominasComponent } from "./pages/listagruposnominas/listagruposnominas.component";



const rutas:Routes = [

    { path:'',children:[

        {

            path:'gruposnomina',component:ListagruposnominasComponent
        }

    ] }

];

@NgModule({
    imports:[RouterModule.forChild(rutas)]
})
export class empresasGrupoNominasModuleRouting{

}