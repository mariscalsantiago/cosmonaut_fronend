import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { empresasGrupoNominasModuleRouting } from "./empresasgruponominas-routing.module";
import { DetallegruponominaComponent } from "./pages/detallegruponomina/detallegruponomina.component";
import { ListagruposnominasComponent } from "./pages/listagruposnominas/listagruposnominas.component";
import { GruponominasService } from "./services/gruponominas.service";


@NgModule({
    declarations:[ListagruposnominasComponent,DetallegruponominaComponent],
    imports:[CommonModule,FormsModule,ReactiveFormsModule,empresasGrupoNominasModuleRouting],
    providers:[GruponominasService]
})
export class empresasGrupoNominasModule{

}