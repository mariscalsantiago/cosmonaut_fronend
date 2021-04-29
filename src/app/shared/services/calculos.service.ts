import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from '../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  constructor(private http:HttpClient) { }


  public calculoSueldoBruto(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/calcula/salario/bruto/mensual`, json, httpOptions);
  }

  public crearNomina(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/crear/nomina`, json, httpOptions);
  }


}
