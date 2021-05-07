import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  public url:string = "";

  constructor(private http:HttpClient) { }

  public save(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    console.log(json);

    return this.http.put(`${direcciones.documentos}/guardar`, json, httpOptions);

  }

  public modificar(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json:string = JSON.stringify(obj);

    return this.http.post(`${direcciones.documentos}/remplazar`,json,httpOptions);
  }

  public eliminar(id:any):Observable<any>{

    return this.http.delete(`${direcciones.documentos}/eliminar/documentos/${id}`,{});
  }


  public getDocumentosEmpleado():Observable<any>{
    return this.http.get(`${direcciones.documentos}/obtener/tipo/documentos`);
  }

  public getDescargaDocEmpleado(idDocumento:number):Observable<any>{
    return this.http.get(`${direcciones.documentos}/descargar/${idDocumento}`);
  }
  
  public getListaDocumentosEmpleado(idEmpresa:number,idEmpleado:number):Observable<any>{
    return this.http.get(`${direcciones.documentos}/lista/${idEmpresa}/${idEmpleado}`);
  }
}
