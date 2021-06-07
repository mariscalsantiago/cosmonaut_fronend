import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class UsuariosauthService {

  constructor(private http:HttpClient) { }


  public guardar(obj:any):Observable<any>{

    const httpOptions = {
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    }


    let json = JSON.stringify(obj);

    return this.http.put(`${direcciones.usuariosAuth}/guardar`,json,httpOptions);

  }


  public guardarVersionsistema(obj:any):Observable<any>{
    const httpOptions = {
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    }


    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.versiones}/asignar`,json,httpOptions);
      
  }


}
