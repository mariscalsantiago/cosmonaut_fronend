import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class NominaordinariaService {

  constructor(private http: HttpClient) {
  }

  public crearNomina(obj: any): Observable<any> {
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaOrdinaria}/guardar/nomina`, json);

  }


  public calcularNomina(obj: any): Observable<any> {
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaCalculo);
    return this.http.post(`${direcciones.nominaOrdinaria}/calcula/nomina/periodo`, json);

  }

  public recalcularNomina(obj: any): Observable<any> {
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaOrdinaria}/recalcula/nomina`, json);

  }

  public getListaNominas(obj: any): Observable<any> {

    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaListaActivos);
    return this.http.post(`${direcciones.nominaOrdinaria}/consulta/nominas/activas`, json);
  }




  public getUsuariosCalculados(obj: any): Observable<any> {
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosCalculados);
    return this.http.post(`${direcciones.nominaOrdinaria}/lista/empleado/calculo/percepciones/deducciones`, json);
  }


  public getUsuariosCalculadosFiltrado(obj: any): Observable<any> {
    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosCalculados);
    return this.http.post(`${direcciones.nominaOrdinaria}/lista/empleado/calculo/percepciones/deducciones/filtrar`, json);
  }


  public getUsuariosCalculadosDetalle(obj: any): Observable<any> {

    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosCalculadosDetalle);
    return this.http.post(`${direcciones.nominaOrdinaria}/detalle/nomina/empleado`, json);

  }

  public getUsuariosDispersion(obj: any): Observable<any> {

    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosDispersion);
    return this.http.post(`${direcciones.nominaOrdinaria}/lista/empleado/total/pago/neto`, json);
  }


  public getUsuariosDispersionFiltrar(obj: any): Observable<any> {

    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosDispersion);
    return this.http.post(`${direcciones.nominaOrdinaria}/lista/empleado/total/pago/neto/filtrar`, json);
  }


  public getUsuariosTimbrado(obj: any): Observable<any> {

    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosTimbrado);
    return this.http.post(`${direcciones.nominaOrdinaria}/listado/empleado/total/pago/neto/fecha/timbrado`, json);
  }

  public getUsuariosTimbradoFiltrar(obj: any): Observable<any> {

    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosTimbrado);
    return this.http.post(`${direcciones.nominaOrdinaria}/listado/empleado/total/pago/neto/fecha/timbrado/filtrar`, json);
  }

  public getUsuariosTimbradoDetalle(obj: any): Observable<any> {

    let json: string = JSON.stringify(obj);
    //return this.creandoObservable(ordinariaUsuariosTimbradoDetalle);

    return this.http.post(`${direcciones.nominaOrdinaria}/detalle/empleado/total/pago/neto/detalle/monto/timbrado`, json);
  }

  public descargaRecibos(obj: any): Observable<any> {

    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaOrdinaria}/descarga/recibos`, json);

  }

  public descargaDispercion(obj: any): Observable<any> {

    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaOrdinaria}/descarga/dispercion/`, json);

  }


  public eliminar(obj: any): Observable<any> {

    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaOrdinaria}/eliminacion/nomina/ordinaria`, json);

  }



  //----------------Dispersar------------------------

  public dispersar(obj: any): Observable<any> {
    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.dispersion}`, json);
  }

  public statusProcesoDispersar(nominaPeriodoId: number, cantidadEmpleados: number): Observable<any> {
    return this.http.get(`${direcciones.dispersion}/procesando/${nominaPeriodoId}/${cantidadEmpleados}`);
  }

  public resumenDispersar(idPeriodo: number): Observable<any> {
    return this.http.get(`${direcciones.dispersion}/resume/${idPeriodo}`);
  }


  //----------------Timbrar>------------------------

  public timbrar(obj: any, idCentrocliente: number): Observable<any> {
    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.timbrado}/${idCentrocliente}`, json);
  }


  public statusProcesoTimbrar(nominaPeriodoId: number, cantidadEmpleados: number,arreglo:any): Observable<any> {
    let json = JSON.stringify(arreglo);
    return this.http.post(`${direcciones.timbrado}/procesando/${nominaPeriodoId}/${cantidadEmpleados}`,json);
  }

  public resumenTimbrado(idPeriodo: number): Observable<any> {
    return this.http.get(`${direcciones.timbrado}/resume/${idPeriodo}`);
  }


  public verImssPatronal(obj: any): Observable<any> {

    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaOrdinaria}/detalle/montos/imms/patronal`, json);
  }

  public concluir(nominaPeriodoId:number,companiaid:number):Observable<any>{
    console.log(`${environment.rutaNomina}/concluir/${nominaPeriodoId}/${companiaid}`);
    return this.http.get(`${environment.rutaNomina}/concluir/${nominaPeriodoId}/${companiaid}`);
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
