import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class UsuariocontactorrhService {

  private url: string = '';

  constructor(private http: HttpClient) {

    this.url = direcciones.usuarios;
    this.url = '/api/persona';

  }


  public getAllUsers(): Observable<any> {
    return this.http.get("/api/persona/lista/todo/4");
  }

  public getByCompany(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json: string = JSON.stringify(obj);
    return this.http.post(`/api/persona/lista/compania/tipoPersona`, json, httpOptions);
  }

  public getById(id_user: number): Observable<any> {


    return this.http.get(`/api/persona/obtener/id/${id_user}`);

  }

  public filtrar(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json: string = JSON.stringify(obj);
    console.log("peticion filtro dinamico");
    console.log(json);
    return this.http.post("/api/persona/lista/dinamica", json, httpOptions);
  }

  public save(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json: string = JSON.stringify(obj);

    return this.http.put("/api/persona/guardar/contacto/recursosHumanos", json, httpOptions);
  }

  public modificar(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };






    let json: string = JSON.stringify(obj);

    

    return this.http.post(`/api/persona/modificar/contactoRH`, json, httpOptions);
  }


  public getAllCompany(): Observable<any> {
    return this.http.get('/api/centroCostosCliente/lista/compania');
  }


  public modificarListaActivos(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };






    let json: string = JSON.stringify(obj);
    return this.http.post("/api/persona/modificar/lista", json, httpOptions);
  }



}
