import { browser } from "protractor";

describe('verificando titulos',()=>{
    

    beforeEach(()=>{
        browser.get("http://localhost:4200");
    });


    it('titulo principal',()=>{
        expect(browser.getTitle()).toContain('Cosmonaut');
    });

});