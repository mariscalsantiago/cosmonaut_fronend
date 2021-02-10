import { $$, browser, by, element } from "protractor";

describe("menu principal", () => {
    beforeAll(() => {
        browser.get("http://localhost:4200/inicio");
    });


    it("verificando todos los menus", () => {

        let menuflotante = element(by.id("listanavegadora"));

        let buttons = menuflotante.all(by.css("li"));

        buttons.each(async (elemento, index) => {
            let texto = await elemento?.getText();
            console.log(texto);
            let element1 = elemento?.all(by.css("a"));
            element1?.click();
        });
    });

    it("Verificando administracion", () => {
        let menuflotante = element(by.id("listanavegadora"));

        let buttons = menuflotante.all(by.css("li"));

        buttons.each(async (elemento, index) => {
            let texto = await elemento?.getText();

            if (texto == "ADMINISTRACIÓN") {
                expect(texto).toBe("ADMINISTRACIÓN");
                let element1 = elemento?.all(by.css("a"));
                element1?.click();
            }
        });
    });


    it("Verificando empleados", async () => {
        let menuflotante = element(by.id("listanavegadora"));

        let buttons = menuflotante.all(by.css("li"));

        buttons.each(async (elemento, index) => {
            let texto = await elemento?.getText();

            if (texto == "EMPLEADOS") {
                expect(texto).toBe("EMPLEADOS");
                let element1 = elemento?.all(by.css("a"));
                element1?.click();
            }
        });
    });
});