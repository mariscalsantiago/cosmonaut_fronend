import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservadorEmpleadosService {


  private subject:Subject<boolean> = new Subject<boolean>();

  constructor() { }


  public CambioFotoPerfil():Observable<boolean>{
    return this.subject;
  }

  public setFotoPerfil(cambio:boolean){
     this.subject.next(cambio);  
  }


}
