import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentasbancariasService {

  constructor(private http:HttpClient) { }

  public getListaCuentaBancaria():Observable<any>{
       return this.http.get("/yared/cuentaBanco/listar/todos");
  }

  public getCuentaBancariaById():Observable<any>{
      return this.http.get("/catalogos/csbanco/listar/todos");
  }


  public getListaBancos():Observable<any>{
    return this.http.get("/catalogos/csbanco/listar/todos");
  }

  public save(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    console.log("guardar");
    console.log(json);
    return this.http.put("/yared/cuentaBanco/guardar",json,httpOptions);
  }



  public  modificar(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);

    console.log(json);

    return this.http.post("/yared/cuentaBanco/modificar",json,httpOptions);
  }


  public eliminar(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    return this.http.post("/yared/cuentaBanco/eliminar",json,httpOptions);
  }

}
