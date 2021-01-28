import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetallegruponominaComponent } from "./pages/detallegruponomina/detallegruponomina.component";
import { ListagruposnominasComponent } from "./pages/listagruposnominas/listagruposnominas.component";



const rutas:Routes = [

    { path:'',children:[

        {

            path:'gruposnomina',component:ListagruposnominasComponent,
        },
        {

            path:'gruposnomina/:tipoinsert',component:DetallegruponominaComponent,
        }

    ] }

];

@NgModule({
    imports:[RouterModule.forChild(rutas)]
})
export class empresasGrupoNominasModuleRouting{

}