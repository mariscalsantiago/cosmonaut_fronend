import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http:HttpClient) { }

  public getReportePerfilPersonal(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    console.log(json);
    return this.http.post(`${direcciones.reportes}/perfil/personal`,json,httpOptions);
  }
}
