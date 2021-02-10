import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { direcciones } from "src/assets/direcciones";

@Injectable({
  providedIn: `root`
})
export class SharedCompaniaService {

  public url:string = "";
  constructor(private http:HttpClient) {

      this.url = direcciones.centroCostosCliente;

   }

   public getAllCompany(): Observable<any> {
    return this.http.get(`${this.url}/lista/compania`);
  }

}
