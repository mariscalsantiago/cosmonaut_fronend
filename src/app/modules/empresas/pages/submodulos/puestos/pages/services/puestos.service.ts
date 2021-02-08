import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuestosService {

  private url:string = '';

  constructor(private http:HttpClient) { 


  }


  public getAllArea(id_compania:number):Observable<any>{
     return this.http.get("/yared/area/listar/areas/"+id_compania);

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

  public eliminar(obj:any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json:string = JSON.stringify(obj);
    console.log("Json puestos-->",json);
    return this.http.post(`/yared/area/eliminar`,json,httpOptions);
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
     return this.http.get('/api/centroCostosCliente/lista/compania');
  }

}
