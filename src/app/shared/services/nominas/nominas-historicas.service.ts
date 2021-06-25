import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class NominasHistoricasService {

  constructor(private http:HttpClient) { }

  public getNominasHistoricas(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.nominasHistoricas}/consulta`,json);
  }
}
