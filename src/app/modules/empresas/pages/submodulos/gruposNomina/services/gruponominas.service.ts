import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class GruponominasService {

  public url:string = ``;

  constructor(private http:HttpClient) { 

    this.url = direcciones.gruponomina;
  }

  public getAll(id_compania:number):Observable<any>{
    
    return this.http.get(`${this.url}/lista/id/compania/`+id_compania);
  }

  public getGroupNomina(id_grupo:number):Observable<any>{
    return this.http.get(`${this.url}/obtener/id/`+id_grupo);
  }

  public save(obj:any):Observable<any>{
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };


    

    let json = JSON.stringify(obj);
    
    
    
    return this.http.put(`${this.url}/guardar`,json,httpOptions);
  }

  public modificar(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json = JSON.stringify(obj);

    


    return this.http.post(`${this.url}/modificar`,json,httpOptions);
  }


  public eliminar(id:any):Observable<any>{

    return this.http.post(`${this.url}/eliminar/id/${id}`,{});
  }


  public getGroupNominaEmpleado(indice:number):Observable<any>{


    return this.http.get(`${direcciones.contratoColaborador}/obtener/grupoNomina/id/`+indice);

  }


  public filtrar(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);
    

    return this.http.post(`${this.url}/lista/dinamica`,json,httpOptions);


  }

  public calculadoraBruto(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json = JSON.stringify(obj);
    

    return this.http.post(`${direcciones.calculo}/sueldo/neto/sueldo/bruto/semanal`,json,httpOptions);


  }
}
