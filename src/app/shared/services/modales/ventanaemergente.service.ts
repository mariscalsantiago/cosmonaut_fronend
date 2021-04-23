import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentanaemergenteService {

  public nuevanomina: string = "nuevanomina";
  public timbrado: string = "timbrado";
  public timbrar: string = "timbrar";
  public fotoperfil: string = "fotoperfil";
  public percepciones: string = "percepciones";
  public deducciones: string = "deducciones";
  public ndispersion: string = "ndispersion";
  public ntimbrado: string = "ntimbrado";


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
    fotoperfil: false,
    percepciones: false,
    deducciones: false,
    ndispersion: false,
    ntimbrado: false
  }

  constructor() { }

  public showVentana(tipoVentana: string, configuracion?: configuracion): Promise<any> {

    debugger;
    for (let llave in this.mostrar) {
      this.mostrar[llave] = false;
    }


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
        this.emergente.titulo = "Agregar percepciones";
        break;
      case this.fotoperfil:
        this.mostrar.fotoperfil = true;
        this.emergente.titulo = "Elegir foto de perfil";
        break;
      case this.deducciones:
        this.mostrar.deducciones = true;
        this.emergente.titulo = "Agregar deducciones";
        break;
      case this.ndispersion:
        this.mostrar.ndispersion = true;
        this.emergente.titulo = "Resumen de la dispersión";
        break;
      case this.ntimbrado:
        this.mostrar.ntimbrado = true;
        this.emergente.titulo = "Resumen del timbrado";
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
