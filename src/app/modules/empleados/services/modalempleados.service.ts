import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalempleadosService {

  public observador = new Subject();

  public modal:any;
  public objEnviar:any;

  constructor() { }


  public getModal(){
    return this.modal;
  }

  public setModal(modal:any){
    this.modal = modal;
  }

  public getObjenviar(){
    return this.objEnviar;
  }

  public setObjenviar(objEnviar:any){

    this.objEnviar = objEnviar;
  }

  public esperarPeticion():Subject<any>{
    this.observador = new Subject();
    return this.observador;

  }

  public setCompletarSuscripcion(obj:any){
   

 
    this.observador.next(obj);
    this.observador.complete();
    

    
    
  }

  
}
