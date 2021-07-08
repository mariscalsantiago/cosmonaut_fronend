import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { direcciones } from '../../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class AdminDispercionTimbradoService {

  private url: string = '';

  constructor(private http: HttpClient) {
    this.url = direcciones.adminCatalogo;
  }


  public getListaProveedorTimbrado(proveedor:number): Observable<any> {
       return this.http.get(`${direcciones.adminCatalogoDisp}/cat-proveedor-timbrado/obtener/id/${proveedor}`);
  }


  public getTimbresActivos():Observable<any>{
    
    return this.http.get(`${direcciones.timbradoAdmin}/consulta/disponibles`);
  
  }

  public getCatProveDispersion(Estatus:boolean):Observable<any>{
    
    return this.http.get(`${direcciones.adminCatalogoDisp}/cat-proveedor-dispersion/listar/activo/${Estatus}`);
  
  }
  public getCatProveTimbrado(Estatus:boolean):Observable<any>{
    
    return this.http.get(`${direcciones.adminCatalogoDisp}/cat-proveedor-timbrado/listar/activo/${Estatus}`);
  
  }

  public getObtenerProveedores(idProveedor:number):Observable<any>{
    
    return this.http.get(`${direcciones.empresa}/proveedores/obtener/${idProveedor}`);
  
  }

  public proveedoresTimbres(obj:any):Observable<any>{
    const httpOptions={
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json:string = JSON.stringify(obj);

    return this.http.post(`${direcciones.empresa}/proveedores/filtrar`,json,httpOptions);
  }

  public filtrar(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json: string = JSON.stringify(obj);
    
    
    return this.http.post(`${this.url}/lista/dinamica`, json, httpOptions);
  }

  public modificarProveedores(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.empresa}/proveedores/modificar`, json, httpOptions);
  }
  

}
