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
  public getAllPaginado(elementos:Number,pagina:number):Observable<any>{
    return this.http.get(`${this.url}/lista/compania/paginado/${elementos}/${pagina}`);
    
   
  }
  public getAllSimple():Observable<any>{
    return this.http.get(`${this.url}/lista/compania/simple`);
    
   
  }
  public getAllEmp(idEmpresA:number):Observable<any>{
    
    return this.http.get(`${direcciones.centroCostosCliente}/lista/compania/empresa/${idEmpresA}`);
    

  }
  public getAllEmpSimple():Observable<any>{
    
    return this.http.get(`${direcciones.centroCostosCliente}/lista/empresa/simple`);
    

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
    

    return this.http.post(`${direcciones.usuarios}/modificar/contacto/inicial`,json,httpOptions);
  }

  public filtrar(obj: any): Observable<any> {
    

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    
    return this.http.post(`${this.url}/lista/dinamica`, json, httpOptions);
  }

  public filtrarPaginado(obj: any,elementos:number,pagina:number): Observable<any> {
    

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    
    return this.http.post(`${this.url}/lista/dinamica/paginado/${elementos}/${pagina}`, json, httpOptions);
  }



  public getEmpresaById(idEmpresa:number):Observable<any>{

    return this.http.get(`${this.url}/obtener/id/${idEmpresa}`);

  }
  
  
}
