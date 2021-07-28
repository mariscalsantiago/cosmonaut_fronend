import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class TablaValoresService {

  public url:string = "";

  constructor(private http:HttpClient) {

    this.url = direcciones.tablasValores;


   }

  public getListaReferencia(anio:number):Observable<any>{
       return this.http.get(`${this.url}/listar/valorReferencia/true/${anio}`);
  }
  public getListaReferenciaCat(anio:number):Observable<any>{
    return this.http.get(`${direcciones.tablasValoresCAT}/listar/valorReferencia/true/${anio}`);
}

  public getListatablasPeriodicasISR():Observable<any>{
    return this.http.get(`${this.url}/listar/tablasPeriodicasISR`);
}

public getListaTablasSubsidioISR():Observable<any>{
  return this.http.get(`${this.url}/listar/tablasSubsidioISR`);
}

  public getListaTarifaISR(periodicidad:number):Observable<any>{
    return this.http.get(`${this.url}/listar/tarifaISR/true/${periodicidad}`);
  }

  public getListaTarifaISN(estadoId:number):Observable<any>{
    return this.http.get(`${this.url}/listar/tasaAplicableISN/true/${estadoId}`);
  }

  public getListaSubcidioISR(periodicidad:number):Observable<any>{
    return this.http.get(`${this.url}/listar/tablaSubsidioIsr/true/${periodicidad}`);
  }

  public getListaInpuestoNomina():Observable<any>{
    return this.http.get(`${this.url}/listar/obtieneTablasISN`);
  }

  public getListaEstadosISN(): Observable<any> {
    return this.http.get(`${direcciones.tablasValores}/listar/estadosISN`);
  }
}
