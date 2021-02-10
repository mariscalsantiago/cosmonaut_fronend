
import { browser, element,by, $$ } from "protractor";

describe('verificando titulos',()=>{
    

    beforeEach(()=>{
        browser.get("http://localhost:4200/auth/login");
    });


    it('titulo principal',()=>{
        expect(browser.getTitle()).toContain('Cosmonaut');
    });


    it('ingreso al sistema',async()=>{
        let elemento = element(by.id('usuariologin'));
        elemento.sendKeys("santiagoantoniomariscal@gmail.com")

        element(by.id('loginpassword')).sendKeys("12345");


        let boton = element(by.css("button"));


       


        boton.getText().then(datos =>{
            expect(datos).toBe("INGRESAR");
        });
          
        element(by.css("button")).click();

      
  
        let elementos = $$('button');

        elementos.each((element,index) =>{
            element?.getText().then(datos =>{
              
            });
        });



       
        

    });

});