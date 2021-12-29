import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { empleadosRoutingModule } from './empleados-routing.module';
import { ListaempleadosComponent } from './pages/listaempleados/listaempleados.component';
import { EmpleadoComponent } from './pages/empleado/empleado.component';
import { ShareModule } from 'src/app/shared/share.module';
import { FormEmpleadoComponent } from './pages/form-empleado/form-empleado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InformacionbasicaComponent } from './pages/form-empleado/pestañas/informacionbasica/informacionbasica.component';
import { DomicilioComponent } from './pages/form-empleado/pestañas/domicilio/domicilio.component';
import { PreferenciasComponent } from './pages/form-empleado/pestañas/preferencias/preferencias.component';
import { EmpleoComponent } from './pages/form-empleado/pestañas/empleo/empleo.component';
import { DetalleComponent } from './pages/form-empleado/pestañas/detalle/detalle.component';
import { FormBajaEmpleadoComponent } from './pages/form-baja-empleado/form-baja-empleado.component';
import { EmpleadosIncompletosComponent } from './pages/empleados-incompletos/empleados-incompletos.component';
import { CargaMasivaComponent } from './pages/carga-masiva/carga-masiva.component';
import { TooltipModule } from 'ng-uikit-pro-standard';
import { DocumentosComponent } from './pages/form-empleado/pestañas/documentos/documentos.component';


@NgModule({
    declarations: [ListaempleadosComponent, EmpleadoComponent, FormEmpleadoComponent, InformacionbasicaComponent, DomicilioComponent, PreferenciasComponent, EmpleoComponent,
                   DetalleComponent, FormBajaEmpleadoComponent, EmpleadosIncompletosComponent, CargaMasivaComponent, DocumentosComponent],
    imports: [
      CommonModule,
      empleadosRoutingModule,
      ShareModule,
      FormsModule,
      ReactiveFormsModule,
      HttpClientModule,
      TooltipModule
      
    ],
    providers: []
  })
  export class EmpleadosModule { }
