import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { direcciones } from '../../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url:string = '';

  constructor(private http:HttpClient) { 

    this.url = direcciones.usuarios;
    this.url = '/api/persona';

  }


  public getAllUsers():Observable<any>{
     return this.http.get("/api/persona/lista/todos/3");
  }

  public getByCompany(id_company:number):Observable<any>{
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

    return this.http.put(`${this.url}/guardar`,json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);

    return this.http.post(`${this.url}/modificar`,json,httpOptions);
  }


  public getAllCompany():Observable<any>{
     return this.http.get('/api/centroCostosCliente/listar/compania');
  }

  
  
}
