import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IDSEComponent } from "src/app/modules/IMSS/IDSE/idse/idse.component";
import { SuaComponent } from "src/app/modules/IMSS/sua/sua/sua.component";
import { VariabilidadComponent } from "src/app/modules/IMSS/variabilidad/variabilidad/variabilidad.component";




const rutas: Routes = [
    {
        path: '',
        children: [
            { path: 'idse', 
            component: IDSEComponent },
            { path: 'sua', 
            component: SuaComponent },
            { path: 'variabilidad', 
            component: VariabilidadComponent }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(rutas)]
})
export class imssRoutingModule {

}