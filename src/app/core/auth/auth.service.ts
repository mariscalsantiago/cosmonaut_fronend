import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { direcciones } from 'src/assets/direcciones';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly USUARIO = 'usuario';
  private readonly VERSION = 'version';
  private readonly SESSION = 'sesion';

  constructor(private http: HttpClient,private router: Router,private httpbackend:HttpBackend,
    private configuracionPrd:ConfiguracionesService) { 
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
    let accessToken = "";
    
    if(this.configuracionPrd.isSession(this.configuracionPrd.JWT)){
      let obj = this.configuracionPrd.getElementosSesionDirecto(this.configuracionPrd.JWT);
      accessToken = obj?.access_token;
    }
    return accessToken;
  }
  getRefreshToken():string{
    let obj = this.configuracionPrd.getElementosSesionDirecto(this.configuracionPrd.JWT);
    let refreshToken = obj?.refresh_token;
    return refreshToken;
  }

  private guardarToken(respuesta: any,esregresh:boolean = false): void {

    this.configuracionPrd.setElementosSesion(this.configuracionPrd.JWT,respuesta);
    if(esregresh){
      this.router.navigateByUrl('/');
    }
  }

  eliminarTokens(): void {
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
