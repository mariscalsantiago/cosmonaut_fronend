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

  public getActividadEconomica():Observable<any>{

    return this.http.get(`${this.url}/csActividadEconomica/listar/todos`);

  }
  public getRegimenFiscal():Observable<any>{

    return this.http.get(`${this.url}/csRegimenFiscal/listar/todos`);

  }



}
