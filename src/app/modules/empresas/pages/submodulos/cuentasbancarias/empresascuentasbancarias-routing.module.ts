import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListascuentasbancariasComponent } from "./pages/listascuentasbancarias/listascuentasbancarias.component";

const rutas:Routes = [{
    path:'',children:[
        {path:'cuentasbancarias',component:ListascuentasbancariasComponent}
    ]
}];

@NgModule({
    imports:[RouterModule.forChild(rutas)]
})
export class empresasCuentasBancariasRoutingModule{

}