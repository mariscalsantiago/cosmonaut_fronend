import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public success: string = "success";
  public warning: string = "warning";
  public error: string = "error";

  public subject?: Subject<any>;;

  public modal = {
    strTitulo: "",
    iconType: "",
    modal: false
  }

  constructor() { }

  public showMessageDialog(alerta: any, titulo?: string): Promise<any> {

    if(typeof(alerta) == "boolean"){
       alerta = alerta ? "success" : "error";
    }

    this.modal.modal = true;
    this.modal.iconType = alerta;
    titulo = (titulo == undefined) ? "" : titulo;
    this.modal.strTitulo = titulo;

    switch (alerta) {
      case this.error:
        this.modal.strTitulo = titulo == "" ? "Campos obligatorios o inválidos" : titulo
        break;
    }

    this.subject = new Subject<any>();
    return this.subject.toPromise();
  }

  public setModal(modal: any) {
    this.modal = modal;
  }

  public recibiendomensajes(evento: any) {

    this.modal.modal = false;
    this.subject?.next(evento);
    this.subject?.complete();

  }
}
