import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class PuestosService {

  private url:string = '';

  constructor(private http:HttpClient) { 

    this.url = direcciones.area;
  }


  public getAllArea(id_compania:number):Observable<any>{
     return this.http.get(`${this.url}/listar/areas/${id_compania}`);

  }
  public getAreaID(id_empresa:number):Observable<any>{
    return this.http.get(`${this.url}/obtener/idArea/${id_empresa}`);

 }

  public getListPues(id_empresa:number,id_area:number):Observable<any>{
    return this.http.get(`${this.url}/obtener/cliente/area/${id_empresa}/${id_area}`);

  }

  public getdetalleArea(id_empresa:number,id_area:number):Observable<any>{
    return this.http.get(`${this.url}/obtener/empleado/${id_empresa}/${id_area}`);

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
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);
    

    return this.http.put(`${this.url}/guardar`,json,httpOptions);
  }

  public savepuest(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);
    

    return this.http.put(`${this.url}/agregarPuesto`,json,httpOptions);
  }

  public eliminar(obj:any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json:string = JSON.stringify(obj);
    return this.http.post(`${this.url}/eliminar`,json,httpOptions);
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


  public getAllCompany(id_empresa:number):Observable<any>{
     return this.http.get(`${direcciones.centroCostosCliente}/obtener/id/${id_empresa}`);
  }

}
