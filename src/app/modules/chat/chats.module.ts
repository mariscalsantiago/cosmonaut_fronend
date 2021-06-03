import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListachatsActivosComponent } from './pages/listachats-activos/listachats-activos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from 'src/app/shared/share.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [ListachatsActivosComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,ShareModule,HttpClientModule
  ]
})
export class ChatsModule { }
