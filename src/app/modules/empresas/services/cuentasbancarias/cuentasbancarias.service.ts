import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class CuentasbancariasService {
  public url:string = "";

  constructor(private http:HttpClient) { }

  public getAll():Observable<any>{

    return this.http.get(`${direcciones.cuentasbancarias}/listar/todos`);

  }


  public getAllByEmpresa(idEmpresa:number):Observable<any>{

    console.log("ESTA ES LA CUENTA",`${direcciones.cuentasbancarias}/obtener/cliente/${idEmpresa}`);
    return this.http.get(`${direcciones.cuentasbancarias}/obtener/cliente/${idEmpresa}`);

  }

    public getAllByDetCuentas(idEmpresa:number):Observable<any>{

    return this.http.get(`${direcciones.cuentasbancarias}/obtener/STP/cliente/${idEmpresa}`);

  }


  public save(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);
    return this.http.put(`${direcciones.cuentasbancarias}/guardarSTP`,json,httpOptions);

  }

  public modificar(obj:any):Observable<any>{

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.cuentasbancarias}/modificarSTP`,json,httpOptions);

  }


 
}
