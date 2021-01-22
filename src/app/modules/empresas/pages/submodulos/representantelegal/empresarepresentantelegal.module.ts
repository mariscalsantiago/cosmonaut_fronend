import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { empresaRepresentanteLegalRoutingModule } from "./empresarepresentantelegal-routing.module";
import { DetallerepresentantelegalComponent } from "./pages/detallerepresentantelegal/detallerepresentantelegal.component";
import { ListarepresentantelegalComponent } from "./pages/listarepresentantelegal/listarepresentantelegal.component";

@NgModule({
   declarations:[DetallerepresentantelegalComponent,ListarepresentantelegalComponent],
   imports:[CommonModule,empresaRepresentanteLegalRoutingModule]
})
export class empresaRepresentanteLegalModule{

}