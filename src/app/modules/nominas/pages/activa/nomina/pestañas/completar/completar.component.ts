import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-completar',
  templateUrl: './completar.component.html',
  styleUrls: ['./completar.component.scss']
})
export class CompletarComponent implements OnInit {

  @Input() esDescargar: boolean = false;
  private llave:string = "";

  @Input() nominaSeleccionada: any;

  public cargandoIcon: boolean = false;
  public datos:any = {};
  constructor(private modalPrd: ModalService,
    private reportesPrd:ReportesService,private nominaPrd:NominaordinariaService,
    private usuarioSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {

    if (this.nominaSeleccionada.nominaOrdinaria) {
     this.llave = "nominaOrdinaria";
    } else if (this.nominaSeleccionada.nominaExtraordinaria) {
      this.llave = "nominaExtraordinaria";
    } else if (this.nominaSeleccionada.nominaLiquidacion) {
      this.llave = "nominaLiquidacion";
    } else if (this.nominaSeleccionada.nominaPtu) {
      this.llave = "nominaPtu";
    }


    this.nominaPrd.concluir(this.nominaSeleccionada[this.llave].nominaXperiodoId,this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos =>{
      console.log("Esto es concluir",this.datos = datos.datos);
    });


  }


  public cancelarTimbrado() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas cancelar el timbrado de nómina?").then((valor) => {
      if (valor) {

      }
    });;
  }

  public enviarRecibos() {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas enviar los recibos de pago a los empleados?").then((valor) => {
      if (valor) {
       let objEnviar = {
          nominaXperiodoId: this.nominaSeleccionada[this.llave].nominaXperiodoId,
          listaIdPersona: [
    
          ]
        }

        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.reportesPrd.getFoliosnominaConcluir(objEnviar).subscribe(objrecibido => {
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          if (objrecibido.resultado) {
            this.reportesPrd.crearArchivo(objrecibido.datos, `Foliosfiscales_${this.nominaSeleccionada[this.llave].nombreNomina}_${this.nominaSeleccionada[this.llave].clavePeriodo}`, "pdf");
          } else {
            this.modalPrd.showMessageDialog(objrecibido.resultado, objrecibido.mensaje);
          }
        });
      }
    });;
  }


  public descargarFolios() {
    let objEnviar = {
      nominaXperiodoId: this.nominaSeleccionada[this.llave].nominaXperiodoId,
      listaIdPersona: [
    
      ]}

      this.modalPrd.showMessageDialog(this.modalPrd.loading);
      this.reportesPrd.getFoliosnominaConcluir(objEnviar).subscribe(datos =>{
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        if(datos.resultado){
          this.reportesPrd.crearArchivo(datos.datos,`Foliosfiscales_${this.nominaSeleccionada[this.llave].nombreNomina}_${this.nominaSeleccionada[this.llave].periodo}`,"pdf");
        }else{
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
        }
      });
  }

 
}
