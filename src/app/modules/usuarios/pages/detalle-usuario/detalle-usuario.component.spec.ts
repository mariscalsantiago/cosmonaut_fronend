import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { UsuarioService } from "../../services/usuario.service";
import { DetalleUsuarioComponent } from "./detalle-usuario.component";
import { RouterTestingModule } from '@angular/router/testing';



import { of } from "rxjs";


class routerFake {
    public navitate(params: any) {

    }
}


describe('componente-usuariodetalle INSERTAR USUARIOS', () => {
    let componenteDetalle: DetalleUsuarioComponent;
    let fixed: ComponentFixture<DetalleUsuarioComponent>;
    let router: Router;
    let objenviar: any;





    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DetalleUsuarioComponent],
            imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule.withRoutes([])],
            providers: [UsuarioService, { provider: Router, useClass: routerFake }, {
                provide: ActivatedRoute,
                useValue: {
                    params: of({ tipoinsert: 'new' }),
                }
            }]
        }).compileComponents();


    }));

    beforeEach(() => {
        fixed = TestBed.createComponent(DetalleUsuarioComponent);
        history.pushState({ data: undefined, company: [] }, "data")
        componenteDetalle = fixed.componentInstance;
        fixed.detectChanges();
    });


    it('Creación del componente', () => {
        expect(componenteDetalle).toBeTruthy();
    });

    it('Campos necesarios para insertar un usuario', () => {

        expect(componenteDetalle.myForm.contains("nombre")).toBeTruthy();
        expect(componenteDetalle.myForm.contains("apellidoPat")).toBeTruthy();
        expect(componenteDetalle.myForm.contains("apellidoMat")).toBeTruthy();
        expect(componenteDetalle.myForm.contains("curp")).toBeTruthy();
        expect(componenteDetalle.myForm.contains("emailCorp")).toBeTruthy();
        expect(componenteDetalle.myForm.contains("ciEmailPersonal")).toBeTruthy();
        expect(componenteDetalle.myForm.contains("ciTelefono")).toBeTruthy();
        expect(componenteDetalle.myForm.contains("ciEmailPersonal")).toBeTruthy();
        

    });

    it('validación de campos necesarios al insertar usuario',()=>{
        let myform = componenteDetalle.myForm;

        //Validación de mis campos

        let nombre = myform.get("nombre");
        nombre?.setValue("santiago");
        expect(nombre?.valid).toBeTruthy();

        let apellido = myform.get("apellidoPat");
        apellido?.setValue("Mariscal");
        expect(apellido?.valid).toBeTruthy();

        let emailCorp = myform.get("emailCorp");
        emailCorp?.setValue("santiagoantoniomariscal@gmail.com");
        expect(emailCorp?.valid).toBeTruthy();

        let ciEmailPersonal = myform.get("ciEmailPersonal");
        ciEmailPersonal?.setValue("santiagoantoniomariscal@gmail.com");
        expect(ciEmailPersonal?.valid).toBeTruthy();

        let ciTelefono = myform.get("ciTelefono");
        ciTelefono?.setValue("3321496475");
        expect(ciTelefono?.valid).toBeTruthy();


    });

    it('validacion de campos no necesarios para insertar un usuario',()=>{
        let myform = componenteDetalle.myForm;

         //Validación de campos no necesarios

         let apellidoMat = myform.get("apellidoMat");
         apellidoMat?.setValue("");
         expect(apellidoMat?.valid).toBeTruthy();

         let curp = myform.get("curp");
         curp?.setValue("");
         expect(curp?.valid).toBeTruthy();
    });

    it('validación de la CURP',()=>{
        let myform = componenteDetalle.myForm;

        //Validación de campos no necesarios

        let apellidoMat = myform.get("curp");
        apellidoMat?.setValue("AOMS970119HJCNRN02");
        expect(apellidoMat?.valid).toBeTruthy();
    });

    it('redireccionamineto_cancelar', () => {

        const router = TestBed.get(Router);

        const spy = spyOn(router, 'navigate');
        componenteDetalle.cancelar();
        expect(spy).toHaveBeenCalledWith(['/usuarios']);

    });


    it('Enviando undefined en usuario nuevo', () => {

        expect(componenteDetalle.objusuario).toEqual({});

    });

    it('verificando myform no ser nulo', () => {
        expect(componenteDetalle.myForm).not.toBeNull();
    });




});


describe('componente-usuariodetalle ACTUALIZAR USUARIO',()=>{


    let componenteDetalle:DetalleUsuarioComponent;
    const objenviar = {
        nombre: '',
        apellidoPat: '',
        apellidoMat: '',
        curp: '',
        emailCorp: '',
        ciEmailPersonal: '',
        ciTelefono: '',
        fechaAlta: '2007/05/01',
        tipoPersonaId: 1,
        representanteLegalCentrocClienteId: 1,
        esActivo: 1,
        personaId: 2


    };



    beforeEach(async(()=>{
        TestBed.configureTestingModule({
            declarations: [DetalleUsuarioComponent],
            imports: [FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule.withRoutes([])],
            providers: [UsuarioService, {
                provide: ActivatedRoute,
                useValue: {
                    params: of({ tipoinsert: 'update' }),
                }
            }]
        }).compileComponents();
    }));

    beforeEach(()=>{
        let fixed = TestBed.createComponent(DetalleUsuarioComponent);
        componenteDetalle = fixed.componentInstance;
        history.pushState({data:objenviar,company:[]},"data")

        fixed.detectChanges();
    });


    it('Se visualiza formulario para editar usuario', () => {



        let mensaje: string = componenteDetalle.strTitulo;

        
        let insertar: boolean = componenteDetalle.insertar;

        expect(mensaje).toBe("¿Deseas actualizar el usuario?");
        expect(insertar).not.toBeTruthy();

    });  


    it('verificacion de objeto enviado al formulario del detalle de un usuario',()=>{
        console.log("ESTE ES MI COMPONENTE");
        console.log(componenteDetalle.objusuario);
          expect(componenteDetalle.objusuario).toEqual(objenviar);
    });


    it('verificando myform no ser nulo', () => {
        expect(componenteDetalle.myForm).not.toBeNull();
    });


    it('enviando peticion verificando variables',()=>{
        componenteDetalle.enviarPeticion();


        expect(componenteDetalle.iconType).toBe("warning");
        expect(componenteDetalle.strsubtitulo).toBe("Una vez aceptando los cambios seran efectuados");
        expect();

    });

})
