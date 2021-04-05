import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  public url:string = "";
  constructor(private http:HttpClient) { 

    this.url = direcciones.incidencias;

  }


  public save(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const json = JSON.stringify(obj);
    return this.http.put(`${this.url}/guardar`,json,httpOptions);
  }

  public update(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const json = JSON.stringify(obj);

    return this.http.post(`${this.url}/modificar`,json,httpOptions);


  }


  public delete(idIncidencia:number):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(`${this.url}/eliminar/${idIncidencia}`,{},httpOptions);


  }


  public getById(idIncidencia:number):Observable<any>{
    return this.http.get(`${this.url}/obtener/id/${idIncidencia}`);
  }


  public getByIdEmpresa(idEmpresa:number):Observable<any>{
    return this.http.get(`${this.url}/lista/empresa/${idEmpresa}`);
  }


  public filtro(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };    
    const json = JSON.stringify(obj);
    return this.http.post(`${this.url}/lista/dinamica/}`,json,httpOptions);

  }

  




}
