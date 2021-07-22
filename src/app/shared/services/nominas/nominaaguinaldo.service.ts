import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class NominaaguinaldoService {

  constructor(private http: HttpClient) { }

  public crearNomina(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaExtraordinaria}/guardar/nomina/extraordinaria`, json);
  }

  public calcularNomina(obj:any):Observable<any>{
    let json: string = JSON.stringify(obj);
   // return this.creandoObservable(aguinaldoCalculo);
    return this.http.post(`${direcciones.nominaExtraordinaria}/calculo/nomina/extraordinaria/aguinaldo`, json);

  }


  public recalcularNomina(obj: any): Observable<any> {
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaExtraordinaria}/recalculo`, json);

  }

  public getListaNominas(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(aguinaldoListaActivos);
    return this.http.post(`${direcciones.nominaExtraordinaria}/consulta/nomina/extraordinaria`, json);
  }

  

  public getUsuariosCalculados(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(aguinaldoUsuariosCalculados);
    return this.http.post(`${direcciones.nominaExtraordinaria}/lista/empleado/aguinaldo`, json);


  }


  public getUsuariosCalculadosFiltrado(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(aguinaldoUsuariosCalculados);
    return this.http.post(`${direcciones.nominaExtraordinaria}/lista/empleado/aguinaldo/filtrar`, json);


  }


  public getUsuariosCalculadosDetalle(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
  //  return this.creandoObservable(aguinaldoUsuariosCalculadosDetalle);
   return this.http.post(`${direcciones.nominaExtraordinaria}/detalle/nomina/empleado/aguinaldo`,json);
  }

  public getUsuariosDispersion(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
    
   // return this.creandoObservable(aguinaldoUsuariosDispersion);
   return this.http.post(`${direcciones.nominaExtraordinaria}/lista/empleado/pago/neto/nomina/extraordinaria`, json);
  }

  public getUsuariosDispersionFiltrar(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj); 
   // return this.creandoObservable(aguinaldoUsuariosDispersion);
   return this.http.post(`${direcciones.nominaExtraordinaria}/lista/empleado/pago/neto/nomina/extraordinaria/filtrar`, json);
  }


  public getUsuariosTimbrado(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(aguinaldoUsuariosTimbrado);
    return this.http.post(`${direcciones.nominaExtraordinaria}/lista/empleado/total/pago/neto/nomina/extraordinaria/aguinaldo/timbrado`,json); 

  }


  public getUsuariosTimbradoFiltrar(obj:any):Observable<any> {
    
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(aguinaldoUsuariosTimbrado);
    return this.http.post(`${direcciones.nominaExtraordinaria}/lista/empleado/total/pago/neto/nomina/extraordinaria/aguinaldo/timbrado/filtrar`,json); 

  }

  public getUsuariosTimbradoDetalle(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(aguinaldoUsuariosTimbradoDetalle);

    return this.http.post(`${direcciones.nominaExtraordinaria}/detalle/empleado/total/pago/neto/montos/nomina/extraordinaria`,json);
 
  }

  public eliminar(obj:any):Observable<any>{
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaExtraordinaria}/eliminacion/nomina/aguinaldo`, json);

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
