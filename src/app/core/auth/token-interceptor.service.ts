import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  public refreshTokenEnProgreso: boolean = false;
  accessTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authPrd: AuthService,private routerPrd:Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authPrd.isAuthenticated()) {
      req = req.clone({headers: new HttpHeaders({
        'Content-Type':'application/json',
        'Authorization':`Bearer ${this.authPrd.getToken()}`
      })});
    
    }
    return next.handle(req).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e instanceof HttpErrorResponse && e.status === 401 && this.authPrd.isAuthenticated()) {
          if (!this.refreshTokenEnProgreso) {
            this.refreshTokenEnProgreso = true;
            return this.authPrd.refreshToken(this.authPrd.getRefreshToken()).pipe(
              switchMap(respuestaBackTokennuevo => {
                this.refreshTokenEnProgreso = false;
                this.accessTokenSubject.next(respuestaBackTokennuevo.access_token);
                req = req.clone({headers: new HttpHeaders({
                  'Content-Type':'application/json',
                  'Authorization':`Bearer ${respuestaBackTokennuevo.access_token}`
                })});
                return next.handle(req);
              }),
              catchError((e: HttpErrorResponse) => {
                this.refreshTokenEnProgreso = false;
                this.authPrd.eliminarTokens();
                this.routerPrd.navigateByUrl("/");
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