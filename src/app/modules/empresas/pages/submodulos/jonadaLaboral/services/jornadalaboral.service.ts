import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JornadalaboralService {

  constructor(private http:HttpClient) { }

  public getAll(id_compania:number):Observable<any>{
    return this.http.get("/api/grupoNomina/lista/id/compania/"+id_compania);
  }

  public getGroupNomina(id_grupo:number):Observable<any>{
    return this.http.get("/api/grupoNomina/obtener/id/"+id_grupo);
  }

  public save(obj:any):Observable<any>{
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
    
    return this.http.put("/api/grupoNomina/guardar",json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);
    return this.http.post("/api/grupoNomina/modificar",json,httpOptions);
  }


  public eliminar(id:any):Observable<any>{
    return this.http.post('/api/grupoNomina/eliminar/id/'+id,{});
  }


  public getGroupNominaEmpleado(indice:number):Observable<any>{
    return this.http.get("/api/colaboradorGrupoNomina/lista/id/grupoNomina/"+indice);

  }
}
