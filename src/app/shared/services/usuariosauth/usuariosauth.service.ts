import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class UsuariosauthService {

  constructor(private http:HttpClient) { }


  public guardar(obj:any):Observable<any>{

    const httpOptions = {
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    }


    let json = JSON.stringify(obj);

    return this.http.put(`${direcciones.usuariosAuth}/guardar`,json,httpOptions);

  }


  public modificar(obj:any):Observable<any>{

    const httpOptions = {
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    }


    let json = JSON.stringify(obj);

    return this.http.post(`${direcciones.usuariosAuth}/modificar`,json,httpOptions);

  }


  public guardarVersionsistema(obj:any):Observable<any>{
    const httpOptions = {
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    }


    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.versiones}/asignar`,json,httpOptions);
      
  }

  public actualizarVersionsistema(obj:any):Observable<any>{
    const httpOptions = {
      headers:new HttpHeaders({
        'Content-Type':'application/json'
      })
    }


    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.versiones}/modificar`,json,httpOptions);
      
  }

  public getVersionByEmpresa(idEmpresa:number):Observable<any>{
    return this.http.get(`${direcciones.versiones}/cliente/${idEmpresa}`);
  }



  public filtrarUsuarios(obj:any):Observable<any>{
     let json = JSON.stringify(obj);
      return this.http.post(`${direcciones.usuariosAuth}/filtrar`,json);
  }

  public filtrarUsuariosPaginado(obj:any,registros:number,pagina:number):Observable<any>{
    let json = JSON.stringify(obj);
     return this.http.post(`${direcciones.usuariosAuth}/filtrar/paginado/${registros}/${pagina}`,json);
 }

  public usuariosActivarDesactivar(obj:any):Observable<any>{
      let json = JSON.stringify(obj);
      return this.http.post(`${direcciones.usuariosAuth}/cambiar/estados`,json);
  }


  


}
