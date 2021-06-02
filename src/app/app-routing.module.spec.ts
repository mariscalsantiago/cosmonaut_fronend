import { routes } from './app-routing.module';
import { AuthComponent } from './layout/autentificacion/auth/auth.component';
import { ContenidoComponent } from './layout/contenido/contenido/contenido.component';





describe('rutas principales', () => {

    it('verificando las rutas especiales', () => {

        expect(routes).toContain( {path: '',  redirectTo: '/auth/login',  pathMatch: 'full'});

        

    });


  

});