import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DetalleUsuarioComponent } from "./detalle-usuario.component";


xdescribe('validando formilarios',()=>{

    let claseUsuarioComponent:DetalleUsuarioComponent;
    let fixed:ComponentFixture<DetalleUsuarioComponent>;
    


    beforeEach(()=> {

        TestBed.configureTestingModule({
            declarations:[DetalleUsuarioComponent]
        });


        fixed = TestBed.createComponent(DetalleUsuarioComponent);
        claseUsuarioComponent = fixed.componentInstance;
        
    });


})