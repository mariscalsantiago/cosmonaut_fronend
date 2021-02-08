import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {

  constructor(private http:HttpClient) { }


  public getEsquemaPago():Observable<any>{

    return this.http.get("/catalogos/esquemaPago/listar/todos");

  }

  public getMonedas():Observable<any>{

    return this.http.get("/catalogos/moneda/listar/todos");

  }

  public getMonedaById(idMoneda:number):Observable<any>{

    return this.http.get("/catalogos/moneda/obtener/id/"+idMoneda);

  }

}
