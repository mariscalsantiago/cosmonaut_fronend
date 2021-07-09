import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";
import { ShareModule } from "src/app/shared/share.module";
import { empresasContactosRrhRouting } from "./empresascontactosrrh-routing.module";
import { DetallecontactosrrhComponent } from "./pages/detallecontactosrrh/detallecontactosrrh.component";
import { ListacontactosrrhComponent } from "./pages/listacontactosrrh/listacontactosrrh.component";
import { UsuariocontactorrhService } from "./pages/services/usuariocontactorrh.service";
import { TooltipModule } from 'ng-uikit-pro-standard';

@NgModule({
    declarations:[ListacontactosrrhComponent,DetallecontactosrrhComponent],
    imports:[CommonModule,empresasContactosRrhRouting,FormsModule,ReactiveFormsModule,ShareModule,
    HttpClientModule, TooltipModule],
    providers:[UsuariocontactorrhService]
})
export class empresasContactosRrhModule{

}