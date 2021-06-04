import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http:HttpClient) { }

  public getReportePerfilPersonal(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    
    return this.http.post(`${direcciones.reportes}/empleado/perfil/personal`,json,httpOptions);
  }

  public getTipoFormatoEmpleado(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.reportes}/cargaMasiva/layoutEmpleado/`,json,httpOptions);
  }

  public getDescargaListaEmpleados(id_empresa:number):Observable<any>{
    return this.http.get(`${direcciones.reportes}/cargaMasiva/layoutListaEmpleado/${id_empresa}`);
 }

  public getComprobanteFiscal(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);

    
    return this.http.post(`${direcciones.reportes}/empleado/perfil/personal`,json,httpOptions);

  }

  public getlayoutDispersionNomina(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);

    
    return this.http.post(`${direcciones.reportes}/nominaDispersion/layoutDispersionNomina`,json,httpOptions);

  }
}
