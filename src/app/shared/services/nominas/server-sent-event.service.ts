import { Injectable } from '@angular/core';
import { interval, Observable, Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerSentEventService {

  public notificacionMensajes:any = [];

  public activarIntervalo:boolean = true;

  private  evtSource!:EventSource;
  private Subject!:Subject<any>;

  public verificador:Subject<boolean> = new Subject<boolean>();




  constructor() { }


  public iniciar(nominaPeriodoId:number):Observable<any>{

    this.Subject = new Subject<any>();
    this.evtSource  = new EventSource(environment.rutaEvents+"/asincrono",{withCredentials:true});
    this.evtSource.onmessage = (evento)=>{
        this.Subject.next(evento.data);
        this.evtSource.close();
    }
    return this.Subject.pipe(map(o => JSON.parse(o)));
  }

  public showNotification(mensaje:string,exitoso:boolean):Observable<boolean>{
    let mm:any = document.getElementById("ventanaEmergente");
    mm.style.display = "block";
    let titulo =  mm.getElementsByClassName("contenido");
    titulo[0].innerText=mensaje;

    let cuerpo:any = document.getElementById("cuerpoventanaEmergente");
    cuerpo.className= "cuerpo slide-in-blurred-top "+(exitoso?'exitoso':'error');
    return this.verificador;
  }

  public guardarNotificacion(mensaje:string,exitoso:boolean){
      this.notificacionMensajes.push({mensaje:mensaje,exitoso:exitoso});
      if(this.activarIntervalo){
          this.activarIntervalo = false;
          let siguienteMensaje  = true;
          let ss:Subscription = interval(200).subscribe(()=>{
            if(siguienteMensaje){
                siguienteMensaje = false;
                let ss1:Subscription =  this.showNotification(this.notificacionMensajes[0]["mensaje"],this.notificacionMensajes[0]["exitoso"]).subscribe(valor =>{
                  this.notificacionMensajes.splice(0,1);
                  ss1.unsubscribe();
                  setTimeout(() => {
                    siguienteMensaje = valor;
                    if(this.notificacionMensajes.length == 0){
                        ss.unsubscribe();
                        this.activarIntervalo = true;
                    }
                  }, 100);
                });
            }

          });
      }
  }


  


}
