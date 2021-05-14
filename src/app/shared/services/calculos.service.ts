import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { direcciones } from '../../../assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class CalculosService {

  constructor(private http: HttpClient) { }


  public calculoSueldoBruto(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };




    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/calcula/salario/bruto/mensual`, json, httpOptions);
  }

  public crearNomina(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/guardar/nomina`, json, httpOptions);
  }

  public crearNominaExtraordinria(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/guardar/nomina/extraordinaria`, json, httpOptions);
  }

  public getNominasByEmp(obj: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/consulta/nominas/activas`, json, httpOptions);
  }
  public getConsultaNominaExtraordinaria(obj: any): Observable<any> {

    let jsonobj = {datos:[
      {
          "nominaExtraordinaria": {
              "nombreNomina": "PRueba fin/liq NEW CALC",
              "periodo": "EFL19/2021",
              "fechaInicio": "2021-05-08",
              "fechaFin": "2021-05-08",
              "fechaInicioIncidencias": null,
              "fechaFin_incidencias": null,
              "empleados": 1,
              "percepciones": 0.00,
              "deducciones": 0.00,
              "total": 0.00,
              "nominaXperiodoId": 300
          }
      }]};

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);

    let subject = new Subject();
    setTimeout(() => {
      subject.next(jsonobj);
      subject.complete();
    }, 2000);
    return subject;
    //return this.http.post(`${direcciones.orquestador}/consulta/nomina/extraordinaria`, json, httpOptions);
  }

  public calcularNomina(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/calcula/nomina/periodo`, json, httpOptions);



  }

  public calcularNominaExtraordinariaAguinaldo(obj: any): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    return this.http.post(`${direcciones.orquestador}/calculo/nomina/extraordinaria/aguinaldo`, json, httpOptions);



  }

  public ListaEmpleadoAguinaldo(obj: any): Observable<any> {

    let objjson = {datos:[
      {
        "calculoEmpleado": {
          "empleado": "Georgina López Luna",
          "numeroEmpleado": "STB101",
          "diasLaborados": 15.21,
          "percepciones": 12036.00,
          "deducciones": 2058.66,
          "total": 9977.34,
          "areaId": 184,
          "nominaXperiodoId": 229,
          "fechaContrato": "2020-04-01",
          "personaId": 802,
          "centrocClienteId": 464
        }
      },
      {
        "calculoEmpleado": {
          "empleado": "Rosalba Gómez Gill",
          "numeroEmpleado": "STB102",
          "diasLaborados": 15.21,
          "percepciones": 13082.48,
          "deducciones": 2300.90,
          "total": 10781.58,
          "areaId": 184,
          "nominaXperiodoId": 229,
          "fechaContrato": "2020-02-01",
          "personaId": 803,
          "centrocClienteId": 464
        }
      }
    ]};


    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);

    let subject = new Subject();
    setTimeout(() => {
      subject.next(objjson);
      subject.complete();
    }, 2000);

    return subject;
    //return this.http.post(`${direcciones.orquestador}/lista/empleado/aguinaldo`, json, httpOptions);



  }



  public getEmpleadosByNomina(obj:any):Observable<any>{

    let objjson = {datos:[
      {
        "calculoEmpleado": {
          "empleado": "Georgina López Luna",
          "numeroEmpleado": "STB101",
          "diasLaborados": 15.21,
          "percepciones": 12036.00,
          "deducciones": 2058.66,
          "total": 9977.34,
          "areaId": 184,
          "nominaXperiodoId": 229,
          "fechaContrato": "2020-04-01",
          "personaId": 802,
          "centrocClienteId": 464
        }
      },
      {
        "calculoEmpleado": {
          "empleado": "Rosalba Gómez Gill",
          "numeroEmpleado": "STB102",
          "diasLaborados": 15.21,
          "percepciones": 13082.48,
          "deducciones": 2300.90,
          "total": 10781.58,
          "areaId": 184,
          "nominaXperiodoId": 229,
          "fechaContrato": "2020-02-01",
          "personaId": 803,
          "centrocClienteId": 464
        }
      }
    ]};


    
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);

    let subject = new Subject();
    setTimeout(() => {
      subject.next(objjson);
      subject.complete();
    }, 2000);

    return subject;
    //return this.http.post(`${direcciones.orquestador}/lista/empleado/calculo/percepciones/deducciones`, json, httpOptions);

  }


  public getEmpleadosByNominaDetalle(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
    let objjson = {datos:[
      {
          "detalleNominaEmpleado": {
              "salarioDiario": 756.17,
              "salarioBaseCotizacion": 791.41,
              "impuestoNomina": 230,
              "provisionVacaciones": 189.04,
              "imssPatronal": 2163.69,
              "provisionPrimaVacacional": 47.27,
              "provisionAguinaldo": 472.61,
              "diasLaborados": 15.21,
              "diasPeriodo": 15.21,
              "diasAusencia": 0,
              "diasIncapacidad": 0,
              "diasVacaciones": 0,
              "diasEconomicos": 0,
              "diasFestivoLabor": 0,
              "diasDescansoLabor": 0,
              "diasDescansoLaborDom": 0,
              "percepciones": [
                  {
                      "concepto": "Sueldos",
                      "montoTotal": 12036.00
                  },
                  {
                      "concepto": "Tipo Otros Pagos",
                      "montoTotal": 0.00
                  }
              ],
              "deducciones": [
                  {
                      "concepto": "ISR",
                      "montoCuota": 1745.37
                  },
                  {
                      "concepto": "IMSS",
                      "montoCuota": 313.29
                  }
              ]
          }
      }
  ]};

   let observable = new Subject();
   setTimeout(() => {
      observable.next((objjson));
      observable.complete();
   }, 2000);
   return observable;
    // return this.http.post(`${direcciones.orquestador}/detalle/nomina/empleado`,json,httpOptions);
  }

  public getTotalEmpleadoConPagoNeto(obj:any):Observable<any>{


    let objjson = {datos:[
      {
          "empleadoApago": {
              "nombreEmpleado": "Georgina",
              "apellidoPatEmpleado": "López",
              "apellidoMatEmpleado": "Luna",
              "banco": null,
              "totalNetoEndinero": 9977.34,
              "tipoPago": "Efectivo",
              "status": "ESTATUS_PAGO"
          }
      },
      {
          "empleadoApago": {
              "nombreEmpleado": "Rosalba",
              "apellidoPatEmpleado": "Gómez",
              "apellidoMatEmpleado": "Gill",
              "banco": null,
              "totalNetoEndinero": 10781.58,
              "tipoPago": "Cheque",
              "status": "ESTATUS_PAGO"
          }
      }
  ]}
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);

    let subject = new Subject();
    setTimeout(() => {
        subject.next(objjson);
        subject.complete();
    }, 2000);
    return subject;

     //return this.http.post(`${direcciones.orquestador}/detalle/nomina/empleado`,json,httpOptions);
 
  }


  public getTotalEmpleadoConPagoTimbrado(obj:any):Observable<any>{


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/listado/empleado/total/pago/neto/fecha/timbrado`,json,httpOptions);
  }

  public getTotalEmpleadoConPagoTimbradoDetalle(obj:any):Observable<any>{

    let objjson = {datos:[
      {
          "xmlPreliminar": {
              "percepcion": [
                  {
                      "percepciones": "Sueldos",
                      "monto": 13082.48,
                      "gravado": 13082.48,
                      "exento": 0.00
                  },
                  {
                      "percepciones": "Tipo Otros Pagos",
                      "monto": 0.00,
                      "gravado": 0.00,
                      "exento": 0.00
                  }
              ],
              "deduccion": [
                  {
                      "deducciones": "ISR",
                      "monto": 1958.96
                  },
                  {
                      "deducciones": "IMSS",
                      "monto": 341.94
                  }
              ],
              "totalMontoPercepciones": 13082.48,
              "totalGravado": 13082.48,
              "totalExento": 0,
              "totalMontoDeducciones": 2300.9
          }
      }
  ]}


    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);


    let subject = new Subject();
    setTimeout(() => {
      subject.next(objjson);
      subject.complete();
    }, 2000);

    return subject;

    // return this.http.post(`${direcciones.orquestador}/detalle/empleado/total/pago/neto/detalle/monto/timbrado`,json,httpOptions);
  }

  


  public getMontosImmsPatronal(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/lista/empleado/total/pago/neto/'`,json,httpOptions);
  
  }

  public descargaRecibos(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/descarga/recibos`,json,httpOptions);
  
  }

  public descargaDispercion(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/descarga/dispercion/`,json,httpOptions);
  
  }





  //Nómina de finiquito

  public crearNominaFiniquitoLiquidacion(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json: string = JSON.stringify(obj);
     return this.http.post(`${direcciones.orquestador}/guardar/nomina/finiquito-liquidacion`,json,httpOptions);
  
  }


}
