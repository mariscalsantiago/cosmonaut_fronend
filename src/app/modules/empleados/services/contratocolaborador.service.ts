import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ContratocolaboradorService {

  constructor(private http:HttpClient) { }

  public save(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.contratoColaborador}/guardar`,json,httpOptions);

  }

  public saveReactivar(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.contratoColaborador}/guardar/reactivar`,json);

  }

  public update(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.contratoColaborador}/modificar`,json,httpOptions);

  }

  public updateCmpensacionKardex(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.contratoColaborador}/modificar/compensacion`,json);
  }


  public getContratoColaboradorById(idEmpleado:number):Observable<any>{

    return this.http.get(`${direcciones.contratoColaborador}/obtener/persona/id/${idEmpleado}`);


  }
}
