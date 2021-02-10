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
     return this.http.get("/api/area/listar/areas/"+id_compania);

  }

  public getdetalleArea(id_empresa:number,id_area:number):Observable<any>{
    return this.http.get("/api/area/obtener/empleado/idCliente/"+id_empresa+"?idArea="+id_area);

  }
  public getdetPuestoID(id_empresa:number,id_area:number):Observable<any>{
    return this.http.get("/api/puesto/obtener/cliente/area/id/"+id_empresa+"?idArea="+id_area);
  }

  public getAllPuestoID(id_empresa:number):Observable<any>{
    return this.http.get("/api/puesto/obtener/cliente/id/"+id_empresa);
  }

  public filtrar(obj : any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);
     return this.http.post("/api/area/lista/dinamica",json,httpOptions);
  }

  public save(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);
    console.log(json);

    return this.http.put("/api/area/guardar",json,httpOptions);
  }

  public eliminar(obj:any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json:string = JSON.stringify(obj);
    return this.http.post(`/api/area/eliminar`,json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);

    return this.http.post("/api/area/modificar",json,httpOptions);
  }


  public getAllCompany(id_empresa:number):Observable<any>{
     return this.http.get('/api/centroCostosCliente/obtener/id/'+id_empresa);
  }

}
