import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerSentEventService {


  private  evtSource!:EventSource;
  private Subject!:Subject<any>;



  constructor() { }


  public iniciar(nominaPeriodoId:number):Observable<any>{

    this.Subject = new Subject<any>();
    this.evtSource  = new EventSource(environment.rutaEvents+"/asincrono",{withCredentials:true});
    this.evtSource.onmessage = (evento)=>{
        this.Subject.next(evento.data);
        console.log("NOMINA ID",nominaPeriodoId);
        this.evtSource.close();
    }
    return this.Subject.pipe(map(o => JSON.parse(o)));
  }

  public showNotification(mensaje:string,exitoso:boolean){
    let mm:any = document.getElementById("ventanaEmergente");
    mm.style.display = "block";
    let titulo =  mm.getElementsByClassName("contenido");
    titulo[0].innerText=mensaje;

    let cuerpo:any = document.getElementById("cuerpoventanaEmergente");
    cuerpo.className= "cuerpo slide-in-blurred-top "+(exitoso?'exitoso':'error');
  }


}
