import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class DomicilioService {

  public url:string = "";

  constructor(private http:HttpClient) { }

  

  public getDetDom(id_empresa:number):Observable<any>{
    return this.http.get(`${direcciones.domicilio}/obtener/id/empresa/domicilio/${id_empresa}`);
  }

  public getListaSede(id_empresa:number):Observable<any>{
    return this.http.get(`${direcciones.sedes}/obtener/id/compania/${id_empresa}`);
  }

  public save(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.domicilio}/guardar`,json,httpOptions);

  }

  public modificar(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.domicilio}/modificar`,json,httpOptions);

  }

  public eliminar(id:any):Observable<any>{

    return this.http.post(`${direcciones.sedes}/eliminar/${id}`,{});
  }

}
