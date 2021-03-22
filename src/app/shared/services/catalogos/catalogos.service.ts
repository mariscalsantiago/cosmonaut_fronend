import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  public url: string = ``;

  constructor(private http: HttpClient) {

    this.url = direcciones.catalogo;

  }


  public getEsquemaPago(): Observable<any> {

    return this.http.get(`${this.url}/esquemaPago/listar/todos`);

  }

  public getMonedas(): Observable<any> {

    return this.http.get(`${this.url}/moneda/listar/todos`);

  }

  public getMonedaById(idMoneda: number): Observable<any> {

    return this.http.get(`${this.url}/moneda/obtener/id/` + idMoneda);

  }

  public getCuentasBanco(): Observable<any> {

     
    return this.http.get(`${this.url}/csbanco/listar/todos`);
  }

  public getNacinalidades(): Observable<any> {
    return this.http.get(`${this.url}/nacionalidad/listar/todos`);
  }
  public getNacinalidadById(idNacionalidad: number): Observable<any> {
    return this.http.get(`${this.url}/nacionalidad/obtener/id/${idNacionalidad}`);
  }

  public getPreferencias(): Observable<any> {
    return this.http.get(`${this.url}/tipoPreferencia/listar/todos`);
  }
  public getPreferenciasById(idPreferencia:number): Observable<any> {
    return this.http.get(`${this.url}/tipoPreferencia/obtener/id/${idPreferencia}`);
  }

  public getTipoContratos(): Observable<any>{
    return this.http.get(`${this.url}/csTipoContrato/listar/todos`);
  }

  public getCompensacion():Observable<any>{

    return this.http.get(`${this.url}/tipoCompensacion/listar/todos`);

  }

  public getCompensacionById(idTipoCompensacion:number): Observable<any> {
    return this.http.get(`${this.url}/tipoCompensacion/obtener/id/${idTipoCompensacion}`);
  }


  public getAreasGeograficas():Observable<any>{

    return this.http.get(`${this.url}/areaGeografica/listar/todos`);

  }

  public getAsentamientoByCodigoPostal(codigoPostal:any):Observable<any>{
      return this.http.get(`${this.url}/catAsentamiento/obtener/codigo/${codigoPostal}`);
  }

  public getTipoRegimencontratacion():Observable<any>{
    return this.http.get(`${this.url}/csTipoRegimenContratacion/listar/todos`);
  }

  public getAllEstados():Observable<any>{
    return this.http.get(`${this.url}/catEstados/listar/todos`);
  }

  public getAllMetodosPago():Observable<any>{
    return this.http.get(`${this.url}/catMetodoPago/listar/todos`);
  }

  public getActividadEconomica(idNivel:number):Observable<any>{

    return this.http.get(`${this.url}/csActividadEconomica/obtener/todos/true/${idNivel}`);

  }
  public getRegimenFiscal():Observable<any>{

    return this.http.get(`${this.url}/csRegimenFiscal/listar/todos`);

  }


  public getPeriocidadPago():Observable<any>{

    return this.http.get(`${this.url}/csPeriodicidadPago/listar/todos`);

  }

  public getBasePeriodos():Observable<any>{

    return this.http.get(`${this.url}/catBasePeriodo/listar/todos`);

  }


  public getCatPeriodoAguinaldo():Observable<any>{
    return this.http.get(`${this.url}/catPeriodoAguinaldo/listar/todos`);
  }

  public getTipoJornadas(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/csTipoJornada/listar/todosActivo/${estatus}`);

  }

  public getSumaHras(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/catSumaHorasJornada/listar/todosActivo/${estatus}`);

  }
  
  
  public getMotivoBajaEmpleado(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/catMotivoBaja/listar/todosActivo/${estatus}`);

  }

  public getTipoBajaEmpleado(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/tipoBaja/listar/todosActivo/${estatus}`);

  }

  public getTipoPercepcion(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/csTipoPercepcion/listar/todosActivo/${estatus}`);

  }

  public getTipoDeduccion(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/csTipoDeduccion/listar/todosActivo/${estatus}`);

  }


  public getCatalogoParentezco(status:boolean):Observable<any>{
    return this.http.get(`${this.url}/catParentesco/listar/todosActivo/${status}`);
  }


}
