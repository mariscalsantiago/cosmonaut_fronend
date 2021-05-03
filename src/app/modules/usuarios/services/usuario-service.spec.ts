import { HttpClientTestingModule } from "@angular/common/http/testing";

import { async, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { UsuarioService } from "./usuario.service";
import * as Rx from 'rxjs';
import { delay } from "rxjs/operators";






describe('Validando services usuarioPrd peticiones http', () => {

  

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UsuarioService]
        });


    }));



    let servicio:UsuarioService;

    beforeEach(()=>{
        servicio = TestBed.inject(UsuarioService);
    });


    it("Creación del services",()=>{
        expect(servicio).toBeTruthy();
    });


    it('Probando getAllUsers',fakeAsync(()=>{
        let objanalizar: any = [{
            personaId: 1, nombre: "santiago", apellidoPat: "mariscal", apellidoMat: "Velasquez", representanteLegalCentrocClienteId: 1,
            emailCorp: "santiago@google.com", fechaAlta: "2007/02/02", esActivo: true
        }];

        spyOn(servicio, 'getAllUsers').and.callFake(()=>{
            return Rx.of({data:objanalizar}).pipe(delay(100));
        });



        let arreglo;

        servicio.getAllUsers().subscribe((datos)=>{
          arreglo = datos.data;


        });


        tick(100);
        expect(arreglo).toEqual(objanalizar);


    }));


    it('probando getByCompany',fakeAsync(()=>{


        let objanalizar: any = [{
            personaId: 1, nombre: "santiago", apellidoPat: "mariscal", apellidoMat: "Velasquez", representanteLegalCentrocClienteId: 1,
            emailCorp: "santiago@google.com", fechaAlta: "2007/02/02", esActivo: true
        }];


        spyOn(servicio, 'getByCompany').and.callFake(()=>{
            return Rx.of({data:objanalizar}).pipe(delay(100));
        });

        
        let arreglo;

        let id_company = 3;

        servicio.getByCompany(id_company).subscribe((datos)=>{
          arreglo = datos.data;
        });


        tick(100);
        expect(arreglo).toEqual(objanalizar);




    }));


    it('probando getById',fakeAsync(()=>{


        let objanalizar: any = {
            personaId: 1, nombre: "santiago", apellidoPat: "mariscal", apellidoMat: "Velasquez", representanteLegalCentrocClienteId: 1,
            emailCorp: "santiago@google.com", fechaAlta: "2007/02/02", esActivo: true
        };


        spyOn(servicio, 'getById').and.callFake(()=>{
            return Rx.of({data:objanalizar}).pipe(delay(100));
        });

        
        let objUsuario;

        let id_usuario = 2;

        servicio.getById(id_usuario).subscribe((datos)=>{
            objUsuario = datos.data;
        });


        tick(100);
        expect(objUsuario).toEqual(objanalizar);




    }));

});