
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

    

    return this.http.put(`${direcciones.usuarios}/guardar/empleado`, json, httpOptions);

  }

  public saveBaja(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.contratoColaborador}/guardar/baja`, json, httpOptions);

  }

  public saveCargaMasiva(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.usuarios}/carga/masiva/empleados`, json, httpOptions);

  }

  public getEmpleadosCompania(idCompania: number): Observable<any> {


    return this.http.get(`${direcciones.contratoColaborador}/obtener/empresa/id/${idCompania}`);

  }
  public getEmpleadosBaja(id: number,status: boolean): Observable<any> {


    return this.http.get(`${direcciones.contratoColaborador}/lista/empleado/baja/${id}/${status}`);

  }

  public getListaErroresCargaMasiva(idEmpresa: number): Observable<any> {


    return this.http.get(`${direcciones.empleado}/lista/empleados/erroneos/${idEmpresa}`);

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

    

    return this.http.post(`${direcciones.contratoColaborador}/lista/dinamica`, json, httpOptions);
  }


  public getEmpleadosIncompletos(idEmpresa:number):Observable<any>{
    return this.http.get(`${direcciones.usuarios}/lista/empleado/incompleto/${idEmpresa}`);
  }


  public getPorcentajeavance(idEmpleado:number):Observable<any>{
      return this.http.get(`${direcciones.usuarios}/validacion/captura/empleado/${idEmpleado}`);
  }





}
