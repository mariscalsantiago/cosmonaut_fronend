import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { direcciones } from 'dist/cosmonaut-front/assets/direcciones';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {

  constructor(private http:HttpClient) { }


  public getSobrepago(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.empresa}/kiosco/listar/empleados`,json);
  }
}
