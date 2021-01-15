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

    this.url = '/api/centroCostosCliente';

  }

  public getByCompany(id_company:number):Observable<any>{
    debugger;
      return this.http.get(`/api/company/findById/${id_company}`);
  }

  public getAll():Observable<any>{
    
    debugger;

    return this.http.get(`${this.url}/listar/compania/`);

  }

  public save(obj:any):Observable<any>{
   
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);

    return this.http.put(`${this.url}/guardar`,json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    debugger;
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json:string = JSON.stringify(obj);

    return this.http.post(`${this.url}/modificar`,json,httpOptions);
  }

  
  
}
