import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tabla } from 'src/app/core/data/tabla';
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
  @Input() concluida:boolean = false;

  public cargandoIcon: boolean = false;
  public datos:any = {};

  public cargando:boolean = false;

  private esOrdinaria:boolean = false;
  public arreglotabla:any = {
    columnas:[],
    filas:[]
  }
  constructor(private modalPrd: ModalService,
    private reportesPrd:ReportesService,private nominaPrd:NominaordinariaService,
    private usuarioSistemaPrd:UsuarioSistemaService,
    private navigate:Router,private currency:CurrencyPipe) { }

  ngOnInit(): void {

    this.esOrdinaria = false;
    if (this.nominaSeleccionada.nominaOrdinaria) {
      this.esOrdinaria = true;
     this.llave = "nominaOrdinaria";
    } else if (this.nominaSeleccionada.nominaExtraordinaria) {
      this.llave = "nominaExtraordinaria";
    } else if (this.nominaSeleccionada.nominaLiquidacion) {
      this.llave = "nominaLiquidacion";
    } else if (this.nominaSeleccionada.nominaPtu) {
      this.llave = "nominaPtu";
    }

    this.cargandoIcon = true;

    


    this.cargando = true;
    this.nominaPrd.concluir(this.nominaSeleccionada[this.llave].nominaXperiodoId,this.usuarioSistemaPrd.getIdEmpresa()).subscribe(datos =>{
      this.cargando = false;
      this.cargandoIcon = false;
      this.datos = datos.datos;
      let columnas: Array<tabla> = [
        new tabla("totalPagoNeto", "Total pago neto"),
        new tabla("totalPagoNetoTotal", "Total pagado"),
        new tabla("totalPagoNetoDiferencia", "Pago neto pendiente"),
        new tabla("pagosRealizadosTotal", "Total a pagar"),
        new tabla("pagosRealizados", "Pago realizados"),
        new tabla("pagosRealizadosDiferencia", "Pagos pendientes"),
        new tabla("recibosPagosTotal", "Total a timbrar"),
        new tabla("recibosPagos", "Timbrados"),
        new tabla("recibosPagosDiferencia", "Pendientes por timbrar")
      ];


      if(this.datos){
        
        for(let item of this.datos){

            item["totalPagoNetoTotal"] = this.currency.transform( item["totalPagoNetoTotal"]);
            item["totalPagoNeto"] = this.currency.transform( item["totalPagoNeto"]);
            item["totalPagoNetoDiferencia"] = Math.abs(item["totalPagoNetoDiferencia"]);
            item["totalPagoNetoDiferencia"] = this.currency.transform( item["totalPagoNetoDiferencia"]);
            
        }
      }

      this.arreglotabla = {
        columnas: columnas,
        filas: this.datos
      };


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
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.reportesPrd.enviarRecibosPago(this.nominaSeleccionada[this.llave].nominaXperiodoId).subscribe(datos =>{
            this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje)
          })
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
        this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
        if(datos.resultado){
          this.reportesPrd.crearArchivo(datos.datos,`Foliosfiscales_${this.nominaSeleccionada[this.llave].nombreNomina}_${this.nominaSeleccionada[this.llave].periodo}`,"pdf");
        }else{
          this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje);
        }
      });
  }


  public finalizarnomina(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Desea finalizar la nómina?").then(valor =>{
      if(valor){
        
        }
    });;
  }


  public descargarRecibos(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas descargar los recibos?").then(valor =>{
      if(valor){

    
        let enviarObj = {
          nominaPeriodoId: this.nominaSeleccionada[this.llave].nominaXperiodoId,
          esZip: true
        }

        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        if(this.esOrdinaria){
          this.reportesPrd.getComprobanteFiscalXMLOrdinarias(enviarObj).subscribe(valor => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            
            this.reportesPrd.crearArchivo(valor.datos,"recibospago_"+ `${this.nominaSeleccionada[this.llave].nombreNomina}_${this.nominaSeleccionada[this.llave].periodo}`,"zip")
          });
        }else{
          this.reportesPrd.getComprobanteFiscalXMLExtraordinarias(enviarObj).subscribe(valor => {
            this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
            
            this.reportesPrd.crearArchivo(valor.datos,"recibospago_"+ `${this.nominaSeleccionada[this.llave].nombreNomina}_${this.nominaSeleccionada[this.llave].periodo}`,"zip")
          });
        }

      

      }
    });
  }


  public concluirnomina(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas concluir la nómina?","Solo se podrá consultar ésta nómina desde Históricas en el módulo de Nóminas").then(valor =>{
       if(valor){
         this.modalPrd.showMessageDialog(this.modalPrd.loading);
           this.nominaPrd.concluirNomina(this.nominaSeleccionada[this.llave].nominaXperiodoId).subscribe(datos =>{
             this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
               if(datos.resultado){
                    this.regresarListado();
               }
             });
           });
       }
    });
  }


  public regresarListado(){

      if (this.nominaSeleccionada.nominaOrdinaria) {
        this.navigate.navigate(["/nominas/activas"]);
      } else if (this.nominaSeleccionada.nominaExtraordinaria) {
        this.navigate.navigate(["/nominas/nomina_extraordinaria"]);
      } else if (this.nominaSeleccionada.nominaLiquidacion) {
        this.navigate.navigate(["/nominas/finiquito_liquidacion"]);
      } else if (this.nominaSeleccionada.nominaPtu) {
        this.navigate.navigate(["/nominas/ptu"]);
      }
    
  }

 
}
