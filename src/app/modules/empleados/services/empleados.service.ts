
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  

  constructor(private http:HttpClient) { }

  public save(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    console.log(json);

    return this.http.put(`${direcciones.usuarios}/guardar/empleado`,json,httpOptions);

  }

  public getEmpleadosCompania(idCompania:number):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let obj = {
  
      centrocClienteId:{
         "centrocClienteId":idCompania
      },
      "tipoPersonaId":{
         "tipoPersonaId":5
      }
   }


   let json = JSON.stringify(obj);
   console.log(`${direcciones.usuarios}/lista/dinamica`,json);

   return this.http.post(`${direcciones.usuarios}/lista/dinamica`,json,httpOptions);

  }


}
