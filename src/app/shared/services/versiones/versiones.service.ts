import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class VersionesService {

  constructor(private http:HttpClient) { }

  public getVersiones(activo:boolean):Observable<any>{
    return this.http.get(`${direcciones.versiones}/listar/todosActivo/${activo}`);
  }
}
