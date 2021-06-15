import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(private http:HttpClient) { }

  public getReportePerfilPersonal(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);

    
    return this.http.post(`${direcciones.reportes}/empleado/perfil/personal`,json,httpOptions);
  }

  public getTipoFormatoEmpleado(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.reportes}/cargaMasiva/layoutEmpleado/`,json,httpOptions);
  }

  public getTipoFormatoEventos(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.reportes}/cargaMasiva/layoutEventosIncidencias/`,json,httpOptions);
  }
  
  public getDescargaListaEmpleados(id_empresa:number):Observable<any>{
    return this.http.get(`${direcciones.reportes}/cargaMasiva/layoutListaEmpleado/${id_empresa}`);
 }

 public getListaEmpresaPPP(id_empresa:number):Observable<any>{
  return this.http.get(`${direcciones.reportes}/pagoComplementario/empresas/${id_empresa}`);
}

public getListaGrupoNominaPPP(id_empresa:number):Observable<any>{
  return this.http.get(`${direcciones.reportes}/pagoComplementario/grupoNomina/${id_empresa}`);
}

 public getDescargaListaEmpleadosErroneos(id_empresa:number,Id_tipoCarga: number):Observable<any>{
  return this.http.get(`${direcciones.reportes}/empleado/lista/empleados/erroneos/${id_empresa}/${Id_tipoCarga}`);
}

public getDescargaListaEventosErroneos(obj:any):Observable<any>{
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  let json = JSON.stringify(obj);

  
  return this.http.post(`${direcciones.reportes}/incidencias/lista/erroneas/`,json,httpOptions);

}

public getFiltroDinamicoPPP(obj:any):Observable<any>{
  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  let json = JSON.stringify(obj);

  
  return this.http.post(`${direcciones.reportes}/pagoComplementario/filtroDinamico/`,json,httpOptions);

}

  public getComprobanteFiscal(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);

    
    return this.http.post(`${direcciones.reportes}/empleado/perfil/personal/`,json,httpOptions);

  }

  public getDescargaLayaoutPPP(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);

    
    return this.http.post(`${direcciones.reportes}/cargaMasiva/layoutNominaPPP/`,json,httpOptions);

  }

  public getlayoutDispersionNomina(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);

    
    return this.http.post(`${direcciones.reportes}/nominaDispersion/layoutDispersionNomina`,json,httpOptions);

  }
}
