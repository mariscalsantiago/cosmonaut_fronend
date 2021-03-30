import {  NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CalendarioComponent } from "./pages/calendario/calendario.component";

import { DetalleeventoxempleadoComponent } from "./pages/eventosxempleado/detalleeventoxempleado/detalleeventoxempleado.component";
import { ListaeventosxempledoComponent } from './pages/eventosxempleado/listaeventosxempledo/listaeventosxempledo.component';


const routes:Routes = [
    {
        path:'',children:[
            {path:'eventosxempleado',component:ListaeventosxempledoComponent},
            {path:'eventosxempleado/nuevo',component:DetalleeventoxempleadoComponent},
            {path:'calendario',component:CalendarioComponent},
        ]
    }
]

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class eventosRoutingModule{

}