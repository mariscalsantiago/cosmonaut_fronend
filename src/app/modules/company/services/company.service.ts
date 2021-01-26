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

    this.url = direcciones.company;

    this.url = '/api';

  }

   public getAll():Observable<any>{
    
    return this.http.get(`${this.url}/centroCostosCliente/lista/compania`);

  }

  public getAllCont(obj:any):Observable<any>{
    debugger;
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);
    return this.http.post(`${this.url}/persona/lista/compania/tipoPersona`,json,httpOptions);
  }

  public save(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);

    return this.http.put(`${this.url}/centroCostosCliente/guardar/compania`,json,httpOptions);
  }

  public savecont(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);

    return this.http.put(`${this.url}/persona/guardar/contacto/inicial`,json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json:string = JSON.stringify(obj);

    return this.http.post(`${this.url}/centroCostosCliente/modificar`,json,httpOptions);
  }
  
  public modificarCont(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json:string = JSON.stringify(obj);

    return this.http.post(`${this.url}/persona/modificar`,json,httpOptions);
  }

  
  
}
