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

  public getListaPercepcionesEmpleado(id_persona:number,id_empresa:number):Observable<any>{
    return this.http.get(`${direcciones.conceptos}/obtienePercepcionEmpleado/${id_persona}/${id_empresa}`);
}

public getListaDeduccionesEmpleado(id_persona:number,id_empresa:number):Observable<any>{
  return this.http.get(`${direcciones.conceptos}/obtieneDeduccionEmpleado/${id_persona}/${id_empresa}`);
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

  public savePercepcionEmpleado(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    console.log(`guardar`);
    console.log(json);
    return this.http.put(`${direcciones.conceptos}/guardaPercepcionEmpleado`,json,httpOptions);
  }

  public modificarPercepcionEmpleado(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    console.log(`guardar`);
    console.log(json);
    return this.http.post(`${direcciones.conceptos}/modificaPercepcionEmpleado`,json,httpOptions);
  }

  public saveDeduccionEmpleado(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    console.log(`guardar`);
    console.log(json);
    return this.http.put(`${direcciones.conceptos}/guardaDeduccionEmpleado`,json,httpOptions);
  }

  public modificarDeduccionEmpleado(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    console.log(`guardar`);
    console.log(json);
    return this.http.post(`${direcciones.conceptos}/modificaDeduccionEmpleado`,json,httpOptions);
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

  public getObtenerMontoPercepcion(montoTotal:number,numeroPeriodos:number):Observable<any>{
    return  this.http.get(`${direcciones.conceptos}/obtener/monto/percepcion/${montoTotal}/${numeroPeriodos}`);
  }

  public getObtenerPeriodicidad(id_empresa:number,tipoPeriodicidad:string):Observable<any>{
    return  this.http.get(`${direcciones.conceptos}/obtener/percepcion/periodicidad/${id_empresa}/${tipoPeriodicidad}`);
  }

  public getObtenerDeduccion(id_empresa:number):Observable<any>{
    return  this.http.get(`${direcciones.conceptos}/obtener/deduccion/${id_empresa}`);
  }
}
