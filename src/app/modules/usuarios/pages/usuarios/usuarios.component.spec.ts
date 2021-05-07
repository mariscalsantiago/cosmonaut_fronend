import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from "@angular/core/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { UsuariosComponent } from "./usuarios.component";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsuarioService } from "../../services/usuario.service";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShareModule } from "src/app/shared/share.module";
import { SharedCompaniaService } from "src/app/shared/services/compania/shared-compania.service";
import { of } from "rxjs";
import { DebugElement, LOCALE_ID } from "@angular/core";
import { By } from "@angular/platform-browser";
import { LISTACOMPANY, LISTAUSUARIOS } from "../../../../core/data/datosmock";
import { Router } from "@angular/router";
import { routes } from '../../usuarios-routing.module';




class routerFake {
    public navitate(params: any) {

    }
}


describe("Componente Lista de usuarios", () => {


    let componenteUsuario: UsuariosComponent;
    let usuariosPrd: UsuarioService;
    let companiaPrd: SharedCompaniaService;
    let routerPrd:Router;
    let fixed: ComponentFixture<UsuariosComponent>;

    let debugElement: DebugElement;




    let tempListaCompany: any;
    let tempListaUsuario: any;


    

    beforeEach(waitForAsync(() => {



        TestBed.configureTestingModule({
            declarations: [UsuariosComponent],
            imports: [RouterTestingModule.withRoutes(routes), HttpClientTestingModule, FormsModule, ReactiveFormsModule, ShareModule],
            providers: [UsuarioService, SharedCompaniaService, {
                provide: LOCALE_ID, useValue: 'es-MX'
            },{ provider: Router, useClass: routerFake }]

        }).compileComponents().then(() => {
            fixed = TestBed.createComponent(UsuariosComponent);
            componenteUsuario = fixed.componentInstance;
            usuariosPrd = TestBed.inject(UsuarioService);
            companiaPrd = TestBed.inject(SharedCompaniaService);
            routerPrd = TestBed.inject(Router);
            
            debugElement = fixed.debugElement;
            tempListaCompany = copia(LISTACOMPANY);
            tempListaUsuario = copia(LISTAUSUARIOS);
        });




    }));

    it("Creación del componente Lista Usuarios", () => {
        expect(componenteUsuario).toBeTruthy();
    })

    it('Inicialización del componente init', fakeAsync(() => {
        const spy1 = spyOn(companiaPrd, "getAllCompany").and.returnValue(of(tempListaCompany));
        const spy2 = spyOn(usuariosPrd, "filtrar").and.returnValue(of(tempListaUsuario));
        expect(componenteUsuario.arregloCompany.length).toBe(0, "No existe compañias")
        expect(componenteUsuario.arreglo.length).toBe(0, "No debe contener usuarios");
        componenteUsuario.ngOnInit();
        tick(10);
        expect(componenteUsuario.arregloCompany.length).toBeGreaterThanOrEqual(1, "Contiene uno o mas arreglos de compañia en el componente");
        expect(componenteUsuario.arregloCompany.length).toBeGreaterThanOrEqual(1, "Contiene 1 o mas usuarios en el arreglo");
        expect(spy2).toHaveBeenCalled();
    }))


    it('Seleccionando y filtrando usuarios de compañias', fakeAsync(() => {
        componenteUsuario.nombre = "";
        componenteUsuario.arregloCompany = tempListaCompany.datos;
        componenteUsuario.fechaRegistro = "2016-01-01";
        componenteUsuario.nombre = "Santiago Antonio";
        componenteUsuario.apellidoPat = "Mariscal";
        componenteUsuario.apellidoMat = "Velasquez";
        fixed.detectChanges();
        const spy2 = spyOn(usuariosPrd, "filtrar").and.returnValue(of(tempListaUsuario));
        let boton = debugElement.query(By.css(".button-outlet"));
        boton.triggerEventHandler("click", null);
        fixed.detectChanges();
        tick();
        expect(spy2).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalledTimes(1);
        expect(componenteUsuario.arreglotabla).toEqual(jasmine.any(Object));
    }))

   it("Verificacion de llenado de las tablas",()=>{
    spyOn(usuariosPrd, "filtrar").and.returnValue(of(tempListaUsuario));
    fixed.detectChanges();
      let elemento:DebugElement = fixed.debugElement.query(By.css("app-tablapaginado"));
      let tabla:DebugElement = elemento.query(By.css("table"));
      let tbody:DebugElement = tabla.query(By.css("tbody"));
      let rows:DebugElement[] = tbody.queryAll(By.css("tr"));


      expect(componenteUsuario.cargando).not.toBe(true);
      expect(componenteUsuario.arreglotabla).toEqual(jasmine.any(Object));
      expect(rows.length).toBeGreaterThanOrEqual(2);
   });

   it("Verificacion del elemento de click de las tablas y normal",fakeAsync(()=>{
    
    spyOn(usuariosPrd, "filtrar").and.returnValue(of(tempListaUsuario));
    fixed.detectChanges();



    expect(componenteUsuario.cargando).toBe(false);

    let elemento:DebugElement = fixed.debugElement.query(By.css("app-tablapaginado"));
    let tabla:DebugElement = elemento.query(By.css("table"));
    let tbody:DebugElement = tabla.query(By.css("tbody"));
    let rows:DebugElement[] = tbody.queryAll(By.css("tr"));
    
    

    let navegador = spyOn(routerPrd,"navigate");
    navegador.and.callThrough();
    rows.forEach(elemento =>{
        let botones:DebugElement[] = elemento.query(By.css(".opciones")).queryAll(By.css("button"));
        expect(botones.length).toBe(1);
        let botonEditar = botones[0];
        botonEditar.triggerEventHandler("click", null);
        expect(navegador).toHaveBeenCalled();
    });

   }));


   it("Agregar un usuario vista de formulario",()=>{
       
        let boton = fixed.debugElement.queryAll(By.css(".button-outlet "))[1];
        let detalle = spyOn(componenteUsuario,"verdetalle");
        let spynavigate = spyOn(routerPrd,"navigate").and.callThrough();
        detalle.and.callThrough();
        boton.triggerEventHandler("click",null);
        expect(detalle).toHaveBeenCalled();
        expect(detalle).toHaveBeenCalledTimes(1);
        expect(detalle).toHaveBeenCalledOnceWith(undefined);
        expect(spynavigate).toHaveBeenCalled();
   })


   


    function copia(datos: any) {
        let json = JSON.stringify(datos);
        return JSON.parse(json);
    }



});