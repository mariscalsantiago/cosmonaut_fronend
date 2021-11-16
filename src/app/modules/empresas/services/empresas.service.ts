import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { direcciones } from '../../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  private url:string = '';

  constructor(private http:HttpClient) { 


    this.url = direcciones.centroCostosCliente;

  }

   public getAllEmp(idEmpresA:number):Observable<any>{
    
    return this.http.get(`${this.url}/lista/compania/empresa/${idEmpresA}`);
    

  }


  public getEmpresaById(idEmpresa:number):Observable<any>{
    
    return this.http.get(`${this.url}/obtener/id/${idEmpresa}`);
    

  }

  public getListarMovimientosIDSE():Observable<any>{
    
    return this.http.get(`${direcciones.imss}/listar/movimientos`);
    

  }

  public getListarRegistroPatronal(idEmpresa:number):Observable<any>{
    
    return this.http.get(`${direcciones.imss}/cliente/${idEmpresa}/listar/registrospatronales`);
  

  }

  public getActivos(idEmpresA:number):Observable<any>{
    
    return this.http.get(`${this.url}/validacion/captura/empresa/${idEmpresA}`);
  

  }

  public getAcuseRespuesta(idKardex:number):Observable<any>{
    
    return this.http.get(`${direcciones.tectel}/comprobante/constancia/${idKardex}`);
  

  }
  public getAcuseMovimiento(idKardex:number):Observable<any>{
    
    return this.http.get(`${direcciones.tectel}/comprobante/acuse/${idKardex}`);
  

  }

  public getAllRep(id_company:number):Observable<any>{
    return this.http.get(`${direcciones.usuarios}/obtener/id/compania/${id_company}`);
}

public recalculoPromedioVariables(id_Variabilidad:number):Observable<any>{
  return this.http.get(`${direcciones.variabilidad}/recalculo/promedio/variables/${id_Variabilidad}`);
}


  public save(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);

    return this.http.put(`${this.url}/guardar`,json,httpOptions);
  }

  public afiliaRecepcionIdse(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json:string = JSON.stringify(obj);

    return this.http.post(`${direcciones.tectel}/afiliaRecepcion`,json,httpOptions);
  }

 

  public modificar(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json:string = JSON.stringify(obj);

    return this.http.post(`${this.url}/modificar`,json,httpOptions);
  }

  public bitacoraMovimientoslistar(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json:string = JSON.stringify(obj);

    return this.http.post(`${direcciones.bitacoramovimientos}/listar`,json,httpOptions);
  }

  public filtrarIDSE(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
  
    
    return this.http.post(`${direcciones.imss}/filtrar`,json,httpOptions);
  
  }

  public calculoPromedioVariables(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
  
    
    return this.http.post(`${direcciones.variabilidad}/calculo/promedio/variables`,json,httpOptions);
  
  }

  public listaEmpleadosPromedioVariables(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
  
    
    return this.http.post(`${direcciones.variabilidad}/lista/empleados/promedio/variables`,json,httpOptions);
  
  }

  public aplicarPromedioVariables(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
  
    
    return this.http.post(`${direcciones.variabilidad}/aplicar/promedio/variables`,json,httpOptions);
  
  }

  public filtrarVariabilidad(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);
  
    
    return this.http.post(`${direcciones.imss}/variabilidad/filtrar`,json,httpOptions);
  
  }

  public eliminar(id:any):Observable<any>{

    return this.http.post(`${this.url}/eliminar/empresa/id/${id}`,{});
  }

  public eliminarPPP(id:any):Observable<any>{

    return this.http.delete(`${direcciones.imss}/eliminar/${id}`,{});
  }
    
  
}
