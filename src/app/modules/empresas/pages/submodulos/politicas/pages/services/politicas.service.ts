import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class PoliticasService {

  private url:string = '';

  constructor(private http:HttpClient) { 
    this.url = direcciones.politica;

  }


  public getAllPol(id_empresa:number):Observable<any>{
     return this.http.get(`${this.url}/obtener/politica/idEmpresa/${id_empresa}`);
  }

  public getTabBen(id_politica:number,id_empresa:number):Observable<any>{
    return this.http.get(`${this.url}/obtener/beneficio/idCliente/${id_politica}?idCliente=${id_empresa}`);

  }

  public getdetallePolitica(id_politica:number,id_empresa:number):Observable<any>{
    return this.http.get(`${this.url}/obtener/politica/empresa/${id_politica}?idCliente=${id_empresa}`);

  }

  public getdetalleBeneficio(id_politica:number,id_empresa:number):Observable<any>{
    return this.http.get(`${this.url}/obtener/beneficio/idCliente/${id_politica}?idCliente=${id_empresa}`);

  }

  public eliminar(obj:any):Observable<any>{
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json:string = JSON.stringify(obj);
    console.log("eliminar",json)
    return this.http.post(`${this.url}/eliminar`,json,httpOptions);
  }

  public save(obj:any):Observable<any>{
   
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json:string = JSON.stringify(obj);
    console.log(json);

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


}
