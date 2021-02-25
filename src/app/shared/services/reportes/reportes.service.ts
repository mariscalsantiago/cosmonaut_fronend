import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http:HttpClient) { }

  public getReportePerfilPersonal(idPersona:number):Observable<any>{
    return this.http.get(`${direcciones.reportes}/perfil/personal/${idPersona}`);
  }
}
