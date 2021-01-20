import { protractor } from "protractor/built/ptor"
import {browser} from 'protractor';



describe("Validando entrada de usuarios",()=>{


    browser.get("/usuarios").then(datos =>{
        expect(true).toBeTruthy();
    });;


})