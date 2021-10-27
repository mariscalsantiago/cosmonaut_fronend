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
    }

    return this.Subject.pipe(map(o => JSON.parse(o)));

  }


}
