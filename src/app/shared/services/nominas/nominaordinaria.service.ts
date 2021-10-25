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

  public dispersar(obj: any,idEmpresa:number): Observable<any> {
    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.dispersion}/${idEmpresa}`, json);
  }

  public statusProcesoDispersar(nominaPeriodoId: number, empleados: any): Observable<any> {
    let json = JSON.stringify(empleados);
    return this.http.post(`${direcciones.dispersion}/procesando/${nominaPeriodoId}`,json);
  }

  public resumenDispersar(idPeriodo: number,arrayEmpleados:any): Observable<any> {
    let json = JSON.stringify(arrayEmpleados);
    return this.http.post(`${direcciones.dispersion}/resume/${idPeriodo}`,json);
  }


  //----------------Timbrar>------------------------

  public timbrar(obj: any, idCentrocliente: number): Observable<any> {
    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.timbrado}/${idCentrocliente}`, json);
  }


  public statusProcesoTimbrar(nominaPeriodoId: number, cantidadEmpleados: number, arreglo: any): Observable<any> {
    let json = JSON.stringify(arreglo);
    return this.http.post(`${direcciones.timbrado}/procesando/${nominaPeriodoId}`, json);
  }

  public resumenTimbrado(idPeriodo: number,arrayEmpleados:any): Observable<any> {
    let json = JSON.stringify(arrayEmpleados);
    return this.http.post(`${direcciones.timbrado}/resume/${idPeriodo}`,json);
  }


  public verImssPatronal(obj: any): Observable<any> {

    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominaOrdinaria}/detalle/montos/imms/patronal`, json);
  }

  public verIsn(nominaPeriodoId:number,personaId:number): Observable<any> {
    return this.http.get(`${environment.rutaNomina}/percepciones/listar/empleado/${nominaPeriodoId}/${personaId}`);
  }

  public concluir(nominaPeriodoId: number, companiaid: number): Observable<any> {
    
    return this.http.get(`${environment.rutaNomina}/concluir/${nominaPeriodoId}/${companiaid}`);
  }


  public concluirNomina(nominaPeriodoId:number):Observable<any>{
      return this.http.post(`${environment.rutaNomina}/concluir/${nominaPeriodoId}`,{});
  }


  public dispersarOtrosTiposMetodosPago(obj: any): Observable<any> {
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.dispersion}/modifica/estatus/empleado/dispersado`, json);
  }


  public getUsuariosContempladosOtrasNominas(idNomina:number):Observable<any>{
      return this.http.get(`${direcciones.nominaOrdinaria}/lista/empleados/calulados/${idNomina}`);
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
