import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentanaemergenteService {

  public solicitudCargaMasiva: string = "solicitudcargamasiva";
  public solicitudVacaciones: string = "solicitudVacaciones";
  public solicitudIncapacidad:string = "solicitudIncapacidad";

  public subject?: Subject<any>;;

  public emergente = {
    modal: false,
    titulo:''
  }

  public mostrar: any = {
    cargamasiva:false,
    solicitudvacacaciones:false,
    solicitudIncapacidad:false
  }

  constructor() { }

  public showVentana(tipoVentana: string): Promise<any> {


    for (let llave in this.mostrar) {
      this.mostrar[llave] = false;
    }


    console.log("Tipo de ventana",tipoVentana);
    switch (tipoVentana) {
      case this.solicitudCargaMasiva:
        this.mostrar.cargamasiva = true;
        this.emergente.titulo = "CARGA MASIVA DE EVENTOS";
        break;
      case this.solicitudVacaciones:
        this.mostrar.solicitudvacacaciones = true;
        this.emergente.titulo = "SOLICITUD DE VACACIONES";
        break;
        case this.solicitudIncapacidad:
        this.mostrar.solicitudIncapacidad = true;
        this.emergente.titulo = "SOLICITUD DE INCAPACIDAD";
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
