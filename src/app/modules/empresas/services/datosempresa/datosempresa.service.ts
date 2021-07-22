import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { direcciones } from '../../../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class DatosempresaService {

  private url:string = '';

  constructor(private http:HttpClient) { 
    this.url = direcciones.centroCostosCliente;
  }

  public save(obj:any):Observable<any>{
    let json:string = JSON.stringify(obj); 
    return this.http.put(`${this.url}/guardar/empresa`,json);
  }

  public saveProveedores(obj:any):Observable<any>{
    let json:string = JSON.stringify(obj); 
    return this.http.put(`${direcciones.empresa}/proveedores/guardar`,json);
  }

 

  public modificar(obj:any):Observable<any>{
    let json:string = JSON.stringify(obj);
    return this.http.post(`${this.url}/modificar/empresa`,json);
  }

    
  
}
