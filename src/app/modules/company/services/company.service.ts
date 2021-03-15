import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { direcciones } from '../../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private url:string = '';

  constructor(private http:HttpClient) { 

    this.url = direcciones.centroCostosCliente;
  
  }

   public getAll():Observable<any>{
    return this.http.get(`${this.url}/lista/compania`);
    
   
  }

  public getAllCont(obj:any):Observable<any>{
    
    
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);
    return this.http.post(`${direcciones.usuarios}/lista/compania/tipoPersona`,json,httpOptions);
  }

  public save(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);


    console.log("lo que mando ");
    console.log(json);

    return this.http.put(`${this.url}/guardar/compania`,json,httpOptions);
  }

  public savecont(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);

    return this.http.put(`${direcciones.usuarios}/guardar/contacto/inicial`,json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json:string = JSON.stringify(obj);

    return this.http.post(`${this.url}/modificar/compania`,json,httpOptions);
  }
  
  public modificarCont(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json:string = JSON.stringify(obj);
    console.log("Esto si manda en contacto inicial",json);

    return this.http.post(`${direcciones.usuarios}/modificar/contacto/inicial`,json,httpOptions);
  }

  public filtrar(obj: any): Observable<any> {
    

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    console.log("peticion filtro dinamico",json);
    return this.http.post(`${this.url}/lista/dinamica`, json, httpOptions);
  }



  public getEmpresaById(idEmpresa:number):Observable<any>{

    return this.http.get(`${this.url}/obtener/id/${idEmpresa}`);

  }
  
  
}
