import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class DomicilioService {

  public url:string = "";

  constructor(private http:HttpClient) { }

  public save(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    

    return this.http.put(`${direcciones.domicilio}/guardar`,json,httpOptions);

  }


  public update(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    

    return this.http.post(`${direcciones.domicilio}/modificar`,json,httpOptions);

  }



  public getDomicilioPorEmpleado(idEmpleado:number):Observable<any>{
    return this.http.get(`${direcciones.domicilio}/obtener/id/persona/${idEmpleado}`);
  }
  public getDomicilioPorEmpleadoNativo(idEmpleado:number):Observable<any>{
    return this.http.get(`${direcciones.domicilio}/obtener/id/persona/nativo/${idEmpleado}`);
  }
}
