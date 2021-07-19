import { CommonModule, CurrencyPipe } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { nominasRoutingModule } from "./nominas-routing.module";
import { NominasActivasComponent } from "./pages/activa/nominas-activas/nominas-activas.component";
import { NominaComponent } from './pages/activa/nomina/nomina.component';
import { ShareModule } from "src/app/shared/share.module";
import { CalcularComponent } from './pages/activa/nomina/pestañas/calcular/calcular.component';
import { PagarComponent } from './pages/activa/nomina/pestañas/pagar/pagar.component';
import { TimbrarComponent } from './pages/activa/nomina/pestañas/timbrar/timbrar.component';
import { CompletarComponent } from './pages/activa/nomina/pestañas/completar/completar.component';
import { NominaHistoricasComponent } from './pages/nomina-historicas/nomina-historicas.component';
import { NominaExtraordinariaComponent } from './pages/nomina-extraordinaria/nominas-extraordinarias-activas/nomina-extraordinaria.component';
import { NominaDFiniquitoliquidacionActivasComponent } from './pages/nomina-finiquitoliquidacion/nomina-dfiniquitoliquidacion-activas/nomina-dfiniquitoliquidacion-activas.component';
import { NominaCalculadoraComponent } from './pages/nomina-calculadora/nomina-calculadora.component';
import { NominaPTUComponent } from './pages/nomina-ptu/nominas-ptu-activas/nomina-ptu.component';
import { PPPComponent } from "./pages/ppp/ppp/ppp.component";
import { CoreModule } from "src/app/core/core.module";
import { TooltipModule } from 'ng-uikit-pro-standard';

@NgModule({
    declarations:[NominasActivasComponent, NominaComponent, CalcularComponent, PagarComponent, TimbrarComponent, CompletarComponent, NominaHistoricasComponent, NominaExtraordinariaComponent, NominaDFiniquitoliquidacionActivasComponent, 
        NominaCalculadoraComponent, NominaPTUComponent, PPPComponent],
    imports:[CommonModule,ReactiveFormsModule,FormsModule,HttpClientModule,TooltipModule,nominasRoutingModule,ShareModule,CoreModule],
    providers:[CurrencyPipe]
})
export class nominasModule{
   
}