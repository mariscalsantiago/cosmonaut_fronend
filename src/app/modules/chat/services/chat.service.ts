import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import {  Observable, Subject, timer } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/auth.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { direcciones } from 'src/assets/direcciones';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http:HttpClient,private configuracionPrd:ConfiguracionesService,
    private authPrd:AuthService) { }

  public primeravez:boolean = true;

  public subject = new Subject();
  public arreglo:any = [];




  public getListaChatActivos(idEmpresa:number):Observable<any>{
     
      if(this.primeravez){
        this.primeravez = false;
       let suscripcion:Subscription =  timer(0,2000).pipe(concatMap(()=>this.http.get(`${direcciones.chat}/listar/${idEmpresa}`)),
        tap((valor:any) =>{
          if(valor.datos !== undefined){
              if(this.arreglo?.length !== valor.datos?.length){
                  this.configuracionPrd.notificaciones += 1;
                  this.arreglo = valor.datos;
              }
          }
          
          return valor;
        }))
        .subscribe((datos:any) => {
          if(this.authPrd.isAuthenticated()){
            this.subject.next(datos);
          }else{
              suscripcion.unsubscribe();
          }
        });
      }

      return this.subject;
      
  }

  public getListaChat(idEmpresa:number):Observable<any>{
    return this.http.get(`${direcciones.chat}/listar/${idEmpresa}`)  
  }
}
