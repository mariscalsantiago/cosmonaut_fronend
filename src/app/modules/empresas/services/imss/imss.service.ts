import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Console } from 'console';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ImssService {

  public url:string = "";

  constructor(private http:HttpClient) { }

  public getAllByImss(idEmpresa:number):Observable<any>{

    return this.http.get(`${direcciones.registroPatronal}/obtener/empresa/id/${idEmpresa}`);

  }


  public save(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.registroPatronal}/guardar`,json,httpOptions);

  }

  public modificar(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.registroPatronal}/modificar`,json,httpOptions);

  }
}
