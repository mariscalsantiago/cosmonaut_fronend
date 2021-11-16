import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from '../../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  constructor(private http: HttpClient) { }

  public getNoticia(idNoticia: number): Observable<any> {
    return this.http.get(`${direcciones.noticias}/detalle/${idNoticia}`);
  }

  public getNoticiasCosmonaut(): Observable<any> {
    return this.http.get(`${direcciones.noticias}/cosmonaut`);
  }

  public getNoticiasCliente(idEmpresa: number): Observable<any> {
    return this.http.get(`${direcciones.noticias}/cliente/${idEmpresa}`);
  }

  public getNoticiasEmpresa(idEmpresa: number): Observable<any> {
    return this.http.get(`${direcciones.noticias}/empresa/${idEmpresa}`);
  }

  public getNoticiasEmpleado(idEmpresa: number): Observable<any> {
    return this.http.get(`${direcciones.noticias}/${idEmpresa}`);
  }

  public createNoticia(request: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(request);
    return this.http.post(`${direcciones.noticias}`, json, httpOptions);
  }

  public editNoticia(request: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(request);
    return this.http.put(`${direcciones.noticias}`, json, httpOptions);
  }

  public eliminarNoticia(idNoticia: number): Observable<any> {
    return this.http.delete(`${direcciones.noticias}/${idNoticia}`);
  }
}
