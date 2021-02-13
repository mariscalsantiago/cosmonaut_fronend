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

    this.url = direcciones.usuarios;

  }


  public getAllUsersRep(id_company:number):Observable<any>{
     return this.http.get(`${this.url}/lista/todo/${id_company}`);
  }

  public getByRep(id_company:number):Observable<any>{
      return this.http.get(`${this.url}/obtener/id/compania/${id_company}`);
  }

  public getById(id_user:number):Observable<any>{
    

    return this.http.get(`${this.url}/obtener/id/${id_user}`);

  }

  public filtrar(obj : any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);
    console.log("json representante legal");
    console.log(json);
     return this.http.post(`${this.url}/lista/dinamica`,json,httpOptions);
  }

  public save(obj:any):Observable<any>{
   
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);

    return this.http.put(`${this.url}/guardar/representanteLegal`,json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);

    return this.http.post(`${this.url}/modificar/representanteLegal`,json,httpOptions);
  }


  public getAllCompany():Observable<any>{
     return this.http.get(`${direcciones.centroCostosCliente}/lista/compania`);
  }

}
