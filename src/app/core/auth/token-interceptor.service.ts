import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  public refreshTokenEnProgreso: boolean = false;
  accessTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authPrd: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authPrd.isAuthenticated()) {
      req = req.clone({
        setHeaders: {
          authorization: `Bearer ${this.authPrd.getToken()}`
        }
      });
    }
    return next.handle(req).pipe(
      catchError((e: HttpErrorResponse) => {

        console.log("Entra al primer error del handler");
        if (e instanceof HttpErrorResponse && e.status === 401 && this.authPrd.isAuthenticated()) {
          if (!this.refreshTokenEnProgreso) {
            this.refreshTokenEnProgreso = true;
            this.accessTokenSubject.next(null);
            return this.authPrd.refreshToken(this.authPrd.getRefreshToken()).pipe(
              switchMap(respuestaBackTokennuevo => {
                this.refreshTokenEnProgreso = false;
                this.accessTokenSubject.next(respuestaBackTokennuevo.accessToken);
                req = req.clone({
                  setHeaders: {
                    authorization: `Bearer ${respuestaBackTokennuevo.accessToken}`
                  }
                });
                return next.handle(req);
              }),
              catchError((e: HttpErrorResponse) => {
                this.refreshTokenEnProgreso = false;
                //Eliminar el token --- (posiblemente)
                return throwError(e);
              })
            );
          } else {
            return this.accessTokenSubject.pipe(
              filter(accessToken => accessToken !== null),
              take(1),
              switchMap(token => {
                req = req.clone({
                  setHeaders: {
                    authorization: `Bearer ${token}`
                  }
                });
                return next.handle(req);
              }));
          }
        }

        return throwError(e);
      }

      ));
  }
}