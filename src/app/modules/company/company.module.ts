import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './pages/company/company.component';
import { companyRoutingModule } from './company-routing.module';
import { ShareModule } from 'src/app/shared/share.module';



@NgModule({
  declarations: [CompanyComponent],
  imports: [
    CommonModule,
    companyRoutingModule,
    ShareModule
  ]
})
export class CompanyModule { }
