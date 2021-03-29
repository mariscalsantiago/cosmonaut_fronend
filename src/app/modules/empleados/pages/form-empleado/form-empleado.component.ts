import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';

@Component({
  selector: 'app-form-empleado',
  templateUrl: './form-empleado.component.html',
  styleUrls: ['./form-empleado.component.scss']
})
export class FormEmpleadoComponent implements OnInit {

  public activado = [
    { tab: true, form: true, disabled: false },
    { tab: false, form: false, disabled: false },
    { tab: false, form: false, disabled: false },
    { tab: false, form: false, disabled: false },
    { tab: false, form: false, disabled: false }];

  public ocultarDetalleTransfrencia: boolean = true;
  public ocultarempleada: boolean = false;
  public cargandoIcon: boolean = false;
  public tabsEnviar: any = [{}, undefined, {}];



  public mostrarDetalleTransferencia: boolean = false;

  public datosPersona: any = {
  };


  public cambiaValor: boolean = false;

  constructor(private routerPrd: Router, private reportesPrd: ReportesService) { }

  ngOnInit(): void {
  }


  public recibir(elemento: any) {
    switch (elemento.type) {
      case "informacion":
        this.datosPersona = elemento.datos;
        this.activado[1].tab = true;
        this.activado[1].form = true;
        this.activado[1].seleccionado = true;
        this.activado[1].disabled = false;
        this.activado[0].form = false;
        this.activado[0].seleccionado = false;
        this.tabsEnviar[0] = elemento.datos;
        break;
      case "domicilio":
        this.activado[3].tab = true;
        this.activado[3].form = true;
        this.activado[3].seleccionado = true;
        this.activado[3].disabled = false;
        this.activado[1].form = false;
        this.activado[1].seleccionado = false;
        this.tabsEnviar[1] = elemento.datos;
        break;
      case "preferencias":

        this.activado[3].tab = true;
        this.activado[3].form = true;
        this.activado[3].disabled = false;
        this.activado[2].form = false;
        this.tabsEnviar[2] = elemento.datos;
        break;
      case "empleo":
        debugger;
        this.ocultarempleada = true;
        this.datosPersona = elemento.datos;
        this.ocultarDetalleTransfrencia = this.datosPersona.metodopago.metodoPagoId !== 4;

        if (!this.ocultarDetalleTransfrencia) {
          this.activado[4].tab = true;
          this.activado[4].form = true;
          this.activado[4].disabled = false;
          this.activado[4].seleccionado = true;
          this.activado[3].seleccionado = false;
          this.activado[3].form = false;
        } else {
          this.routerPrd.navigate(['/empleados']);
        }

        this.ocultarempleada = true;
        break;
    }

  }






  public recibiendoUserInsertado(evento: any) {
    this.datosPersona = evento;
  }


  public iniciarDescarga() {


    this.cargandoIcon = true;




    let fechacontrato = this.datosPersona.contratoColaborador?.fechaContrato;




    let objenviar = {
      fechaContrato: fechacontrato,
      "centrocClienteId": {
        "centrocClienteId": this.datosPersona.contratoColaborador.centrocClienteId.centrocClienteId
      },
      "personaId": {
        "personaId": this.datosPersona.contratoColaborador.personaId.personaId
      }

    }

    console.log(objenviar);

    this.reportesPrd.getReportePerfilPersonal(objenviar).subscribe(datos => {
      this.cargandoIcon = false;
      const linkSource = 'data:application/pdf;base64,' + `${datos.datos}\n`;
      const downloadLink = document.createElement("a");
      const fileName = `${this.datosPersona.nombre}.pdf`;

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    });






  }


  public backTab(numero: number) {

    if (!this.activado[numero].tab) return;

    for (let item of this.activado) {
      item.form = false;
      item.seleccionado = false;
    }

    this.activado[numero].tab = true;
    this.activado[numero].form = true;
    this.activado[numero].seleccionado = true;

  }




}
