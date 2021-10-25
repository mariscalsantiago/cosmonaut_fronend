import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  constructor(private http: HttpClient) { }

  public calculoSueldoBruto(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.calculo}/salario/bruto/mensual`, json, httpOptions);

  }

  public calculoSueldoNetoabruto(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.calculo}/sueldo_neto/sueldo_bruto`, json, httpOptions);

  }
  public calculoSueldoNetoPPP(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.calculo}/salario/imss/completo/ppp`, json, httpOptions);

  }
}