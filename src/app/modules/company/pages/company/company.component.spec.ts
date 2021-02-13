import { async, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { CompanyComponent } from "./company.component";
import { HttpClientTestingModule } from '@angular/common/http/testing';




class routerMokup{
    public navigate(obj:any){

    }
};


const objenviar = {
    nombre: 'ASG',
    razonSocial: 'ASG',
    rfc: 'SOOJ890306GR1',
    emailCorp: 'raul@gmail.com',
    fechaAlta: 1610517600000,
    esActivo: 1,
    centrocClienteId: 12

};

describe("Lista de compañías",()=>{
   

    let componenteCompany:CompanyComponent;

    beforeEach(async(()=>{


        TestBed.configureTestingModule({
            declarations:[CompanyComponent],
            imports:[HttpClientTestingModule,RouterTestingModule.withRoutes([])],
            providers:[{provide:Router,useClass:routerMokup}]

        }).compileComponents();



    }));


    beforeEach(()=>{
        let fixed = TestBed.createComponent(CompanyComponent);
        componenteCompany = fixed.componentInstance;

    

        fixed.detectChanges();
        
    });


    it('Ver detalle de compañía',()=>{

       // const router = TestBed.get(Router);
       // const spyn = spyOn(router,"navigate");
       // componenteCompany.verdetallecom(objenviar);


       // expect(spyn).toHaveBeenCalledWith(['company', 'detalle_company', "modifica"], {state:{data:objenviar}});
                                                                                                         


    });


    


});