import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';



@Injectable({
  providedIn: 'root'
})
export class NominaordinariaService {

  constructor(private http: HttpClient,private backend:HttpBackend) { 

    this.http = new HttpClient(this.backend);
  }

  public crearNomina(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaOrdinaria}/guardar/nomina`, json, httpOptions);

  }


  public calcularNomina(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaCalculo);
    return this.http.post(`${direcciones.nominaOrdinaria}/calcula/nomina/periodo`, json, httpOptions);

  }

  public getListaNominas(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaListaActivos);
    return this.http.post(`${direcciones.nominaOrdinaria}/consulta/nominas/activas`, json, httpOptions);
  }


 

  public getUsuariosCalculados(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     //return this.creandoObservable(ordinariaUsuariosCalculados);
    return this.http.post(`${direcciones.nominaOrdinaria}/lista/empleado/calculo/percepciones/deducciones`, json, httpOptions);
  }


  public getUsuariosCalculadosFiltrado(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     //return this.creandoObservable(ordinariaUsuariosCalculados);
    return this.http.post(`${direcciones.nominaOrdinaria}/lista/empleado/calculo/percepciones/deducciones/filtrar`, json, httpOptions);
  }


  public getUsuariosCalculadosDetalle(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosCalculadosDetalle);
     return this.http.post(`${direcciones.nominaOrdinaria}/detalle/nomina/empleado`,json,httpOptions);
  
  }

  public getUsuariosDispersion(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosDispersion);
    return this.http.post(`${direcciones.nominaOrdinaria}/lista/empleado/total/pago/neto`,json,httpOptions);
 }


 public getUsuariosDispersionFiltrar(obj:any):Observable<any> {
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  let json: string = JSON.stringify(obj);
  //return this.creandoObservable(ordinariaUsuariosDispersion);
  return this.http.post(`${direcciones.nominaOrdinaria}/lista/empleado/total/pago/neto/filtrar`,json,httpOptions);
}


  public getUsuariosTimbrado(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
   //return this.creandoObservable(ordinariaUsuariosTimbrado);
   return this.http.post(`${direcciones.nominaOrdinaria}/listado/empleado/total/pago/neto/fecha/timbrado`, json, httpOptions);
  }

  public getUsuariosTimbradoFiltrar(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
   //return this.creandoObservable(ordinariaUsuariosTimbrado);
   return this.http.post(`${direcciones.nominaOrdinaria}/listado/empleado/total/pago/neto/fecha/timbrado/filtrar`, json, httpOptions);
  }

  public getUsuariosTimbradoDetalle(obj:any):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosTimbradoDetalle);
    
    return this.http.post(`${direcciones.nominaOrdinaria}/detalle/empleado/total/pago/neto/detalle/monto/timbrado`,json,httpOptions);
  }

  public descargaRecibos(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaOrdinaria}/descarga/recibos`, json, httpOptions);

  }

  public descargaDispercion(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaOrdinaria}/descarga/dispercion/`, json, httpOptions);

  }


  public eliminar(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaOrdinaria}/eliminacion/nomina/ordinaria`, json, httpOptions);

  }



  //----------------Dispersar------------------------

  public dispersar(obj:any):Observable<any>{
      let json = JSON.stringify(obj);
      return this.http.put(`${direcciones.dispersion}`,json);
  }

  public statusProcesoDispersar(nominaPeriodoId:number,cantidadEmpleados:number):Observable<any>{
    return this.http.get(`${direcciones.dispersion}/procesando/${nominaPeriodoId}/${cantidadEmpleados}`);
  }

  public resumenDispersar(idPeriodo:number):Observable<any>{
    return this.http.get(`${direcciones.dispersion}/resume/${idPeriodo}`);
  }


  //----------------Timbrar>------------------------

  public timbrar(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.timbrado}/${obj.centroClienteId}`,json);
  }


  public statusProcesoTimbrar(nominaPeriodoId:number,cantidadEmpleados:number):Observable<any>{
    return this.http.get(`${direcciones.timbrado}/procesando/${nominaPeriodoId}/${cantidadEmpleados}`);
  }

  public resumenTimbrado(idPeriodo:number):Observable<any>{
    return this.http.get(`${direcciones.timbrado}/resume/${idPeriodo}`);
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
