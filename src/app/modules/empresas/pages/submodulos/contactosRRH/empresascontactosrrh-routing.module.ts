import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetallecontactosrrhComponent } from "./pages/detallecontactosrrh/detallecontactosrrh.component";
import { ListacontactosrrhComponent } from "./pages/listacontactosrrh/listacontactosrrh.component";


const rutas:Routes = [
    {path:'',children:[
        {path:'contactosrrh',component:ListacontactosrrhComponent},
        {path:'contactosrrh/:tipoinsert',component:DetallecontactosrrhComponent}
]

}];

@NgModule({
    imports:[RouterModule.forChild(rutas)]
})
export class empresasContactosRrhRouting{

}