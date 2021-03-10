import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { KardexComponent } from "./pages/kardex/kardex.component";

const routes:Routes = [{
    path:'',children:[
        {path:'kardex',component:KardexComponent}
    ]
}];

@NgModule(

    {
        imports:[RouterModule.forChild(routes)],
        exports:[RouterModule]
    }

)
export class empleadosKardexRoutingModule{

}