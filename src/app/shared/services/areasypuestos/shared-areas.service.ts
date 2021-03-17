import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class SharedAreasService {

  constructor(private http:HttpClient) { }

  public getAreasByEmpresa(idEmpresa:number):Observable<any>{

    return this.http.get(`${direcciones.area}/obtener/idCliente/${idEmpresa}`);

  }

  public getPuestosPorEmpresa(idEmpresa:number):Observable<any>{
    return this.http.get(`${direcciones.area}/obtener/cliente/id/${idEmpresa}`);
  }

  public getPuestoByArea(idEmpresa:number,idArea:number):Observable<any>{
      return this.http.get(`${direcciones.area}/obtener/cliente/area/${idEmpresa}/${idArea}`);
  }
}
