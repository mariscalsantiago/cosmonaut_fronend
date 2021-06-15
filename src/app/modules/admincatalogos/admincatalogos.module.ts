import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { AdminCatalogosService } from './services/admincatalogos.service';
import { CommonModule } from '@angular/common';
import { AdminCatalogosRoutingModule } from './admincatalogos-routing.module';
import { ShareModule } from 'src/app/shared/share.module';
import { DetalleAdminCatalogosComponent } from './pages/detalle-admincatalogos/detalle-admincatalogos.component';
import { AdminCatalogosComponent } from './pages/admincatalogos/admincatalogos.component';
import { CoreModule } from 'src/app/core/core.module';
import { ABCAdminCatalogosComponent  } from './pages/abc-admincatalogos/abc-admincatalogos.component';




@NgModule({
  declarations: [DetalleAdminCatalogosComponent,AdminCatalogosComponent,ABCAdminCatalogosComponent],
  imports: [
    CommonModule,
    AdminCatalogosRoutingModule,
    ShareModule,
    FormsModule,ReactiveFormsModule
  ]
})
export class AdminCatalogosModule { }
