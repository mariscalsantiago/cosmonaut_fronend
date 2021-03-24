import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  public url:string = "";

  constructor(private http:HttpClient) { }

  public save(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    console.log(json);

    return this.http.put(`${direcciones.domicilio}/guardar/sede/domicilio`,json,httpOptions);

  }
  public modificar(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    console.log(json);

    return this.http.post(`${direcciones.sedes}/modificar`,json,httpOptions);

  }
}
