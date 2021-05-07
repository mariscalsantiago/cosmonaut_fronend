import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class JornadalaboralService {

  private url:string = '';

  constructor(private http:HttpClient) { 
    this.url = direcciones.jornada;

  }


  public getAllJornada(id_empresa:number):Observable<any>{
     return this.http.get(`${this.url}/listar/jornada/${id_empresa}`);
  }


  public getdetalleJornada(id_empresa:number,id_jornada:number):Observable<any>{
    return this.http.get(`${this.url}/listar/${id_empresa}/${id_jornada}`);

  }

  public getdetalleJornadaHorario(id_empresa:number,id_jornada:number):Observable<any>{
    return this.http.get(`${this.url}/listar/jornada/${id_empresa}/${id_jornada}`);

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

  public jornadasByEmpresa(idEmpresa:number):Observable<any>{

    

    return this.http.get(`${this.url}/listar/jornada/${idEmpresa}`);

  }


}
