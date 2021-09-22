import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class NominafiniquitoliquidacionService {

  constructor(private http: HttpClient) { }

  public crearNomina(obj: any): Observable<any> {
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaLiquidacion}/guardar/nomina/finiquito-liquidacion`, json);
  }
  public calcularNomina(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
   // return this.creandoObservable(finiquitoCalculo);
    return this.http.post(`${direcciones.nominaLiquidacion}/calcula/nomina/finiquito-liquidacion`, json);

  }

  public recalcularNomina(obj: any): Observable<any> {
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaLiquidacion}/recalcula/nomina/`, json);

  }

  public getListaNominas(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
//  return this.creandoObservable(finiquitoListaActivos);
    return this.http.post(`${direcciones.nominaLiquidacion}/lista/nomina/liquidacion`, json);

  }


  
  public getUsuariosCalculados(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(finiquitoUsuariosCalculados);
    return this.http.post(`${direcciones.nominaLiquidacion}/lista/empleados/total/pago/neto/liquidacion`, json);
  }

  public getUsuariosCalculadosFiltrado(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
   // return this.creandoObservable(finiquitoUsuariosCalculados);
    return this.http.post(`${direcciones.nominaLiquidacion}/lista/empleados/total/pago/neto/liquidacion/filtrar`, json);

  }


  public getUsuariosCalculadosDetalle(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
   // return this.creandoObservable(finiquitoUsuariosCalculadosDetalle);
   return this.http.post(`${direcciones.nominaLiquidacion}/detalle/liquidacion/empleado`, json);

  }

  public getUsuariosDispersion(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
   // return this.creandoObservable(finiquitoUsuariosDispersion);
   return this.http.post(`${direcciones.nominaLiquidacion}/lista/empleados/fechabaja/percepciones/deducciones/liquidacion`, json);

  }

  public getUsuariosDispersionFiltrar(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
   // return this.creandoObservable(finiquitoUsuariosDispersion);
   return this.http.post(`${direcciones.nominaLiquidacion}/lista/empleados/fechabaja/percepciones/deducciones/liquidacion/filtrar`, json);

  }


  public getUsuariosTimbrado(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
   // return this.creandoObservable(finiquitoUsuariosTimbrado);
    return this.http.post(`${direcciones.nominaLiquidacion}/lista/empleados/total/pagoneto/timbrado/liquidacion`, json);

  }

  public getUsuariosTimbradoFiltrar(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
   // return this.creandoObservable(finiquitoUsuariosTimbrado);
    return this.http.post(`${direcciones.nominaLiquidacion}/lista/empleados/total/pagoneto/timbrado/liquidacion/filtrar`, json);

  }

  public getUsuariosTimbradoDetalle(obj:any):Observable<any> {
    let json: string = JSON.stringify(obj);
   // return this.creandoObservable(finiquitoUsuariosTimbradoDetalle);
    return this.http.post(`${direcciones.nominaLiquidacion}/detalle/empleados/total/pagoneto/detalle/montos/timbrado/liquidacion`, json);

  }

  public eliminar(obj:any):Observable<any>{
  
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaLiquidacion}/eliminacion/nomina/liquidacion`, json);

  }


  public creandoObservable(obj: any): Subject<any> {
    let subject = new Subject();
    setTimeout(() => {
      subject.next(JSON.parse(JSON.stringify(obj)));
      subject.complete();
    }, 2000);
    return subject;
  }
}
