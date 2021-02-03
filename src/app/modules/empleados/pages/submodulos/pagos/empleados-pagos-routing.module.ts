import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PagosComponent } from "./pages/pagos/pagos.component";

const rutas: Routes = [{
    path:'',
    children:[
      {path:'pagos',component:PagosComponent}
    ]
  }];

@NgModule({
    imports:[RouterModule.forChild(rutas)]
})
export class empleadosPagosRoutingModule{

}