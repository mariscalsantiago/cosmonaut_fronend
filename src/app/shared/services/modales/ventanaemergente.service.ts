import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentanaemergenteService {

  public nuevanomina: string = "nuevanomina";

  public subject?: Subject<any>;;

  public emergente = {
    modal: false,
    titulo: ''
  }

  public mostrar: any = {
    nuevanomina: false
  }

  constructor() { }

  public showVentana(tipoVentana: string): Promise<any> {


    for (let llave in this.mostrar) {
      this.mostrar[llave] = false;
    }


    switch (tipoVentana) {
      case this.nuevanomina:
        this.mostrar.nuevanomina = true;
        this.emergente.titulo = "NUEVA NÓMINA MANUAL";
        break;
    }


    this.subject = new Subject<any>();


    this.emergente.modal = true;

    return this.subject.toPromise();

  }


  public setModal(modal: any, mostrar: any) {
    this.emergente = modal;
    this.mostrar = mostrar;
  }


  public recibiendomensajes(evento: any) {

    this.emergente.modal = false;
    this.subject?.next(evento);
    this.subject?.complete();

  }

}
