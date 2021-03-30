import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class CuentasbancariasService {

  public url:string = "";

  constructor(private http:HttpClient) {

    this.url = direcciones.cuentasbancarias;


   }

  public getListaCuentaBancaria(cuenta:number):Observable<any>{
       return this.http.get(`${this.url}/obtieneBanco/${cuenta}`);
  }

  public getobtieneBanco():Observable<any>{
    return this.http.get(`${this.url}/listar/todos`);
  }

 
  public save(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    console.log(`guardar`);
    console.log(json);
    return this.http.put(`${this.url}/guardar`,json,httpOptions);
  }



  public  modificar(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);

    console.log(json);

    return this.http.post(`${this.url}/modificar`,json,httpOptions);
  }


  public eliminar(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    return this.http.post(`${this.url}/eliminar`,json,httpOptions);
  }


  public getCuentaBancariaByEmpresa(id_empresa:number):Observable<any>{

    return this.http.get(`${this.url}/obtener/cliente/${id_empresa}`);
  }


  public getByEmpleado(idEmpleado:number):Observable<any>{
    return  this.http.get(`${direcciones.cuentasbancarias}/obtener/persona/${idEmpleado}`);
  }

}
