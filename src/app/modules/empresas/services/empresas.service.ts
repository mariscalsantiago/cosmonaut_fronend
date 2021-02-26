import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { direcciones } from '../../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  private url:string = '';

  constructor(private http:HttpClient) { 


    this.url = direcciones.centroCostosCliente;

  }

   public getAllEmp(idEmpresA:number):Observable<any>{
    
    return this.http.get(`${this.url}/lista/compania/empresa/${idEmpresA}`);
    

  }
  public getActivos(idEmpresA:number):Observable<any>{
    
    return this.http.get(`${this.url}/validacion/captura/empresa/${idEmpresA}`);
    

  }
  public getAllRep(id_company:number):Observable<any>{
    return this.http.get(`${direcciones.usuarios}/obtener/id/compania/${id_company}`);
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

  public eliminar(id:any):Observable<any>{

    return this.http.post(`${this.url}/eliminar/empresa/id/${id}`,{});
  }
    
  
}
