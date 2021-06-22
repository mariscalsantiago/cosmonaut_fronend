import { HttpBackend, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { direcciones } from "src/assets/direcciones";

@Injectable({
  providedIn: `root`
})
export class SharedCompaniaService {

  public url:string = "";
  constructor(private http:HttpClient,private httpb:HttpBackend) {

      this.url = direcciones.centroCostosCliente;

      this.http = new HttpClient(httpb);

   }

   public getAllCompany(): Observable<any> {
     let opciones = {
      headers:new HttpHeaders({
        "Content-Type":"application/json",
        "Authorization":""
      })   
    }
    return this.http.get(`${this.url}/lista/compania`,opciones);
  }

  public getAllEmp(idEmpresA:number):Observable<any>{
    
    return this.http.get(`${this.url}/lista/compania/empresa/${idEmpresA}`);
    

  }


  public getEmpresaById(idEmpresa:number):Observable<any>{

    return this.http.get(`${this.url}/obtener/id/${idEmpresa}`);

  }

 

}
