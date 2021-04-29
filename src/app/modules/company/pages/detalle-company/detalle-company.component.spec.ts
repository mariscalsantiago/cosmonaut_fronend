import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { CompanyService } from "../../services/company.service";
import { DetalleCompanyComponent } from "./detalle_company.component";
import { RouterTestingModule } from '@angular/router/testing';



import { of } from "rxjs";
import { ShareModule } from "src/app/shared/share.module";


class routerFake {
    public navitate(params: any) {

    }
}


describe('componente-clientedetalle INSERTAR CLIENTE', () => {
    let componenteDetalle: DetalleCompanyComponent;
    let fixed: ComponentFixture<DetalleCompanyComponent>;
    let router: Router;
    let objenviar: any;





    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DetalleCompanyComponent],
            imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule.withRoutes([]),ShareModule],
            providers: [CompanyService, { provider: Router, useClass: routerFake }, {
                provide: ActivatedRoute,
                useValue: {
                    params: of({ tipoinsert: 'nuevo' }),
                }
            }]
        }).compileComponents();


    }));

    beforeEach(() => {
        fixed = TestBed.createComponent(DetalleCompanyComponent);
        history.pushState({ data: undefined, company: [] }, "data")
        componenteDetalle = fixed.componentInstance;
        fixed.detectChanges();
    });


//     it('Creación del componente', () => {
//         expect(componenteDetalle).toBeTruthy();
//     });

//     it('Campos necesarios para insertar cliente', () => {

//         expect(componenteDetalle.myFormcomp.contains("nombre")).toBeTruthy();
//         expect(componenteDetalle.myFormcomp.contains("razonSocial")).toBeTruthy();
//         expect(componenteDetalle.myFormcomp.contains("rfc")).toBeTruthy();
//         expect(componenteDetalle.myFormcomp.contains("emailCorp")).toBeTruthy();
      

//     });

//     it('validación de campos necesarios al insertar cliente',()=>{
//         let myFormcomp = componenteDetalle.myFormcomp;

//         let nombre = myFormcomp.get("nombre");
//         nombre?.setValue("ASG FRONT TEST");
//         expect(nombre?.valid).toBeTruthy();

//         let razonSocial = myFormcomp.get("razonSocial");
//         razonSocial?.setValue("ASG FRONT TEST");
//         expect(razonSocial?.valid).toBeTruthy();

//         let emailCorp = myFormcomp.get("emailCorp");
//         emailCorp?.setValue("rauljam@gmail.com");
//         expect(emailCorp?.valid).toBeTruthy();

//         let rfc = myFormcomp.get("rfc");
//         rfc?.setValue("JARR8507058E1");
//         expect(rfc?.valid).toBeTruthy();


//     });

//     /*it('redireccionamineto_cancelarCliente', () => {

//         const router = TestBed.get(Router);

//         const spy = spyOn(router, 'navigate');
//         componenteDetalle.cancelarcomp;
//         expect(spy).toHaveBeenCalledWith(['/company']);

//     });*/


//     it('Enviando undefined una cliente nueva', () => {

//         expect(componenteDetalle.objCompany).toEqual({});

//     });

//     it('verificando myFormcomp no ser nulo', () => {
//         expect(componenteDetalle.myFormcomp).not.toBeNull();
//     });




// });


// describe('componente-clientedetalle ACTUALIZAR cliente',()=>{


//     let componenteDetalle:DetalleCompanyComponent;

//     const objenviar = {
//         nombre: '',
//         razonSocial: '',
//         rfc: 'JARR8507058Q3',
//         emailCorp: 'raul@gmail.com',
//         fechaAlta: 1610517600000,
//         esActivo: 1,
//         centrocClienteId: 12
        
//     };



//     beforeEach(async(()=>{
//         TestBed.configureTestingModule({
//             declarations: [DetalleCompanyComponent],
//             imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule.withRoutes([])],
//             providers: [CompanyService, {
//                 provide: ActivatedRoute,
//                 useValue: {
//                     params: of({ tipoinsert: 'modifica' }),
//                 }
//             }]
//         }).compileComponents();
//     }));

//     beforeEach(()=>{
//         let fixed = TestBed.createComponent(DetalleCompanyComponent);
//         componenteDetalle = fixed.componentInstance;
//         history.pushState({data:objenviar,company:[]},"data")

//         fixed.detectChanges();
//     });


//     it('Se visualiza formulario para editar cliente', () => {

//         let mensaje: string = componenteDetalle.strTitulo;

        
//         let insertar: boolean = componenteDetalle.insertar;

//         expect(mensaje).toBe("¿Deseas actualizar la cliente?");
//         expect(insertar).not.toBeTruthy();

//     });  


//     /*it('verificacion de objeto enviado al formulario del detalle de una cliente',()=>{
//           expect(componenteDetalle.objCompany).toEqual(objenviar);
//     });*/


//     it('verificando myFormcomp no ser nulo', () => {
//         expect(componenteDetalle.myFormcomp).not.toBeNull();
//     });

})
