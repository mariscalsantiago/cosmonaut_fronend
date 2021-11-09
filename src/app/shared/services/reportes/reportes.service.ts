import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { direcciones } from 'src/assets/direcciones';
import { environment } from 'src/environments/environment';

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
  
  public getDescargaListaEmpleadosVariabilidad(id_variabilidad:number):Observable<any>{
    return this.http.get(`${direcciones.reportes}/imss/variabilidad/${id_variabilidad}`);
 }
 public getDescargaListaEmpleados(id_empresa: number):Observable<any>{
  return this.http.get(`${direcciones.reportes}/cargaMasiva/layoutListaEmpleado/${id_empresa}`);
}

 public getCalcularDías(numeroDias:number):Observable<any>{
  return this.http.get(`${direcciones.imss}/variabilidad/calcularDias/${numeroDias}`);
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


  public getDescargaLayaoutAltasSUA(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);

    
    return this.http.post(`${direcciones.reportes}/sua/altas/`,json,httpOptions);

  }

  public getDescargaLayaoutIDSE(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);

    
    return this.http.post(`${direcciones.reportes}/idse/consulta/`,json,httpOptions);

  }


  public getDescargaLayaoutMoficacionSUA(obj:any):Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    let json = JSON.stringify(obj);

    
    return this.http.post(`${direcciones.reportes}/sua/modificacion/`,json,httpOptions);

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


  public getErroresDispersionEmpleados(idNomina:number,empleados:any):Observable<any>{
    let json = JSON.stringify(empleados);
      return this.http.post(`${direcciones.reportes}/dispersion/lista/errores/${idNomina}`,json);
  }

  public getErroresTimbradoEmpleados(idNomina:number,empleados:any):Observable<any>{
    let json = JSON.stringify(empleados);
    return this.http.post(`${direcciones.reportes}/timbrado/lista/errores/${idNomina}`,json);
}


  public getComprobanteFiscalXMLOrdinarias(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.reportes}/comprobanteFiscal/layoutComprobanteFiscalOrdinaria`,json);
  }

  public getComprobanteFiscalXMLExtraordinarias(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.reportes}/comprobanteFiscal/layoutComprobanteFiscalExtraordinaria`,json);
  }

  public getReporteNominasTabCalculados(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.reportes}/nominaDispersion/layoutReporteNomina`,json);
  }


  public getReporteNominasTabCalculadosEspeciales(obj:any):Observable<any>{
    let json = JSON.stringify(obj);
    return this.http.post(`${direcciones.reportes}/nominaDispersion/layoutReporteNominaExtraordinariaAguinaldo`,json);
  }

  public getDescargarTxtRfctabDispersar(idEmpresa:number):Observable<any>{
      return this.http.get(`${direcciones.reportes}/nominaDispersion/txtIdRfc/${idEmpresa}`);
  }


  public getHistoricoPolizaContable(idNomina:number):Observable<any>{
    return this.http.get(`${direcciones.reportes}/nominaHistorica/polizaContable/${idNomina}`);
  }

  public getFoliosnominaConcluir(obj:any):Observable<any>{
      return this.http.post(`${direcciones.reportes}/nominaHistorica/folioFiscal`,obj);
  }

  public enviarRecibosPago(idNomina:number):Observable<any>{
      return this.http.get(`${environment.rutaAdmin}/comprobantes/sendMail/${idNomina}`);
  }

  public nominaHistorica(idNomina:number):Observable<any>{
      return this.http.get(`${direcciones.reportes}/nominaHistorica/detalleNominaHistorica/${idNomina}`);
  }

  public nominaReporteRaya(idNomina:number):Observable<any>{
    return this.http.get(`${direcciones.reportes}/nominaHistorica/reporteRaya/${idNomina}`);
  }

  public crearArchivo(base64:string,nombre:string,extension:string){
    const linkSource = `data:application/${extension};base64,` + `${base64}\n`;
    const downloadLink = document.createElement("a");
    const fileName = `${nombre}.${extension}`;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
