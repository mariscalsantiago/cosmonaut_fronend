import { async, TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AutenticacionService } from "./autenticacion.service";


describe("modulo autenticacion del CORE",()=>{


    let services:AutenticacionService;



    beforeEach(async(()=>{


        TestBed.configureTestingModule({

            imports:[RouterTestingModule.withRoutes([])],
            providers:[AutenticacionService]

        }).compileComponents();


    }));


    beforeEach(()=>{


       services = TestBed.get(AutenticacionService);

        


    });


    it('validando que se genere el AUTH',()=>{

        expect(services).toBeTruthy();

    });
});