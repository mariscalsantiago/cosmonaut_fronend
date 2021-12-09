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
    let ventanaemergente:any = document.getElementById("ventanaEmergente");
    ventanaemergente.style.display = "block";
    let contenido =  ventanaemergente.getElementsByClassName("contenido");
    let cuerpo:any = document.getElementById("cuerpoventanaEmergente");
    cuerpo.className= "cuerpo slide-in-blurred-top "+(exitoso?'exitoso':'error');
    let aux = mensaje.split("\n");
    let mensaje1 = aux[0];
    let mensaje2 = aux[1];
    let p1 = document.createElement("span");
    p1.innerText = mensaje1;
    let p2 = document.createElement("span");
    p2.innerText = mensaje2;

    p1.className = "direccionderecha";
    p2.className ="operacioneexitosa";
    let tituloPrincipal =ventanaemergente.getElementsByClassName("titulo");
    tituloPrincipal[0].className="direccionizquierda titulo";
    if(exitoso){
      let imagen:any = document.getElementById("errorimg");
      imagen.style.display = "none";
    }else{
      tituloPrincipal[0].style.color = "gray";
      tituloPrincipal[0].innerText = "Resultado de cálculo";
      let imagen:any = document.getElementById("successimg");
      imagen.style.display = "none";
      p1.style.color = "gray";
      p2.style.color = "gray";
    }

    let existeElemento = contenido[0].getElementsByTagName("span");
    debugger;
    if(existeElemento.length != 0) {
      contenido[0].innerHTML = ""
    };

    contenido[0].appendChild(p1);
    contenido[0].appendChild(p2);
    return this.verificador;
  }

  public guardarNotificacion(mensaje:string,exitoso:boolean,idNominaxPeriodo:number){
      if(!this.notificacionMensajes.some((o:any) => o.idNominaxPeriodo == idNominaxPeriodo)){
        this.notificacionMensajes.push({mensaje:mensaje,exitoso:exitoso,idNominaxPeriodo:idNominaxPeriodo}); 
      }
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
