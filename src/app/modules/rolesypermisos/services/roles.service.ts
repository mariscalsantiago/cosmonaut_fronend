import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, flatMap, map, tap } from 'rxjs/operators';
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

  public getListaModulos(activo: boolean, idVersion: number,temp:boolean = false): Observable<modulos[]> {

    if(temp){
      return this.http.get<any>(`${direcciones.modulos}/version/4/listar/todosActivo/${activo}`).pipe(map(valor => {
        return valor.datos;
      }));;
    }


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


  public getPermisosByVersiones(versionCosmonaut:number):Observable<any>{
    if (this.configuracionesPrd.isSession(this.configuracionesPrd.PERMISOSXVERSIONES)) {
      return this.configuracionesPrd.getElementosSesion(this.configuracionesPrd.PERMISOSXVERSIONES);
    } else {
      return this.http.get<any>(`${direcciones.versiones}/submodulo/permiso`)
        .pipe(map(valor => {
          let arreglo = valor.datos.filter((valor:any) => valor.versionCosmonautId ==  versionCosmonaut);
          this.configuracionesPrd.setElementosSesion(this.configuracionesPrd.PERMISOSXVERSIONES,{datos:arreglo});
          return {datos:arreglo};
        }));
    }
  }


  public getListaTodosSistema(): Observable<any> {
    return this.http.get(`${direcciones.roles}/listar/todosActivo/true`);
  }

  public getRolesByEmpresa(idEmpresa: any, version: number, activo: boolean): Observable<any> {
    
    return this.http.get(`${direcciones.roles}/cliente/${idEmpresa}/version/${version}/listar/todosActivo/${activo}`);
  }

  public getdetalleRoles(id_empresa:any, id_rol:number):Observable<any>{
    return this.http.get(`${direcciones.roles}/cliente/${id_empresa}/rol/${id_rol}/listar`);

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
