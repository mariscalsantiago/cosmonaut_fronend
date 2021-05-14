import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';
import { aguinaldoCalculo, aguinaldoListaActivos, aguinaldoUsuariosCalculados, aguinaldoUsuariosCalculadosDetalle, aguinaldoUsuariosDispersion, aguinaldoUsuariosTimbrado, aguinaldoUsuariosTimbradoDetalle } from './datos';

@Injectable({
  providedIn: 'root'
})
export class NominaaguinaldoService {

  constructor(private http: HttpClient) { }

  public crearNomina(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json' })};

    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/guardar/nomina/extraordinaria`, json, httpOptions);
  }

  public calcularNomina(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(aguinaldoCalculo);
   // return this.http.post(`${direcciones.orquestador}/calculo/nomina/extraordinaria/aguinaldo`, json, httpOptions);

  }

  public getListaNominas(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(aguinaldoListaActivos);
    //return this.http.post(`${direcciones.orquestador}/consulta/nomina/extraordinaria`, json, httpOptions);
  
  }

  public getUsuariosCalculados(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(aguinaldoUsuariosCalculados);
    //return this.http.post(`${direcciones.orquestador}/lista/empleado/aguinaldo`, json, httpOptions);


  }


  public getUsuariosCalculadosDetalle(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(aguinaldoUsuariosCalculadosDetalle);
    // return this.http.post(`${direcciones.orquestador}/detalle/nomina/empleado/aguinaldo`,json,httpOptions);
  }

  public getUsuariosDispersion(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    
    return this.creandoObservable(aguinaldoUsuariosDispersion);
   // return this.http.post(`${direcciones.orquestador}/lista/empleado/pago/neto/nomina/extraordinaria`, json, httpOptions);
  }


  public getUsuariosTimbrado(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(aguinaldoUsuariosTimbrado);
    // return this.http.post(`${direcciones.orquestador}/lista/empleado/total/pago/neto/nomina/extraordinaria/aguinaldo/timbrado`,json,httpOptions); 

  }

  public getUsuariosTimbradoDetalle(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(aguinaldoUsuariosTimbradoDetalle);

    // return this.http.post(`${direcciones.orquestador}/detalle/empleado/total/pago/neto/montos/nomina/extraordinaria`,json,httpOptions);
 
  }


  public creandoObservable(obj:any):Subject<any>{
    let subject = new Subject();
    setTimeout(() => {
      subject.next(JSON.parse(JSON.stringify(obj)));
      subject.complete();
    }, 2000);
    return subject;
  }
}
