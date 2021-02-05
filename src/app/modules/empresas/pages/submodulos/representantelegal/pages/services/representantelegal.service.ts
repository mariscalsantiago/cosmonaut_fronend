import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class RepresentanteLegalService {

  private url:string = '';

  constructor(private http:HttpClient) { 

    this.url = '/api';

  }


  public getAllUsersRep():Observable<any>{
     return this.http.get("/api/persona/lista/todo/1");
  }

  public getByRep(id_company:number):Observable<any>{
      return this.http.get(`/api/persona/obtener/id/compania/${id_company}`);
  }

  public getById(id_user:number):Observable<any>{
    

    return this.http.get(`/api/persona/obtener/id/${id_user}`);

  }

  public filtrar(obj : any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);
     return this.http.post("/api/persona/lista/dinamica",json,httpOptions);
  }

  public save(obj:any):Observable<any>{
   
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);

    return this.http.put(`${this.url}/persona/guardar/representanteLegal`,json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);

    return this.http.post(`${this.url}/persona/modificar/representanteLegal`,json,httpOptions);
  }


  public getAllCompany():Observable<any>{
     return this.http.get('/api/centroCostosCliente/lista/compania');
  }

}
