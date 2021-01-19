import { async, ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { UsuariosComponent } from "./usuarios.component";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsuarioService } from "../../services/usuario.service";
import { of } from "rxjs";
import * as Rx from 'rxjs';
import { delay } from "rxjs/operators";




class routerMokup {
    public navigate(obj: any) {

    }
};


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




describe("Lista de usuarios", () => {


    let componenteUsuario: UsuariosComponent;
    let usuariosPrd: UsuarioService;
    let fixed: ComponentFixture<UsuariosComponent>;

    beforeEach(async(() => {


        TestBed.configureTestingModule({
            declarations: [UsuariosComponent],
            imports: [RouterTestingModule.withRoutes([]), HttpClientTestingModule],
            providers: [{ provide: Router, useClass: routerMokup }, {
                provider: UsuarioService, useValue: {
                    getAllUsers: () => {
                        of({
                            data: [{
                                personaId: 1, nombre: "santiago", apellidoPat: "mariscal", apellidoMat: "Velasquez", representanteLegalCentrocClienteId: 1,
                                emailCorp: "santiago@google.com", fechaAlta: "2007/02/02", esActivo: true
                            }]
                        })

                    }
                }
            }]

        }).compileComponents();



    }));


    beforeEach(() => {
        fixed = TestBed.createComponent(UsuariosComponent);
        componenteUsuario = fixed.componentInstance;

        usuariosPrd = TestBed.get(UsuarioService);


        fixed.detectChanges();

    });


    it('Probando la carga de usuarios del services en la carga ngOnInit()',fakeAsync( () => {
        let objanalizar: any = [{
            personaId: 1, nombre: "santiago", apellidoPat: "mariscal", apellidoMat: "Velasquez", representanteLegalCentrocClienteId: 1,
            emailCorp: "santiago@google.com", fechaAlta: "2007/02/02", esActivo: true
        }];

        spyOn(usuariosPrd, 'getAllUsers')
            .and
            .callFake(()=>{
                return Rx.of({data:objanalizar}).pipe(delay(100));
            });

            

            componenteUsuario.ngOnInit();



            expect(componenteUsuario.cargando).toBeTruthy();

            tick(100);
         
            expect(componenteUsuario.arreglotemp).toEqual(objanalizar);
            expect(componenteUsuario.cargando).not.toBeTruthy();
        


       
    }));

    it('Probando el filtrado de usuarios',fakeAsync(()=>{
        let objConstruir:any = {
            tipoPersonaId: 3,
            representanteLegalCentrocClienteId: 1,
            personaId: 1,
            nombre: "santiago",
            apellidoPat: "mariscal",
            apellidoMat: "velasquesz",
            emailCorp: "santaigo antonio mariscal"
          };

        spyOn(usuariosPrd, 'filtrar')
            .and
            .callFake(()=>{
                return Rx.of({data:[objConstruir]}).pipe(delay(100));
            });

            

            componenteUsuario.filtrar();



            expect(componenteUsuario.cargando).toBeTruthy();

            tick(100);
         ;
            expect(componenteUsuario.arreglo).toEqual([objConstruir]);
            expect(componenteUsuario.cargando).not.toBeTruthy();
    }));


    it('Ver detalle de un usuario', () => {



        const router = TestBed.get(Router);
        const spyn = spyOn(router, "navigate");
        componenteUsuario.verdetalle(objenviar);


        expect(spyn).toHaveBeenCalledWith(['usuarios', 'detalle_usuario', "update"], { state: { data: objenviar, company: [] } });



    });





});