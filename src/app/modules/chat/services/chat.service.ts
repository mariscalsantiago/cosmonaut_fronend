import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient) { }


  public getListaChatActivos(idEmpresa:number):Observable<any>{
      return this.http.get(`${direcciones.chat}/listar/${idEmpresa}`);
  }
}
