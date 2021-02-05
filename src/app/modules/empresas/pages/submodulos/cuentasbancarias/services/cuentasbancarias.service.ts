import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentasbancariasService {

  constructor(private http:HttpClient) { }

  public getListaCuentaBancaria():Observable<any>{
       return this.http.get("/yared/cuentaBanco/listar/todos");
  }


  public getListaBancos():Observable<any>{
    let arreglobanco = {
      data:[ {
        "bancoId": 1,
        "codBanco": "002",
        "nombreCorto": "BANAMEX",
        "razonSocial": "Banco Nacional de México, S.A., Institución de Banca Múltiple, Grupo Financiero Banamex",
        "fechaInicio": "01/01/2017",
        "esActivo": true,
        "fechaAlta": "14/12/2020"
      },{
        "bancoId": 13,
        "codBanco": "044",
        "nombreCorto": "SCOTIABANK",
        "razonSocial": "Scotiabank Inverlat, S.A.",
        "fechaInicio": "01/01/2017",
        "esActivo": true,
        "fechaAlta": "14/12/2020"
      }]
    }

    const miObservable = of(arreglobanco);

    


    return miObservable;
  }

  public save(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    console.log("guardar");
    console.log(json);
    return this.http.put("/yared/cuentaBanco/guardar",json,httpOptions);
  }



  public  modificar(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);

    console.log(json);

    return this.http.post("/yared/cuentaBanco/modificar",json,httpOptions);
  }


  public eliminar(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    return this.http.post("/yared/cuentaBanco/eliminar",json,httpOptions);
  }

}
