import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { direcciones } from '../../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private url:string = '';

  constructor(private http:HttpClient) { 

    //this.url = direcciones.company;

    this.url = '/api';

  }

   public getAll():Observable<any>{
    return this.http.get(`/api/centroCostosCliente/lista/compania`);
    
   
  }

  public getAllCont(obj:any):Observable<any>{
    debugger;
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);
    return this.http.post(`/api/persona/lista/compania/tipoPersona`,json,httpOptions);
  }

  public save(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);

    return this.http.put(`/api/centroCostosCliente/guardar/compania`,json,httpOptions);
  }

  public savecont(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);

    return this.http.put(`/api/persona/guardar/contacto/inicial`,json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json:string = JSON.stringify(obj);

    return this.http.post(`/api/centroCostosCliente/modificar/compania`,json,httpOptions);
  }
  
  public modificarCont(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json:string = JSON.stringify(obj);

    return this.http.post(`/api/persona/modificar/usuario`,json,httpOptions);
  }

  public filtrar(obj: any): Observable<any> {
    debugger;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json: string = JSON.stringify(obj);
    console.log("peticion filtro dinamico",json);
    return this.http.post("/api/centroCostosCliente/lista/dinamica", json, httpOptions);
  }

  
  
}
