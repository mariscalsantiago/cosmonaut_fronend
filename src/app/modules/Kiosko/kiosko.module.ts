import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "src/app/core/core.module";
import { ShareModule } from "src/app/shared/share.module";
import { EmpleadoComponent } from "../empleados/pages/empleado/empleado.component";
import { kiosmoRoutingModule } from "./kiosko-routing.module";
import { ExpedienteComponent } from "./pages/expediente/expediente.component";
import { TimbradoEmpleadosComponent } from "./pages/timbrado-empleados/timbrado-empleados.component";


@NgModule({
    declarations:[ExpedienteComponent,TimbradoEmpleadosComponent,EmpleadoComponent],
    imports:[CommonModule,ReactiveFormsModule,FormsModule,CoreModule,ShareModule,
    kiosmoRoutingModule],
    
})

export class kioskoModule{
    }