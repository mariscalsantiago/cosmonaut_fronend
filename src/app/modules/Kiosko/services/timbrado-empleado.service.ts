import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { direcciones } from '../../../../assets/direcciones';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimbradoEmpleadoService {

 
  constructor(private http:HttpClient) { }


  public getSobrepago(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.empresa}/kiosco/listar/empleados`,json);
  }

}
