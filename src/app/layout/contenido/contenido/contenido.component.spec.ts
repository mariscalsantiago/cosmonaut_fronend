import { async, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { RouterOutlet } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ContenidoComponent } from "./contenido.component";


describe('verificacion outlet en contenido',()=>{


    beforeEach(async(()=>{
        TestBed.configureTestingModule({

            declarations:[ContenidoComponent],
            imports:[RouterTestingModule.withRoutes([])]

        }).compileComponents();
    }));


    it('verificando que exista el router-outlet',()=>{
         

        const fixture = TestBed.createComponent(ContenidoComponent);

        const debugg = fixture.debugElement.query(By.directive(RouterOutlet));


        expect(debugg).not.toBeNull();

    });


});