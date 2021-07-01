import { NgModule } from '@angular/core';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { AdminDispercionTimbradoService } from './services/admindisptimbrado.service';
import { CommonModule } from '@angular/common';
import { AdminDispercionTimbradoRoutingModule } from './admindisptimbrado-routing.module';
import { ShareModule } from 'src/app/shared/share.module';
import { AdminDispercionTimbradoComponent } from './pages/admindisptimbrado/admindisptimbrado.component';




@NgModule({
  declarations: [AdminDispercionTimbradoComponent],
  imports: [
    CommonModule,
    AdminDispercionTimbradoRoutingModule,
    ShareModule,
    FormsModule,ReactiveFormsModule
  ]
})
export class AdminCatalogosModule { }
