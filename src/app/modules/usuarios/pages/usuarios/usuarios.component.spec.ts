import { async, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { UsuariosComponent } from "./usuarios.component";
import { HttpClientTestingModule } from '@angular/common/http/testing';




class routerMokup{
    public navigate(obj:any){

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

describe("Lista de usuarios",()=>{
   

    let componenteUsuario:UsuariosComponent;

    beforeEach(async(()=>{


        TestBed.configureTestingModule({
            declarations:[UsuariosComponent],
            imports:[HttpClientTestingModule,RouterTestingModule.withRoutes([])],
            providers:[{provide:Router,useClass:routerMokup}]

        }).compileComponents();



    }));


    beforeEach(()=>{
        let fixed = TestBed.createComponent(UsuariosComponent);
        componenteUsuario = fixed.componentInstance;

    

        fixed.detectChanges();
        
    });


    it('Ver detalle de un usuario',()=>{



        const router = TestBed.get(Router);
        const spyn = spyOn(router,"navigate");
        componenteUsuario.verdetalle(objenviar);


        expect(spyn).toHaveBeenCalledWith(['usuarios', 'detalle_usuario', "update"], { state: { data: objenviar, company: [] } });



    });


    


});