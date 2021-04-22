import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentanaemergenteService {

  public nuevanomina: string = "nuevanomina";
  public timbrado: string = "timbrado";
  public timbrar: string = "timbrar";
  public percepciones: string = "percepciones";
  

  private subject?: Subject<any>;;

  private emergente: any = {
    modal: false,
    titulo: '',
    ventanaalerta: false
  }

  private mostrar: any = {
    nuevanomina: false,
    timbrado: false,
    timbrar: false,
    percepciones: false
  }

  constructor() { }

  public showVentana(tipoVentana: string, configuracion?: configuracion): Promise<any> {


    for (let llave in this.mostrar) {
      this.mostrar[llave] = false;
    }

    debugger;
    switch (tipoVentana) {
      
      case this.nuevanomina:
        this.mostrar.nuevanomina = true;
        this.emergente.titulo = "NUEVA NÓMINA MANUAL";
        break;
      case this.timbrado:
        this.mostrar.timbrado = true;
        this.emergente.titulo = "";
        break;
      case this.timbrar:
        this.mostrar.timbrar = true;
        this.emergente.titulo = "";
        break;
      case this.percepciones:
          this.mostrar.percepciones = true;
          this.emergente.titulo = "Agregar percepciónes";
      break;
    }


    this.subject = new Subject<any>();


    this.emergente.modal = true;

    this.emergente.ventanaalerta = configuracion?.ventanaalerta;

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


class configuracion {
  public ventanaalerta: boolean = false;
}
