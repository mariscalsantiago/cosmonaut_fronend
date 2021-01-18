import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { EmpleoComponent } from "./pages/empleo/empleo.component";

 const routes:Routes=[{
     path:'',children:[
         {path:'empleo',component:EmpleoComponent}
     ]
 }];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})
export class empleadosEmpleoRoutingModule{

}