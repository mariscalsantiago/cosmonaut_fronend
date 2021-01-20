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


    it('inicializando la aplicación contenido',()=>{


        const fixture = TestBed.createComponent(ContenidoComponent);
        const componente = fixture.componentInstance;

        componente.ngOnInit();

        expect(componente.arreglo.length).toBeGreaterThanOrEqual(0);


    });

    it('limpiando menu y seleccionando elementos del menu',()=>{
        const fixture = TestBed.createComponent(ContenidoComponent);
        const componente = fixture.componentInstance;
        


        componente.ngOnInit();

        

        componente.limpiando();
        let validar:boolean = false;
        for(let item of componente.arreglo){

            if( item.seleccionado){
               validar = true;
               break;
            }

        }


        expect(validar).toBeFalse();


        componente.seleccionado(componente.arreglo[0]);

         validar = false;
        for(let item of componente.arreglo){

            if( item.seleccionado){
               validar = true;
               break;
            }

        }


        expect(validar).toBeTruthy();

        componente.limpiando();

        let arreglo1:any = componente.arreglo[2];
        let arreglo2 = arreglo1.submenu[2];

        componente.seleccionarSubmenu(arreglo1,arreglo2);
        
        validar = false;
        for(let item of componente.arreglo){

            if( item.seleccionado){
               validar = true;
               break;
            }

        }

        expect(validar).toBeTruthy();

    });


    


});