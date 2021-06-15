import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { direcciones } from 'src/assets/direcciones';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly USUARIO = 'usuario';
  private readonly VERSION = 'version';
  private readonly SESSION = 'sesion';

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
  getRefreshToken():string{
    let obj = localStorage.getItem(this.JWT_TOKEN) as string;
    let refreshToken = JSON.parse(obj)?.refresh_token;
    return refreshToken;
  }

  private guardarToken(respuesta: any): void {

    localStorage.setItem(this.JWT_TOKEN, JSON.stringify(respuesta));
    this.router.navigateByUrl('/');
  }

  eliminarTokens(): void {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.USUARIO);
    localStorage.removeItem(this.VERSION);
    localStorage.removeItem(this.SESSION);
  }

  public refreshToken(tokenRefresh:string):Observable<any>{
    const httpOptions = {
      headers:new HttpHeaders({
        'Content-type':'application/x-www-form-urlencoded'   
      })
    }
    let cuerpo = `grant_type=refresh_token&refresh_token=${tokenRefresh}`;

    return this.http.post(`${direcciones.oauth}/access_token`,cuerpo,httpOptions).
                pipe(tap(tokens => this.guardarToken(tokens)));;
  }

  

  
}
