import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public success: string = "success";
  public warning: string = "warning";
  public error: string = "error";
  public loading: string = "loading";
  public loadingfinish: string = "finishloading";
  public question: string = "question";
  public dispersar:string = "dispersar";

  public subject?: Subject<any>;;

  public modal = {
    strTitulo: "",
    iconType: "",
    modal: false,
    strSubtitulo: ""
  }

  constructor() { }

  public showMessageDialog(alerta: any, titulo?: string,subtitulo?:string): Promise<any> {

    if (alerta == this.loadingfinish) {

      this.modal.iconType = "";
      this.modal.modal = false;
      return new Promise((resultado) => { resultado; });
    }

    if (typeof (alerta) == "boolean") {
      alerta = alerta ? "success" : "error";
    }




    this.modal.modal = true;
    this.modal.iconType = alerta;
    titulo = (titulo == undefined) ? "" : titulo;
    this.modal.strTitulo = titulo;

    subtitulo = (subtitulo == undefined) ? "" : subtitulo;
    this.modal.strSubtitulo = subtitulo;

    switch (alerta) {
      case this.error:
        this.modal.strTitulo = titulo == "" ? "Campos obligatorios o inválidos" : titulo
        break;
      case this.loading:
        this.modal.strTitulo = titulo == ""?"":titulo;
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
