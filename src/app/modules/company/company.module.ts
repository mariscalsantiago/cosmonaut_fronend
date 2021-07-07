import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './pages/company/company.component';
import { companyRoutingModule } from './company-routing.module';
import { ShareModule } from 'src/app/shared/share.module';
import { CompanyService } from './services/company.service';
import { DetalleCompanyComponent } from './pages/detalle-company/detalle_company.component';
import { DetalleContactoComponent} from './pages/detalle-contacto/detalle-contacto.component'
import { CoreModule } from 'src/app/core/core.module';
import { TooltipModule } from 'ng-uikit-pro-standard';

@NgModule({
  declarations: [DetalleContactoComponent, DetalleCompanyComponent, CompanyComponent],
  imports: [
    CommonModule,
    companyRoutingModule,
    ShareModule,
    FormsModule,
    TooltipModule,
    ReactiveFormsModule,
    CoreModule,
  ],
  providers: [
    CompanyService
  ]

})
export class CompanyModule { }
