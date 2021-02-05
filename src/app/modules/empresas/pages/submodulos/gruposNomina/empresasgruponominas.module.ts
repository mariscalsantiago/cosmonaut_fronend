import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShareModule } from "src/app/shared/share.module";
import { empresasGrupoNominasModuleRouting } from "./empresasgruponominas-routing.module";
import { DetallegruponominaComponent } from "./pages/detallegruponomina/detallegruponomina.component";
import { ListagruposnominasComponent } from "./pages/listagruposnominas/listagruposnominas.component";
import { GruponominasService } from "./services/gruponominas.service";


@NgModule({
    declarations:[ListagruposnominasComponent,DetallegruponominaComponent],
    imports:[CommonModule,FormsModule,ReactiveFormsModule,empresasGrupoNominasModuleRouting,ShareModule],
    providers:[GruponominasService]
})
export class empresasGrupoNominasModule{

}