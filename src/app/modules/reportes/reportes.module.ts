import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralesComponent } from './pages/generales/generales.component';
import { ReportesRoutingModule } from './reportes-routing.module';
import { ShareModule } from 'src/app/shared/share.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";





@NgModule({
  declarations: [GeneralesComponent],
  imports:[CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,ShareModule,ReportesRoutingModule]
})
export class ReportesModule { }

