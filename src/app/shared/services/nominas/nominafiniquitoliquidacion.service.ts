import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';
import { finiquitoCalculo, finiquitoListaActivos } from './datos';

@Injectable({
  providedIn: 'root'
})
export class NominafiniquitoliquidacionService {

  constructor(private http: HttpClient) { }

  public crearNomina(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/guardar/nomina/finiquito-liquidacion`, json, httpOptions);
  }
  public calcularNomina(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(finiquitoCalculo);
   // return this.http.post(`${direcciones.orquestador}/guardar/pordefinir/finiquito-liquidacion`, json, httpOptions);

  }

  public getListaNominas(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(finiquitoListaActivos);
   // return this.http.post(`${direcciones.orquestador}/guardar/pordefinir/finiquito-liquidacion`, json, httpOptions);

  }

  public getUsuariosCalculados(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(finiquitoListaActivos);
   // return this.http.post(`${direcciones.orquestador}/guardar/pordefinir/finiquito-liquidacion`, json, httpOptions);

  }


  public getUsuariosCalculadosDetalle(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(finiquitoListaActivos);
   // return this.http.post(`${direcciones.orquestador}/guardar/pordefinir/finiquito-liquidacion`, json, httpOptions);

  }

  public getUsuariosDispersion(obj:any):Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(finiquitoListaActivos);
   // return this.http.post(`${direcciones.orquestador}/guardar/pordefinir/finiquito-liquidacion`, json, httpOptions);

  }


  public getUsuariosTimbrado(obj:any):Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(finiquitoListaActivos);
   // return this.http.post(`${direcciones.orquestador}/guardar/pordefinir/finiquito-liquidacion`, json, httpOptions);

  }

  public getUsuariosTimbradoDetalle(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.creandoObservable(finiquitoListaActivos);
   // return this.http.post(`${direcciones.orquestador}/guardar/pordefinir/finiquito-liquidacion`, json, httpOptions);

  }

  public creandoObservable(obj: any): Subject<any> {
    let subject = new Subject();
    setTimeout(() => {
      subject.next(obj);
      subject.complete();
    }, 2000);
    return subject;
  }
}
