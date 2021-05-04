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
  public subirdocumento: string = "subirdocumento";
  public nuevanominaextraordinaria:string = "nuevanominaextraordinaria";
  public nuevanominaptu:string = "nuevanominaptu";


  private subject?: Subject<any>;;

  private emergente: any = {
    modal: false,
    titulo: '',
    ventanaalerta: false,
    datos:undefined
  }

  private mostrar: any = {

    nuevanomina: false,
    timbrado: false,
    timbrar: false,
    fotoperfil: false,
    percepciones: false,
    deducciones: false,
    ndispersion: false,
    ntimbrado: false,
    subirdocumento: false,
    nuevanominaptu:false
  }

  constructor() { }

  public showVentana(tipoVentana: string, configuracion?: configuracion): Promise<any> {

    
    for (let llave in this.mostrar) {
      this.mostrar[llave] = false;
    }
    


    this.emergente.datos = configuracion?.datos;


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
      case this.subirdocumento:
        this.mostrar.subirdocumento = true;
        this.emergente.titulo = "Subir documento";
        break;
        case this.nuevanominaptu:
        this.mostrar.nuevanominaptu = true;
        this.emergente.titulo = "Nómina de PTU";
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
  public ventanaalerta?: boolean = false;
  public datos?:any = undefined;
}
