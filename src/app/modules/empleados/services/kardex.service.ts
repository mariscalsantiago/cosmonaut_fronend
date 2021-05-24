import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class KardexService {

  public url:string = "";

  constructor(private http:HttpClient) { }

  
  public getListaMovimientos(idEmpresa:number,idEmpleado:number):Observable<any>{
    return this.http.get(`${direcciones.kardex}/listar/${idEmpresa}/${idEmpleado}`);
  }

  public getListaPorIdMovimiento(idEmpresa:number,idEmpleado:number,idMovimiento:number):Observable<any>{
    return this.http.get(`${direcciones.kardex}/listar/${idEmpresa}/${idEmpleado}/${idMovimiento}`);
  }
}
