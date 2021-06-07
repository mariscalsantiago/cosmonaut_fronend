import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';

  constructor(private http: HttpClient,private router: Router,private httpbackend:HttpBackend) { 
    this.http = new HttpClient(this.httpbackend);
  }

  login(auth: any): Observable<any> {


    const httpOptions = {
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    };


    let json = JSON.stringify(auth);

    return this.http.post<any>(`${environment.rutaAdmin}/login`, json,httpOptions)
      .pipe(tap(tokens => this.guardarToken(tokens)));
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  getToken(): string {
    let obj = localStorage.getItem(this.JWT_TOKEN) as string;
    let accessToken = JSON.parse(obj)?.access_token;
    return accessToken;
  }

  private guardarToken(respuesta: any): void {

    localStorage.setItem(this.JWT_TOKEN, JSON.stringify(respuesta));
    this.router.navigateByUrl('/');
  }

  eliminarTokens(): void {
    localStorage.removeItem(this.JWT_TOKEN);
  }

  
}
