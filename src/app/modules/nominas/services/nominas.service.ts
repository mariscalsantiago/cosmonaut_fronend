import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NominasService {

  private arregloNomina:any = [];
  public arregloEmpleado:any = [];
  private subject = new Subject();

  constructor() { }

  public getAllNominas():Observable<any>{
    this.subject = new Subject();
    this.completar();
    return this.subject;

  }

  private completar(){
      setTimeout(() => {
        this.subject.next(this.arregloNomina);
        this.subject.complete();
      }, 2000);
  }


  public save(obj:any){
      this.arregloNomina.push(obj);
  }

  public saveEmpleado(obj:any){
    this.arregloEmpleado = obj;
  }



}
