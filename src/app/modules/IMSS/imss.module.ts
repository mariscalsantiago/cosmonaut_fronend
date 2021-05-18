import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ShareModule } from "src/app/shared/share.module";
import { IDSEComponent } from "./idse/idse/idse.component";
import { SuaComponent } from "./sua/sua/sua.component";
import { imssRoutingModule } from './imss-routing.module';




@NgModule({
    declarations:[IDSEComponent, SuaComponent],
    imports:[CommonModule,FormsModule,imssRoutingModule,ShareModule]
})
export class imssModule{

}