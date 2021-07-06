import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';
@Injectable({
  providedIn: 'root'
})
export class ConfrontaService {

  constructor(private http:HttpClient) { }

  getEmisiones():Observable<any>{
    return this.http.get(`${direcciones.catalogo}/catTipoEmision/listar`);
  }
  getMeses(id: number):Observable<any>{
    return this.http.get(`${direcciones.catalogo}/catEmision/listar/tipo/`+id);
  }
}
