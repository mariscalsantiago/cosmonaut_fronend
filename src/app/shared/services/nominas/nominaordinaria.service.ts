import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';
import { ordinariaCalculo, ordinariaListaActivos,ordinariaUsuariosCalculados,ordinariaUsuariosCalculadosDetalle,
  ordinariaUsuariosDispersion, 
  ordinariaUsuariosTimbrado,
  ordinariaUsuariosTimbradoDetalle} from './datos';


@Injectable({
  providedIn: 'root'
})
export class NominaordinariaService {

  constructor(private http: HttpClient) { }

  public crearNomina(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/guardar/nomina`, json, httpOptions);

  }


  public calcularNomina(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaCalculo);
    return this.http.post(`${direcciones.orquestador}/calcula/nomina/periodo`, json, httpOptions);

  }

  public getListaNominas(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaListaActivos);
    return this.http.post(`${direcciones.orquestador}/consulta/nominas/activas`, json, httpOptions);
  }

  public getUsuariosCalculados(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     //return this.creandoObservable(ordinariaUsuariosCalculados);
    return this.http.post(`${direcciones.orquestador}/lista/empleado/calculo/percepciones/deducciones`, json, httpOptions);
  }


  public getUsuariosCalculadosDetalle(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosCalculadosDetalle);
     return this.http.post(`${direcciones.orquestador}/detalle/nomina/empleado`,json,httpOptions);
  
  }

  public getUsuariosDispersion(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosDispersion);
    return this.http.post(`${direcciones.orquestador}/lista/empleado/total/pago/neto`,json,httpOptions);
 }


  public getUsuariosTimbrado(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
   //return this.creandoObservable(ordinariaUsuariosTimbrado);
   return this.http.post(`${direcciones.orquestador}/listado/empleado/total/pago/neto/fecha/timbrado`, json, httpOptions);
  }

  public getUsuariosTimbradoDetalle(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosTimbradoDetalle);
    return this.http.post(`${direcciones.orquestador}/detalle/empleado/total/pago/neto/detalle/monto/timbrado`,json,httpOptions);
  }

  public descargaRecibos(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/descarga/recibos`, json, httpOptions);

  }

  public descargaDispercion(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/descarga/dispercion/`, json, httpOptions);

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
