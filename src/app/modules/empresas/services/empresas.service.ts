import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { direcciones } from '../../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  private url:string = '';

  constructor(private http:HttpClient) { 


    this.url = '/api';

  }

   public getAllEmp():Observable<any>{
    
    return this.http.get(`${this.url}/centroCostosCliente/lista/compania`);

  }
  public getAllRep(id_company:number):Observable<any>{
    return this.http.get(`/api/persona/obtener/id/compania/${id_company}`);
}


  public save(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);

    return this.http.put(`${this.url}/centroCostosCliente/guardar`,json,httpOptions);
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

    
  
}
