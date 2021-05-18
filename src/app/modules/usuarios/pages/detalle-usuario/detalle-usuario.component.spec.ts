import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { UsuarioService } from "../../services/usuario.service";
import { DetalleUsuarioComponent } from "./detalle-usuario.component";
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../../usuarios-routing.module';
import { LISTACOMPANY,LISTAUSUARIOS } from '../../../../core/data/datosmock';



import { of } from "rxjs";
import { ShareModule } from "src/app/shared/share.module";
import { LOCALE_ID } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";


class routerFake {
    public navitate(params: any) {

    }
}


let clonar = (datos:any)=>{
    let json = JSON.stringify(datos);
    return JSON.parse(json);
}

describe('componente-usuariodetalle INSERTAR USUARIOS', () => {
    let componenteDetalle: DetalleUsuarioComponent;
    let fixed: ComponentFixture<DetalleUsuarioComponent>;
    let router: Router;
    let objenviar: any;
    let routerActivePrd: ActivatedRoute;


    let  usuariosPrd:UsuarioService;


    let listaCompanias:any;
    let listausuarios:any;


  
    beforeEach(waitForAsync(() => {

        TestBed.configureTestingModule({
            declarations: [DetalleUsuarioComponent],
            imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule.withRoutes(routes),ShareModule],
            providers: [UsuarioService, { provider: Router, useClass: routerFake }, {
                provide: ActivatedRoute,
                useValue: {
                    params: of({ idUsuario: '743' }),
                }
            },{
                provide: LOCALE_ID, useValue: 'es-MX'
            }]
        }).compileComponents().then(()=>{
            fixed = TestBed.createComponent(DetalleUsuarioComponent);
            componenteDetalle = fixed.componentInstance;
            usuariosPrd =  TestBed.inject(UsuarioService);
            router = TestBed.inject(Router);
            listaCompanias = clonar(LISTACOMPANY);
            listausuarios = clonar(LISTAUSUARIOS);
            routerActivePrd = TestBed.inject(ActivatedRoute);
        });


       
    }));

    it("Creación del componente",()=>{
        expect(componenteDetalle).toBeTruthy();
    });

    it('Inicializaciòn del componte alta de usuarios sin lista de compañías', fakeAsync(() => {
        
        history.pushState({data:objenviar,company:undefined},"data");
        let metodo1 = spyOn(componenteDetalle,"verificarCompaniasExista").and.callThrough();
        let metodo2 = spyOn(componenteDetalle,"cancelar").and.callThrough();
        fixed.detectChanges();
        expect(metodo1).toHaveBeenCalled();
        expect(metodo2).toHaveBeenCalled();
   
    }));
    it('Inicializaciòn del componte alta de usuarios con lista de compañías', fakeAsync(() => {
        
        // history.pushState({data:objenviar,company:listaCompanias.datos},"data");
        // let metodo1 = spyOn(componenteDetalle,"verificarCompaniasExista").and.callThrough();
        // let metodo2 = spyOn(usuariosPrd,"getById");
        // fixed.detectChanges();
        // expect(metodo1).toHaveBeenCalled();
        // expect(metodo2).toHaveBeenCalled();
        
        expect(false).not.toBe(true);
   
    }));

//     it('validación de campos necesarios al insertar usuario',()=>{
//         let myform = componenteDetalle.myForm;
// expect(componenteDetalle.myForm.contains("nombre")).toBeTruthy();
// expect(componenteDetalle.myForm.contains("apellidoPat")).toBeTruthy();
// expect(componenteDetalle.myForm.contains("apellidoMat")).toBeTruthy();
// expect(componenteDetalle.myForm.contains("curp")).toBeTruthy();
// expect(componenteDetalle.myForm.contains("emailCorp")).toBeTruthy();
// expect(componenteDetalle.myForm.contains("ciEmailPersonal")).toBeTruthy();
// expect(componenteDetalle.myForm.contains("ciTelefono")).toBeTruthy();
// expect(componenteDetalle.myForm.contains("ciEmailPersonal")).toBeTruthy();
// expect(componenteDetalle.myForm.contains("celular")).toBeTruthy();
// expect(componenteDetalle.myForm.controls.fechaAlta).toBeTruthy();
// expect(componenteDetalle.myForm.contains("centrocClienteId")).toBeTruthy();
//         //Validación de mis campos

//         let nombre = myform.get("nombre");
//         nombre?.setValue("santiago");
//         expect(nombre?.valid).toBeTruthy();

//         let apellido = myform.get("apellidoPat");
//         apellido?.setValue("Mariscal");
//         expect(apellido?.valid).toBeTruthy();

//         let emailCorp = myform.get("emailCorp");
//         emailCorp?.setValue("santiagoantoniomariscal@gmail.com");
//         expect(emailCorp?.valid).toBeTruthy();

//         let ciEmailPersonal = myform.get("ciEmailPersonal");
//         ciEmailPersonal?.setValue("santiagoantoniomariscal@gmail.com");
//         expect(ciEmailPersonal?.valid).toBeTruthy();

//         let ciTelefono = myform.get("ciTelefono");
//         ciTelefono?.setValue("3321496475");
//         expect(ciTelefono?.valid).toBeTruthy();


//     });

//     it('validacion de campos no necesarios para insertar un usuario',()=>{
//         let myform = componenteDetalle.myForm;

//          //Validación de campos no necesarios

//          let apellidoMat = myform.get("apellidoMat");
//          apellidoMat?.setValue("");
//          expect(apellidoMat?.valid).toBeTruthy();

//          let curp = myform.get("curp");
//          curp?.setValue("");
//          expect(curp?.valid).toBeTruthy();
//     });

//     it('validación de la CURP',()=>{
//         let myform = componenteDetalle.myForm;

//         //Validación de campos no necesarios

//         let apellidoMat = myform.get("curp");
//         apellidoMat?.setValue("AOMS970119HJCNRN02");
//         expect(apellidoMat?.valid).toBeTruthy();
//     });

//     it('redireccionamineto_cancelar', () => {

//         const router = TestBed.get(Router);

//         const spy = spyOn(router, 'navigate');
//         componenteDetalle.cancelar();
//         expect(spy).toHaveBeenCalledWith(['/usuarios']);

//     });


//     it('Enviando undefined en usuario nuevo', () => {

//         expect(componenteDetalle.objusuario).toEqual({});

//     });

//     it('verificando myform no ser nulo', () => {
//         expect(componenteDetalle.myForm).not.toBeNull();
//     });




// });


// describe('componente-usuariodetalle ACTUALIZAR USUARIO',()=>{


//     let componenteDetalle:DetalleUsuarioComponent;
//     const objenviar = {
//         nombre: '',
//         apellidoPat: '',
//         apellidoMat: '',
//         curp: '',
//         emailCorp: '',
//         ciEmailPersonal: '',
//         ciTelefono: '',
//         fechaAlta: '2007/05/01',
//         tipoPersonaId: 1,
//         representanteLegalCentrocClienteId: 1,
//         esActivo: 1,
//         personaId: 2


//     };



//     beforeEach(async(()=>{
//         TestBed.configureTestingModule({
//             declarations: [DetalleUsuarioComponent],
//             imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule.withRoutes([])],
//             providers: [UsuarioService, {
//                 provide: ActivatedRoute,
//                 useValue: {
//                     params: of({ tipoinsert: 'update' }),
//                 }
//             }]
//         }).compileComponents();
//     }));

//     beforeEach(()=>{
//         let fixed = TestBed.createComponent(DetalleUsuarioComponent);
//         componenteDetalle = fixed.componentInstance;
//         history.pushState({data:objenviar,company:[]},"data")

//         fixed.detectChanges();
//     });


//     it('Se visualiza formulario para editar usuario', () => {



//         let mensaje: string = componenteDetalle.strTitulo;

        
//         let insertar: boolean = componenteDetalle.insertar;

//         expect(mensaje).toBe("¿Deseas actualizar el usuario?");
//         expect(insertar).not.toBeTruthy();

//     });  


//     it('verificacion de objeto enviado al formulario del detalle de un usuario',()=>{
//         
//         
//           expect(componenteDetalle.objusuario).toEqual(objenviar);
//     });


//     it('verificando myform no ser nulo', () => {
//         expect(componenteDetalle.myForm).not.toBeNull();
//     });


//     it('enviando peticion verificando variables',()=>{
//         componenteDetalle.enviarPeticion();


//         expect(componenteDetalle.iconType).toBe("warning");
//         expect(componenteDetalle.strsubtitulo).toBe("Una vez aceptando los cambios seran efectuados");
//         expect();

//     });





})



