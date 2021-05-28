import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { direcciones } from '../../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class AdminCatalogosService {

  private url: string = '';

  constructor(private http: HttpClient) {
    this.url = direcciones.adminCatalogo;
  }


  public getListaCatalgos(estatus:boolean): Observable<any> {
       return this.http.get(`${this.url}/listaCatalogos/listar/todosActivos/${estatus}`);
  }

  public getListaBanco(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/csbanco/listar/todosActivo/${estatus}`);
}
  public getListaFacultad(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/catFacultadPoder/listar/todosActivo/${estatus}`);
  }
  public getListaMotivoBaja(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/catMotivoBaja/listar/todosActivo/${estatus}`);
  }
  public getListaParentesco(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/catParentesco/listar/todosActivo/${estatus}`);
  }
  public getListaRegimenContratacion(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/csTipoRegimenContratacion/listar/todosActivo/${estatus}`);
  }
  public getListaTarifaPeriodicaISR(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/csTarifaPeriodicaIsr/listar/todosActivo/${estatus}`);
  }
  public getListatablasPeriodicasISR():Observable<any>{
    return this.http.get(`${direcciones.tablasValores}/listar/tablasPeriodicasISR`);
  }
  public getListaTarifaPeriodicaSubsidio(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/csTarifaPeriodicaSubsidio/listar/todosActivo/${estatus}`);
  }
  public getListaTablasSubsidioISR():Observable<any>{
    return this.http.get(`${direcciones.tablasValores}/listar/tablasSubsidioISR`);
  }
  public getListaTasaAplicableISN(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/catTasaAplicableIsn/listar/todosActivo/${estatus}`);
  }
  public getListaRegimenFiscal(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/csRegimenFiscal/listar/todosActivo/${estatus}`);
  }
  public getListaTipoContrato(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/csTipoContrato/listar/todosActivo/${estatus}`);
  }
  public getListaTipoDeduccion(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/csTipoDeduccion/listar/todosActivo/${estatus}`);
  }

  public getListaReferencia(anio:number):Observable<any>{
    return this.http.get(`${direcciones.tablasValores}/listar/valorReferencia/true/${anio}`);
  }
  public getListaTipoIncapacidad(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/tipoIncapacidad/listar/todosActivo/${estatus}`);
  }
  public getListaTipoPercepcion(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/csTipoPercepcion/listar/todosActivo/${estatus}`);
  }
  public getListaValorReferencia(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/valorReferencia/listar/todosActivo/${estatus}`);
  }
  
  public getByCompany(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${this.url}/lista/compania/tipoPersona`, json, httpOptions);
  }

  public getById(id_user: number): Observable<any> {
    return this.http.get(`${this.url}/obtener/id/${id_user}`);

  }

  public filtrar(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json: string = JSON.stringify(obj);
    
    
    return this.http.post(`${this.url}/lista/dinamica`, json, httpOptions);
  }

  public save(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json: string = JSON.stringify(obj);


    
    
    return this.http.put(`${this.url}/guardar/usuario`, json, httpOptions);
  }

  public modificar(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };






    let json: string = JSON.stringify(obj);

    

    return this.http.post(`${this.url}/modificar/usuario`, json, httpOptions);
  }


 

  public modificarListaActivos(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };






    let json: string = JSON.stringify(obj);
    return this.http.post(`${this.url}/modificar/lista`, json, httpOptions);
  }



  public getPrueba(): Observable<any> {
    return this.http.get("empresas/people/?search=r2");
  }

}
