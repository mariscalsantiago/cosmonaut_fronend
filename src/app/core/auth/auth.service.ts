import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';

  constructor(private http: HttpClient,private router: Router) { }

  login(auth: any): Observable<any> {
    return this.http.post<any>('/auth/login', auth)
      .pipe(tap(tokens => this.guardarToken(tokens)));
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  getToken(): string {
    return localStorage.getItem(this.JWT_TOKEN) as string;
  }

  private guardarToken(respuesta: any): void {
    localStorage.setItem(this.JWT_TOKEN, respuesta.token);
    this.router.navigateByUrl('/');
  }

  eliminarTokens(): void {
    localStorage.removeItem(this.JWT_TOKEN);
  }

  logout(): void {
    this.eliminarTokens();
    this.router.navigateByUrl('/auth/logout');
  }
}
