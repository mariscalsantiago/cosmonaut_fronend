import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ConceptosService {

  public url:string = "";

  constructor(private http:HttpClient) {

    this.url = direcciones.conceptos;


   }

  public getListaConceptoPercepcion(id_empresa:number):Observable<any>{
       return this.http.get(`${this.url}/obtener/percepcion/${id_empresa}`);
  }

 
  public getListaConceptoDeduccion(id_empresa:number):Observable<any>{

    return this.http.get(`${this.url}/obtener/deduccion/${id_empresa}`);
  }


  public savePer(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    console.log(`guardar percepcion`,json);
    return this.http.put(`${this.url}/guardarPercepcion`,json,httpOptions);
  }
  public saveDed(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    console.log(`guardar percepcion`,json);
    return this.http.put(`${this.url}/guardarDeduccion`,json,httpOptions);
  }



  public  modificarPer(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);

    console.log(json);

    return this.http.post(`${this.url}/modificarPercepcion`,json,httpOptions);
  }

  public  modificarDed(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);

    console.log(json);

    return this.http.post(`${this.url}/modificarDeduccion`,json,httpOptions);
  }


  public eliminarPer(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    return this.http.post(`${this.url}/eliminarPercepcion`,json,httpOptions);
  }

  public eliminarDed(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    return this.http.post(`${this.url}/eliminarDeduccion`,json,httpOptions);
  }

}
