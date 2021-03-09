
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {



  constructor(private http: HttpClient) { }

  public save(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    console.log(json);

    return this.http.put(`${direcciones.usuarios}/guardar/empleado`, json, httpOptions);

  }

  public saveBaja(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    console.log(json);

    return this.http.post(`${direcciones.contratoColaborador}/guardar/baja`, json, httpOptions);

  }

  public getEmpleadosCompania(idCompania: number): Observable<any> {


    return this.http.get(`${direcciones.contratoColaborador}/obtener/empresa/id/${idCompania}`);

  }


  public getEmpleadoById(idEmpleado: number): Observable<any> {
    return this.http.get(`${direcciones.usuarios}/obtener/id/${idEmpleado}`);
  }


  public update(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    console.log("json enviado",json);

    return this.http.post(`${direcciones.usuarios}/modificar/empleado`, json, httpOptions);
  }

  public empleadoListCom(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.usuarios}/lista/compania/tipoPersona`, json, httpOptions);
  }

  public filtrar(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);

    console.log("json enviado",json);

    return this.http.post(`${direcciones.contratoColaborador}/lista/dinamica`, json, httpOptions);
  }






}
