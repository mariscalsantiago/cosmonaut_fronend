import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmpresasRoutingModule } from './empresas-routing.module';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { ListaEmpresasComponent} from './pages/listaempresas/listaempresas.component'
import { ShareModule } from 'src/app/shared/share.module';
import { DetalleempresasComponent } from './pages/detalleempresas/detalleempresas.component';
import { HttpClientModule } from '@angular/common/http';
import { InformacionempresaComponent } from './pages/empresas/pestañas/informacionempresa/informacionempresa.component';
import { DomicilioComponent } from './pages/empresas/pestañas/domicilio/domicilio.component';
import { DatosbancariosComponent } from './pages/empresas/pestañas/datosbancarios/datosbancarios.component';
import { DatosimssComponent } from './pages/empresas/pestañas/datosimss/datosimss.component';
import { SedeComponent } from './pages/empresas/pestañas/domicilio/sede/sede.component';
import { CuentasComponent } from './pages/empresas/pestañas/datosbancarios/cuentas/cuentas.component';
import { MovimientosComponent } from './pages/movimientos/movimientos/movimientos.component';


@NgModule({
    declarations: [EmpresasComponent, ListaEmpresasComponent, DetalleempresasComponent,InformacionempresaComponent,
      DomicilioComponent,DatosbancariosComponent,DatosimssComponent,SedeComponent, CuentasComponent,MovimientosComponent],
    imports: [
      CommonModule, 
      EmpresasRoutingModule,
      ReactiveFormsModule,
      ShareModule,
      FormsModule,
      HttpClientModule
    ],
    providers: []
  })
  export class EmpresasModule { }
