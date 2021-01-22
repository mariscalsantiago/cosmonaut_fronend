import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ListacontactosrrhComponent } from "./pages/listacontactosrrh/listacontactosrrh.component";


const rutas:Routes = [{
    path:'',children:[{path:'contactosrrh',component:ListacontactosrrhComponent}]
}];

@NgModule({
    imports:[RouterModule.forChild(rutas)]
})
export class empresasContactosRrhRouting{

}