import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { modulos } from 'src/app/core/modelos/modulos';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient, private configuracionesPrd: ConfiguracionesService) { }


  public getListaRol(): Observable<modulos> {
    return this.http.get<modulos>(`${direcciones.roles}`);
  }

  public getListaModulos(activo: boolean, idVersion: number): Observable<modulos[]> {

    if (this.configuracionesPrd.isSession(this.configuracionesPrd.MODULOS)) {
      return this.configuracionesPrd.getElementosSesion(this.configuracionesPrd.MODULOS);
    } else {
      return this.http.get<any>(`${direcciones.modulos}/version/${idVersion}/listar/todosActivo/${activo}`)
        .pipe(map(valor => {
          this.configuracionesPrd.setElementosSesion(this.configuracionesPrd.MODULOS, valor.datos)
          return valor.datos;
        }));
    }


  }


  public getListaTodosSistema(): Observable<any> {
    return this.http.get(`${direcciones.roles}/listar/todosActivo/true`);
  }

  public getRolesByEmpresa(idEmpresa: any, version: number, activo: boolean): Observable<any> {
    console.log("Esto se envia", `${direcciones.roles}/cliente/${idEmpresa}/version/${version}/listar/todosActivo/${activo}`);
    return this.http.get(`${direcciones.roles}/cliente/${idEmpresa}/version/${version}/listar/todosActivo/${activo}`);
  }


  public guardarRol(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    return this.http.put(`${direcciones.roles}/guardar`, json, httpOptions);
  }

  public modificarRol(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    return this.http.post(`${direcciones.roles}/modificar`, json, httpOptions);
  }

  public guardarPermisoxModulo(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    return this.http.put(`${direcciones.permisos}/agregar`, json, httpOptions);
  }



  public quitarPermisoxModulo(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    return this.http.post(`${direcciones.permisos}/quitar`, json, httpOptions);
  }


  public getPermisosxRol(idRol: number, activo: boolean): Observable<any> {
    return this.http.get(`${direcciones.permisos}/rol/${idRol}/listar/todosActivo/${activo}`);
  }

  public eliminarRol(id: number): Observable<any> {
    return this.http.delete(`${direcciones.roles}/eliminar/${id}`);
  }

}
