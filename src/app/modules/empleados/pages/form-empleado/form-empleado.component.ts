import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { ContratocolaboradorService } from '../../services/contratocolaborador.service';
import { DomicilioService } from '../../services/domicilio.service';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-form-empleado',
  templateUrl: './form-empleado.component.html',
  styleUrls: ['./form-empleado.component.scss']
})
export class FormEmpleadoComponent implements OnInit {

  public titulo:string = "DAR DE ALTA EMPLEADO";

  public activado = [
    { tab: true, form: true, disabled: false,seleccionado:true },
    { tab: false, form: false, disabled: false ,seleccionado:false},
    { tab: false, form: false, disabled: false ,seleccionado:false},
    { tab: false, form: false, disabled: false,seleccionado:false },   
    { tab: false, form: false, disabled: false ,seleccionado:false}];

  public ocultarDetalleTransfrencia: boolean = true;
  public ocultarempleada: boolean = false;
  public cargandoIcon: boolean = false;
  public tabsEnviar: any = [{}, [{}], {}];
  public insertar: boolean = true;

  public elEmpleado:any = {
    url:"assets/imgs/usuario.png"
  };
  public porcentaje:any={porcentaje:0};



  public mostrarDetalleTransferencia: boolean = false;

  public datosPersona: any = {
    insertar: this.insertar
  };

  public cambiaValor: boolean = false;

  constructor(private routerPrd: Router, private reportesPrd: ReportesService,
    private domicilioPrd:DomicilioService,private empleadosPrd: EmpleadosService,private empledoContratoPrd:ContratocolaboradorService,
    private ventana:VentanaemergenteService,private modalPrd:ModalService,public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    
    let temp =  history.state.datos;
    
    if(temp !== undefined){
      this.titulo = "COMPLETAR DATOS DEL EMPLEADO";
      this.datosPersona = temp;
      this.datosPersona.insertar = history.state.insertar;
      this.tabsEnviar[0] = temp;
      this.domicilioPrd.getDomicilioPorEmpleado(this.datosPersona.personaId).subscribe(datosdomicilio =>{
        
          this.tabsEnviar[1] = datosdomicilio.datos;
      });

      this.activado[0].tab = true;
      this.activado[1].tab = true;
      this.activado[3].tab = true;
    }



    

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
       
        this.ocultarDetalleTransfrencia = elemento.metodopago.metodoPagoId !== 4;
        this.datosPersona.contratoColaborador = elemento.datos;
        this.datosPersona.metodopago = elemento.metodopago;
        this.tabsEnviar[3] = elemento.datos;



        this.empleadosPrd.getPorcentajeavance(this.datosPersona.personaId).subscribe(datos => {
          
          this.porcentaje = datos;
          
        });

        this.ocultarempleada = true;
        
        
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



    this.empledoContratoPrd.getContratoColaboradorById(this.tabsEnviar[0].idEmpleado).subscribe(datos => {


      let fechacontrato = datos.datos?.fechaContrato;





      let objenviar = {
        fechaContrato: fechacontrato,
        "centrocClienteId": {
          "centrocClienteId": datos.datos.centrocClienteId.centrocClienteId
        },
        "personaId": {
          "personaId": datos.datos.personaId.personaId
        }

      }

      this.reportesPrd.getReportePerfilPersonal(objenviar).subscribe(archivo => {
        this.cargandoIcon = false;
        this.reportesPrd.crearArchivo(archivo.datos,`${this.tabsEnviar[0].personaId.rfc}_${this.tabsEnviar[0].personaId.nombre.replace(" ","_")}_${this.tabsEnviar[0].personaId.apellidoPaterno}`,"pdf");
      });


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

  public subirFotoperfil(){
    this.ventana.showVentana(this.ventana.fotoperfil,{ventanaalerta:true}).then(valor =>{
      if(valor.datos != "" && valor.datos != undefined){
          this.modalPrd.showMessageDialog(this.modalPrd.loading);
          this.empleadosPrd.getEmpleadoById(this.tabsEnviar[0].personaId).subscribe(datos =>{
            let objEnviar = {
              ...datos.datos,
              imagen:valor.datos
            }

            this.empleadosPrd.update(objEnviar).subscribe(actualizado =>{
              this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
              this.modalPrd.showMessageDialog(actualizado.resultado,actualizado.mensaje);
              
            });
          });
      }
    });
  }


}
