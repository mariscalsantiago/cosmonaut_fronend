import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { direcciones } from '../../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {



  constructor(private http: HttpClient) {
  }


  public modificarListaActivos(obj: any): Observable<any> {
    return new Subject();
  }

  
  public getAllUsers(activo:any):Observable<any>{
   return this.http.get(`${direcciones.usuariosAuth}/listar/todosActivo/${activo}`);
  }


  public filtrar(obj: any): Observable<any> {
    let json: string = JSON.stringify(obj);
    
    
    return this.http.post(`${direcciones.usuarios}/lista/dinamica`, json);
  }




}
