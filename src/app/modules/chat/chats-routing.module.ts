import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListachatsActivosComponent } from './pages/listachats-activos/listachats-activos.component';


const rutas:Routes = [{
  path:'',
  children:[
    {path:'bandeja',component:ListachatsActivosComponent}
  ]
}]

@NgModule({
  declarations: [],
  imports: [
     RouterModule.forChild(rutas)
  ]
})
export class ChatsRoutingModule { }
