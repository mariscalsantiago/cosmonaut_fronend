import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleempresasComponent } from './pages/detalleempresas/detalleempresas.component';
import { EmpresasComponent } from './pages/empresas/empresas.component';
import { ListaEmpresasComponent } from './pages/listaempresas/listaempresas.component';
import { SedeComponent } from './pages/empresas/pestañas/domicilio/sede/sede.component';
import { CuentasComponent } from './pages/empresas/pestañas/datosbancarios/cuentas/cuentas.component';
import { MovimientosComponent } from './pages/movimientos/movimientos/movimientos.component';


const routes: Routes = [{
  path:'',
  children:[
    {
       path:'listaempresas',
       component:ListaEmpresasComponent
    },
    {
      path: 'listaempresas/empresas/:tipoinsert',
      component: EmpresasComponent
    },
    {
      path: 'listaempresas/empresas/nuevo/sede',
      component: SedeComponent
      
    },
    {
      path: 'listaempresas/empresas/nuevo/cuenta',
      component: CuentasComponent
      
    },
    {
      path: 'movimientosbitacora',
      component: MovimientosComponent
      
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/contactosRRH/empresascontactosrrh.module").then(m => m.empresasContactosRrhModule)
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/cuentasbancarias/empresascuentasbancarias.module").then(m => m.empresasCuentasBancariasModule)
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/representantelegal/empresarepresentantelegal.module").then(m => m.empresaRepresentanteLegalModule)
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/apoderadoLegal/empresaapoderadoLegal.module").then(m => m.empresaApoderadoLegalModule)
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/puestos/empresapuestos.module").then(m => m.empresapuestosModule)
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/politicas/empresapoliticas.module").then(m => m.empresapoliticasModule)
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/gruposNomina/empresasgruponominas.module").then(m => m.empresasGrupoNominasModule)
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/jonadaLaboral/empresasjornadalaboral.module").then(m => m.empresasJornadaLaboralModule)
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/conceptos/empresasconceptos.module").then(m => m.empresasConceptosModule)
    },
    {
      path: 'empresa/detalle/:id',
      component: DetalleempresasComponent,loadChildren:()=> import("./pages/submodulos/tablavalores/empresastablavalores.module").then(m => m.empresasTablaValoresModule)
    }

    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class EmpresasRoutingModule { }