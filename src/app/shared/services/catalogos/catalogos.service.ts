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


}
