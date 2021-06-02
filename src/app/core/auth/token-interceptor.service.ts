import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private authPrd: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (this.authPrd.isAuthenticated()) {
          req = req.clone({
              setHeaders: {
                  authorization: `Bearer ${this.authPrd.getToken()}`
              }
          });
      }
      return next.handle(req);
  }
}