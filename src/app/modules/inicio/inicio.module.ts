import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './pages/inicio.component';
import { inicioRoutingModule } from './inicio-routing.module';
import { ShareModule } from 'src/app/shared/share.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";





@NgModule({
  declarations: [InicioComponent],
  imports:[CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,ShareModule,inicioRoutingModule]
})
export class InicioModule { }
