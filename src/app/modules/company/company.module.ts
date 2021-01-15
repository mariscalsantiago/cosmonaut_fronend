import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './pages/company/company.component';
import { companyRoutingModule } from './company-routing.module';
import { ShareModule } from 'src/app/shared/share.module';
import { CompanyService } from './services/company.service';
import { DetalleCompanyComponent } from './pages/detalle-company/detalle_company.component';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [DetalleCompanyComponent, CompanyComponent],
  imports: [
    CommonModule,
    companyRoutingModule,
    ShareModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule
  ],
  providers: [
    CompanyService
  ]

})
export class CompanyModule { }
