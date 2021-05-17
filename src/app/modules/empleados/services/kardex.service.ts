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

  
  public getListaDocumentosEmpleado(idEmpresa:number,idEmpleado:number):Observable<any>{
    return this.http.get(`${direcciones.documentos}/lista/${idEmpresa}/${idEmpleado}`);
  }
}
