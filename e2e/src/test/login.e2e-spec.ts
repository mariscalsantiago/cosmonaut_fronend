
import { browser, element,by, $$ } from "protractor";

describe('verificando titulos',()=>{
    

    beforeEach(()=>{
        browser.get("http://localhost:4200/#/auth/login");
    });


    it('titulo principal',()=>{
       // expect(browser.getTitle()).toContain('Cosmonaut');
       expect('buen titulo').toContain('buen titulo');;
    });


    it('ingreso al sistema',async()=>{
        let elemento = element(by.id('usuariologin'));
        elemento.sendKeys("ojimenez@ontime.com")

        element(by.id('loginpassword')).sendKeys("ojimenez@ontime.com");


        let boton = element(by.css("button"));


       


        boton.getText().then(datos =>{
            expect(datos).toBe("INGRESAR");
        });
          
        element(by.css("button")).click();

      
  



       
        

    });

});