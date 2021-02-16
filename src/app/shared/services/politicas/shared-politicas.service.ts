import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class SharedPoliticasService {

  constructor(private http: HttpClient) { }

  public getPoliticasByEmpresa(id_empresa: number): Observable<any> {
    return this.http.get(`${direcciones.nclPolitica}/obtener/politica/idEmpresa/${id_empresa}`);
  }
}
