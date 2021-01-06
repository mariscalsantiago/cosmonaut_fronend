import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login/login.component';


import { AuthRoutingModule } from './auth-routing.module';
import { SolicitarComponent } from './pages/solicitar/solicitar.component';



@NgModule({
  declarations: [LoginComponent, SolicitarComponent],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
