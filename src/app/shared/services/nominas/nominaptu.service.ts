import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class NominaptuService {

  constructor(private http: HttpClient) { }

  public crearNomina(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaPtu}/guardar/nomina/ptu`, json, httpOptions);

  }


  public calcularNomina(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaCalculo);
    return this.http.post(`${direcciones.nominaPtu}/calculo/nomina/ptu`, json, httpOptions);

  }

  public recalcularNomina(obj: any): Observable<any> {
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaPtu}/recalculo/nomina/ptu`, json);

  }

  public getListaNominas(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaListaActivos);
    return this.http.post(`${direcciones.nominaPtu}/listado/nominas/ptu`, json, httpOptions);
  }


  

  public getUsuariosCalculados(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     //return this.creandoObservable(ordinariaUsuariosCalculados);
    return this.http.post(`${direcciones.nominaPtu}/lista/empleados/ptu`, json, httpOptions);
  }

  public getUsuariosCalculadosFiltrado(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     //return this.creandoObservable(ordinariaUsuariosCalculados);
    return this.http.post(`${direcciones.nominaPtu}/lista/empleados/ptu/filtrar`, json, httpOptions);
  }


  public getUsuariosCalculadosDetalle(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosCalculadosDetalle);
     return this.http.post(`${direcciones.nominaPtu}/detalle/empleado/nomina/ptu`,json,httpOptions);
  
  }

  public getUsuariosDispersion(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosDispersion);
    return this.http.post(`${direcciones.nominaPtu}/listado/empleados/total-pago-neto/ptu`,json,httpOptions);
 }

 public getUsuariosDispersionFiltrar(obj:any):Observable<any> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  let json: string = JSON.stringify(obj);
  //return this.creandoObservable(ordinariaUsuariosDispersion);
  return this.http.post(`${direcciones.nominaPtu}/listado/empleados/total-pago-neto/ptu/filtrar`,json,httpOptions);
}


  public getUsuariosTimbrado(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
   //return this.creandoObservable(ordinariaUsuariosTimbrado);
   return this.http.post(`${direcciones.nominaPtu}/listado/empleados/total-pago-neto/ptu/timbrado`, json, httpOptions);
  }

  public getUsuariosTimbradoFiltrar(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
   //return this.creandoObservable(ordinariaUsuariosTimbrado);
   return this.http.post(`${direcciones.nominaPtu}/listado/empleados/total-pago-neto/ptu/timbrado/filtrar`, json, httpOptions);
  }

  public getUsuariosTimbradoDetalle(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosTimbradoDetalle);
    
    return this.http.post(`${direcciones.nominaPtu}/detalle/empleados/total/pago-neto/detalle/montos/timbrado/ptu`,json,httpOptions);
  }

  public descargaRecibos(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaPtu}/descarga/recibos`, json, httpOptions);

  }

  public descargaDispercion(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaPtu}/descarga/dispercion/`, json, httpOptions);

  }


  public descargarArchivo(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.reportes}/cargaMasiva/layoutPTU`, json, httpOptions);

  }

  public subirArchivo(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.empresa}/ptu/carga/masiva`, json, httpOptions);

  }

  public eliminar(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaPtu}/eliminacion/nomina/ptu`, json, httpOptions);

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
