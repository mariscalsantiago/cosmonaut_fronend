import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ApoderadoLegalService {

  private url:string = '';

  constructor(private http:HttpClient) { 

    this.url = direcciones.usuarios;

  }


  public getAllUsersRep(obj : any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json:string = JSON.stringify(obj);
    
    
     return this.http.post(`${this.url}/lista/compania/tipoPersona`,json,httpOptions);
  }

  public getByRep(id_company:number):Observable<any>{
      return this.http.get(`${this.url}/obtener/id/compania/${id_company}`);
  }


  public filtrar(obj : any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json:string = JSON.stringify(obj);
    
    
     return this.http.post(`${this.url}/lista/dinamica`,json,httpOptions);
  }

  public save(obj:any):Observable<any>{
   
  
    let json:string = JSON.stringify(obj);
    

    return this.http.put(`${this.url}/guardar/apoderadoLegal`,json);
  }

  public modificar(obj:any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);

    return this.http.post(`${this.url}/modificar/apoderadoLegal`,json,httpOptions);
  }


  public getAllCompany():Observable<any>{
     return this.http.get(`${direcciones.centroCostosCliente}/lista/compania`);
  }

}
