import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetallecuentasbancariasComponent } from "./pages/detallecuentasbancarias/detallecuentasbancarias.component";
import { ListascuentasbancariasComponent } from "./pages/listascuentasbancarias/listascuentasbancarias.component";

const rutas:Routes = [{
    path:'',children:[
        {path:'cuentasbancarias',component:ListascuentasbancariasComponent},
        {path:'cuentasbancarias/:tipoinsert',component:DetallecuentasbancariasComponent}
    ]
}];

@NgModule({
    imports:[RouterModule.forChild(rutas)]
})
export class empresasCuentasBancariasRoutingModule{

}