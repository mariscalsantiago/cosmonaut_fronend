import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { modulos } from 'src/app/core/modelos/modulos';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http:HttpClient) { }


  public getListaRol():Observable<modulos>{
    return this.http.get<modulos>(`${direcciones.roles}`); 
  }

  public getListaModulos(activo:boolean):Observable<modulos[]>{
    return this.http.get<any>(`${direcciones.modulos}/listar/todosActivo/${activo}`)
       .pipe(map(valor => valor.datos)); 
  }


  public getListaTodosSistema():Observable<any>{
     return this.http.get(`${direcciones.roles}/listar/todosActivo/true`);
  }

  public getRol(){

  }

  public agregar(){

  }

  public modificar(){

  }

  public eliminar(){
    
  }
}
