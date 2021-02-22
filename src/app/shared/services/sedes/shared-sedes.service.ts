import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class SharedSedesService {


  public url:string = "";
  constructor(private http:HttpClient) { 
    this.url = direcciones.sedes;
  }
  public getsedeByEmpresa(idEmpresa:number):Observable<any>{
   return  this.http.get(`${this.url}/obtener/id/compania/${idEmpresa}`);
  }
}
