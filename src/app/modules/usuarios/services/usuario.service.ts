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

  }

  public getByCompany(id_company:number):Observable<any>{
      return this.http.get(`/api/user/findByIdCompany/${id_company}`);
  }

  public getById(id_user:number):Observable<any>{
    

    return this.http.get(`${this.url}/findById/${id_user}`);

  }

  public save(obj:any):Observable<any>{
   
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);

    return this.http.put(`${this.url}/save`,json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json:string = JSON.stringify(obj);

    return this.http.post(`${this.url}/update`,json,httpOptions);
  }

  
  
}
