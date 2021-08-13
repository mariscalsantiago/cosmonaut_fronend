import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  public url: string = "";

  constructor(private http: HttpClient) { }

  public save(obj: any): Observable<any> {
    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.domicilio}/guardar/sede/domicilio`, json);

  }
  public modificar(obj: any): Observable<any> {
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.sedes}/modificar`, json);

  }
  public modificarDom(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.domicilio}/modificar`,json);

  }
}
