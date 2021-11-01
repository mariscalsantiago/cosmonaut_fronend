
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';
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

  public saveCargaMasivaEventos(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.incidencias}/carga/masiva/`, json, httpOptions);

  }

  public getEmpleadosCompania(idCompania: number): Observable<any> {


    return this.http.get(`${direcciones.contratoColaborador}/obtener/empresa/id/${idCompania}`);

  }

  public getEmpleadosCompaniaJefe(idCompania: number): Observable<any> {


    return this.http.get(`${direcciones.contratoColaborador}/obtener/empresa/id/${idCompania}`).pipe(
      flatMap((datos:any) => datos.datos),filter((valor:any) => valor.esActivo == true)
    );

  }

  public getEmpleadosAguinaldoByEmpresa(idEmpresa:number):Observable<any>{
    return this.http.get(`${direcciones.contratoColaborador}/lista/empleado/aguinaldo/${idEmpresa}`);
  }
  public getEmpleadosFiniquitoByEmpresa(idEmpresa:any):Observable<any>{
    return this.http.get(`${direcciones.contratoColaborador}/lista/empleado/finiquito/${idEmpresa}`);
  }
  public getEmpleadosBaja(id: number,status: boolean): Observable<any> {

    return this.http.get(`${direcciones.contratoColaborador}/lista/empleado/baja/${id}/${status}`);

  }

  public getFiltroCargaMasiva(idEmpresa: number,esCorrecto: boolean): Observable<any> {


    return this.http.get(`${direcciones.usuarios}/lista/carga/masiva/empleados/estatus/${idEmpresa}/${esCorrecto}`);

  }

  public getFiltroCargaMasivaEventos(idEmpresa: number,esCorrecto: boolean): Observable<any> {


    return this.http.get(`${direcciones.incidencias}/lista/carga/masiva/estatus/${idEmpresa}/${esCorrecto}`);

  }

  public getListaCargaMasiva(idEmpresa: number): Observable<any> {


    return this.http.get(`${direcciones.usuarios}/lista/carga/masiva/empleados/${idEmpresa}`);

  }

  public getListaCargaMasivaEventos(idEmpresa: number): Observable<any> {

    return this.http.get(`${direcciones.incidencias}/lista/carga/masiva/${idEmpresa}`);

  }

 
  public getEmpleadoById(idEmpleado: number): Observable<any> {
    
    return this.http.get(`${direcciones.usuarios}/obtener/id/${idEmpleado}`);
  }

  public getEmpleadoValidarFecha(idEmpleado: number): Observable<any> {
    
    return this.http.get(`${direcciones.usuarios}/validarFechaFinPago/${idEmpleado}`);
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


  public getPersonaByCorreo(correo:string,idEmpresa:number):Observable<any>{
      return this.http.get(`${direcciones.usuarios}/obtener/correo/centrocliente/${correo}/${idEmpresa}`);
  }


 





}
