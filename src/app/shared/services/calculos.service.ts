import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from '../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  constructor(private http: HttpClient) { }


  public calculoSueldoBruto(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/calcula/salario/bruto/mensual`, json, httpOptions);
  }

  public crearNomina(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/guardar/nomina`, json, httpOptions);
  }

  public crearNominaExtraordinria(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/guardar/nomina/extraordinaria`, json, httpOptions);
  }

  public getNominasByEmp(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/consulta/nominas/activas`, json, httpOptions);
  }
  public getConsultaNominaExtraordinaria(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/consulta/nomina/extraordinaria/`, json, httpOptions);
  }

  public calcularNomina(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/calcula/nomina/periodo`, json, httpOptions);



  }

  public calcularNominaExtraordinaria(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/calcula/nomina/periodo`, json, httpOptions);



  }


  public getEmpleadosByNomina(obj:any):Observable<any>{
    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/lista/empleado/calculo/percepciones/deducciones`, json, httpOptions);

  }


  public getEmpleadosByNominaDetalle(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/detalle/nomina/empleado`,json,httpOptions);
  }

  public getTotalEmpleadoConPagoNeto(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/detalle/nomina/empleado`,json,httpOptions);
 
  }


  public getTotalEmpleadoConPagoTimbrado(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/listado/empleado/total/pago/neto/fecha/timbrado`,json,httpOptions);
  }

  public getTotalEmpleadoConPagoTimbradoDetalle(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/detalle/empleado/total/pago/neto/detalle/monto/timbrado`,json,httpOptions);
  }

  


  public getMontosImmsPatronal(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/lista/empleado/total/pago/neto/'`,json,httpOptions);
  
  }

  public descargaRecibos(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/descarga/recibos`,json,httpOptions);
  
  }

  public descargaDispercion(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/descarga/dispercion/`,json,httpOptions);
  
  }


}
