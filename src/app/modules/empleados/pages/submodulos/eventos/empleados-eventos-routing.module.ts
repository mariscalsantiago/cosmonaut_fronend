import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EventosComponent } from "./pages/eventos/eventos.component";


const rutas:Routes = [

    {path:'',children:[
        {path:'eventos',component:EventosComponent}
    ]}

];

@NgModule({

    imports:[RouterModule.forChild(rutas)]

})
export class empleadosEventosRoutingModule{

}