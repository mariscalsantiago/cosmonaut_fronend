import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IDSEComponent } from "./idse/idse/idse.component";
import { SuaComponent } from "./sua/sua/sua.component";




const rutas: Routes = [
    {
        path: '',
        children: [
            { path: 'idse', 
            component: IDSEComponent },
            { path: 'sua', 
            component: SuaComponent }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class imssRoutingModule {

}