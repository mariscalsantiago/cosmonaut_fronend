
import { browser, element,by, $$ } from "protractor";

describe('verificando titulos',()=>{
    

    beforeEach(()=>{
      
            
    });


    it('titulo principal',()=>{      
       expect('buen titulo').toContain('buen titulo');
    });


    it('ingreso al sistema',()=>{
        // let elemento = element(by.id('usuariologin'));
        // elemento.sendKeys("ojimenez@ontime.com")

        // element(by.id('loginpassword')).sendKeys("ojimenez@ontime.com");


        // let boton = element(by.css("button"));


       


        // boton.getText().then(datos =>{
        //     expect(datos).toBe("INGRESAR");
            
        // });
          
        // element(by.css("button")).click();      

    });

});