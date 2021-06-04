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


  public getEsquemaPago(estatus:boolean): Observable<any> {

    return this.http.get(`${this.url}/esquemaPago/listar/todosActivo/${estatus}`);

  }

  public getMonedas(estatus:boolean): Observable<any> {

    return this.http.get(`${this.url}/moneda/listar/todosActivo/${estatus}`);

  }

  public getMonedaById(idMoneda: number): Observable<any> {

    return this.http.get(`${this.url}/moneda/obtener/id/` + idMoneda);

  }

  public getCuentasBanco(estatus:boolean): Observable<any> {

     
    return this.http.get(`${this.url}/csbanco/listar/todosActivo/${estatus}`);
  }
  public getTipoCarga(estatus:boolean): Observable<any> {

     return this.http.get(`${this.url}/tipoCarga/listar/todosActivo/${estatus}`);
  }

  public getFuncionCuenta(estatus:boolean): Observable<any> {

     return this.http.get(`${this.url}/catFuncionCuenta/listar/todosActivo/${estatus}`);
  }

  public getNacinalidades(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/nacionalidad/listar/todosActivo/${estatus}`);
  }
  public getFacultadPoder(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/catFacultadPoder/listar/todosActivo/${estatus}`);
  }

  public getNacinalidadById(idNacionalidad: number): Observable<any> {
    return this.http.get(`${this.url}/nacionalidad/obtener/id/${idNacionalidad}`);
  }

  public getPreferencias(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/tipoPreferencia/listar/todosActivo/${estatus}`);
  }
  public getPreferenciasById(idPreferencia:number): Observable<any> {
    return this.http.get(`${this.url}/tipoPreferencia/obtener/id/${idPreferencia}`);
  }

  public getTipoContratos(estatus:boolean): Observable<any>{
    return this.http.get(`${this.url}/csTipoContrato/listar/todosActivo/${estatus}`);
  }

  public getCompensacion(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/tipoCompensacion/listar/todosActivo/${estatus}`);

  }

  public getCompensacionById(idTipoCompensacion:number): Observable<any> {
    return this.http.get(`${this.url}/tipoCompensacion/obtener/id/${idTipoCompensacion}`);
  }


  public getAreasGeograficas(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/areaGeografica/listar/todosActivo/${estatus}`);

  }

  public getAsentamientoByCodigoPostal(codigoPostal:any):Observable<any>{
      return this.http.get(`${this.url}/catAsentamiento/obtener/codigo/${codigoPostal}`);
  }

  public getTipoRegimencontratacion(estatus:boolean):Observable<any>{
    return this.http.get(`${this.url}/csTipoRegimenContratacion/listar/todosActivo/${estatus}`);
  }

  public getAllEstados(estatus:boolean):Observable<any>{
    return this.http.get(`${this.url}/catEstados/listar/todosActivo/${estatus}`);
  }

  public getAllMetodosPago(estatus:boolean):Observable<any>{
    return this.http.get(`${this.url}/catMetodoPago/listar/todosActivo/${estatus}`);
  }

  public getActividadEconomica(idNivel:number):Observable<any>{

    return this.http.get(`${this.url}/csActividadEconomica/obtener/todos/true/${idNivel}`);

  }

  public getActividadEconomica2(idNivel:number, idsector:number):Observable<any>{

    return this.http.get(`${this.url}/csActividadEconomica/obtener/todos/true/${idNivel}/${idsector}`);

  }
  public getRegimenFiscal(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/csRegimenFiscal/listar/todosActivo/${estatus}`);

  }


  public getPeriocidadPago(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/csPeriodicidadPago/listar/todosActivo/${estatus}`);

  }

  public getBasePeriodos(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/catBasePeriodo/listar/todosActivo/${estatus}`);

  }


  public getCatPeriodoAguinaldo(estatus:boolean):Observable<any>{
    return this.http.get(`${this.url}/catPeriodoAguinaldo/listar/todosActivo/${estatus}`);
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

  public getTipoBaseCalculo(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/tipoBaseCalculo/listar/todosActivo/${estatus}`);

  }

  public getTipoDescuentoInfonavit(estatus:boolean):Observable<any>{

    return this.http.get(`${this.url}/catTipoDescuentoInfonavit/listar/todosActivo/${estatus}`);

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

  public getTipoIncidencia(status:boolean):Observable<any>{
    return this.http.get(`${this.url}/tipoIncidencia/listar/todosActivo/${status}`);
  }

  public getTipoIncapacidad(status:boolean):Observable<any>{
      return this.http.get(`${this.url}/tipoIncapacidad/listar/todosActivo/${status}`);
  }


  public getTiposNomina(status:boolean):Observable<any>{
      return this.http.get(`${this.url}/tipoNomina/aguinaldo/listar/todosActivo/${status}`);
  }
  public getUnidadMedida(status:boolean):Observable<any>{
    return this.http.get(`${this.url}/unidad/listar/todosActivo/${status}`);
}




}
