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
       return this.http.get(`${this.url}/listaCatalogos/listar/todosActivo/${estatus}`);
  }

  public getListaBanco(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/csbanco/listar/todosActivo/${estatus}`);
}
  public getListaFacultad(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/catFacultadPoder/listar/todosActivo/${estatus}`);
  }
  public getListaDispersion(): Observable<any> {
    return this.http.get(`${direcciones.proveedores}/proveedor-dispersion/listar/todos`);
  }
  public getListaTimbrado(): Observable<any> {
    return this.http.get(`${direcciones.proveedores}/proveedor-timbrado/listar/todos`);
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
  public getListaEstadosISN(): Observable<any> {
    return this.http.get(`${direcciones.tablasValores}/listar/estadosISN`);
  }
  public getListaTarifaISR(periodicidad:number):Observable<any>{
    return this.http.get(`${direcciones.tablasValores}/listar/tarifaISR/true/${periodicidad}`);
  }
  public getListaSubcidioISR(periodicidad:number):Observable<any>{
    return this.http.get(`${direcciones.tablasValores}/listar/tablaSubsidioIsr/true/${periodicidad}`);
  }
  public getListaAplicableISN(estado:number):Observable<any>{
    return this.http.get(`${direcciones.tablasValores}/listar/tasaAplicableISN/true/${estado}`);
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
  public getListaFuncionCuenta(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/catFuncionCuenta/listar/todosActivo/${estatus}`);
  }
  public getListaMetodoPago(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/catMetodoPago/listar/todosActivo/${estatus}`);
  }
  public getListaMoneda(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/moneda/listar/todosActivo/${estatus}`);
  }
  public getListaNacionalidad(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/nacionalidad/listar/todosActivo/${estatus}`);
  }
  public getListaTipoValorReferencia(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/catTipoValorReferencia/listar/todosActivo/${estatus}`);
  }
  public getListaTipoPercepcion(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/csTipoPercepcion/listar/todosActivo/${estatus}`);
  }
  public getListaTipoEvento(estatus:boolean): Observable<any> {
    return this.http.get(`${this.url}/tipoIncidencia/listar/todosActivo/${estatus}`);
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

  public saveBanco(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/csbanco/guardar`, json, httpOptions);
  }
  public saveFacultad(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/catFacultadPoder/guardar`, json, httpOptions);
  }
  public saveFuncionCuenta(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/catFuncionCuenta/guardar`, json, httpOptions);
  }
  public saveTipoContrato(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/csTipoContrato/guardar`, json, httpOptions);
  }

  public saveRegimenContratacion(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/csTipoRegimenContratacion/guardar`, json, httpOptions);
  }

  public saveMoneda(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/moneda/guardar`, json, httpOptions);
  }

  public saveParentesco(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/catParentesco/guardar`, json, httpOptions);
  }
  public saveTipoIncidencia(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/tipoIncidencia/guardar`, json, httpOptions);
  }
  public saveMetodoPago(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/catMetodoPago/guardar`, json, httpOptions);
  }
  public saveValorReferencia(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/catTipoValorReferencia/guardar`, json, httpOptions);
  }
  public saveTarifaPeriodicaISR(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/csTarifaPeriodicaIsr/guardar`, json, httpOptions);
  }
  public saveAplicableISN(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/catTasaAplicableIsn/guardar`, json, httpOptions);
  }
  public saveTarifaPeriodicaSubsidio(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/csTarifaPeriodicaSubsidio/guardar`, json, httpOptions);
  }
  public saveTipoIncapacidad(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/tipoIncapacidad/guardar`, json, httpOptions);
  }

  public saveReferencia(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/valorReferencia/guardar`, json, httpOptions);
  }

  public saveMotivoBaja(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/catMotivoBaja/guardar`, json, httpOptions);
  }

  public saveTipoDeduccion(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/csTipoDeduccion/guardar`, json, httpOptions);
  }

  public saveRegimenFiscal(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/csRegimenFiscal/guardar`, json, httpOptions);
  }
  public saveNacionalidad(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/nacionalidad/guardar`, json, httpOptions);
  }

  public saveTipoPercepcion(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.put(`${this.url}/csTipoPercepcion/guardar`, json, httpOptions);
  }
  public modificarBanco(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/csbanco/modificar`, json, httpOptions);
  }

  public modificarFacultad(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/catFacultadPoder/modificar`, json, httpOptions);
  }

  public modificarFuncionCuenta(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/catFuncionCuenta/modificar`, json, httpOptions);
  }
  public modificarTipoContrato(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/csTipoContrato/modificar`, json, httpOptions);
  }

  public modificarRegimenContratacion(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/csTipoRegimenContratacion/modificar`, json, httpOptions);
  }

  public modificarMoneda(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/moneda/modificar`, json, httpOptions);
  }

  public modificarParentesco(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/catParentesco/modificar`, json, httpOptions);
  }
  public modificarTipoIncidencia(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/tipoIncidencia/modificar`, json, httpOptions);
  }
  public modificarMetodoPago(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/catMetodoPago/modificar`, json, httpOptions);
  }
  public modificarValorReferencia(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/catTipoValorReferencia/modificar`, json, httpOptions);
  }
  public modificarTarifaPeriodicaISR(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/csTarifaPeriodicaIsr/modificar/multiple`, json, httpOptions);
  }

  public modificarAplicableISN(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/catTasaAplicableIsn/modificar/multiple`, json, httpOptions);
  }

  public modificarTarifaPeriodicaSubsidio(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/csTarifaPeriodicaSubsidio/modificar/multiple`, json, httpOptions);
  }
  public modificarTipoIncapacidad(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/tipoIncapacidad/modificar`, json, httpOptions);
  }
  public modificarReferencia(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/valorReferencia/modificar`, json, httpOptions);
  }
  public modificarMotivoBaja(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/catMotivoBaja/modificar`, json, httpOptions);
  }
  public modificarRegimenFiscal(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/csRegimenFiscal/modificar`, json, httpOptions);
  }

  public modificarNacionalidad(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/nacionalidad/modificar`, json, httpOptions);
  }

  public modificarTipoPercepcion(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
  
    return this.http.post(`${this.url}/csTipoPercepcion/modificar`, json, httpOptions);
  }


}
