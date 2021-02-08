import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentasbancariasService {

  constructor(private http:HttpClient) { }

  public getAll():Observable<any>{

    return this.http.get("/yared/cuentaBanco/listar/todos");

  }


  public getAllByEmpresa(idEmpresa:number):Observable<any>{

    return this.http.get(`/yared/cuentaBanco/obtener/cliente/${idEmpresa}`);

  }
}
