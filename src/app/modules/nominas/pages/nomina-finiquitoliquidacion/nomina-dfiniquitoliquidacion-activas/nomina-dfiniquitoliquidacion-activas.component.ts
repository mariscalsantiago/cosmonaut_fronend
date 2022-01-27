import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { NominafiniquitoliquidacionService } from 'src/app/shared/services/nominas/nominafiniquitoliquidacion.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';



@Component({
  selector: 'app-nomina-dfiniquitoliquidacion-activas',
  templateUrl: './nomina-dfiniquitoliquidacion-activas.component.html',
  styleUrls: ['./nomina-dfiniquitoliquidacion-activas.component.scss']
})
export class NominaDFiniquitoliquidacionActivasComponent implements OnInit {

  public cargando: boolean = false;

  public arreglo: any = [];
  public arregloPersonas: any = [];

  public esRegistrar:boolean = false;
  public esCalcular:boolean = false;
  public esConsultar:boolean = false;
  public esConcluir:boolean = false;
  public esDispersar:boolean = false;
  public esEliminar:boolean = false;
  public esTimbrar:boolean = false;
  public esDescargar:boolean = false;

  private suscripcion!: Subscription;

  public modulo: string = "";
  public subModulo: string = "";
  public mensajePendiente:string = "";

  constructor(private ventana: VentanaemergenteService, private router: Router,
    private modalPrd: ModalService, private nominaFiniquitoPrd: NominafiniquitoliquidacionService, private usuariSistemaPrd: UsuarioSistemaService,
    public configuracionPrd:ConfiguracionesService,private nominaOrdinariaPrd:NominaordinariaService) { }

  ngOnInit(): void {

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();
    
    this.traerListaNomina();
    this.establecerPermisos();


    this.suscripcion = this.nominaOrdinariaPrd.verificarListaActualizada().subscribe(activo => {
      this.traerListaNomina();
    })
  }


  public establecerPermisos(){
    this.esRegistrar = this.configuracionPrd.getPermisos("Registrar");
    this.esCalcular = this.configuracionPrd.getPermisos("Calcular");
    this.esConsultar = this.configuracionPrd.getPermisos("Consultar");
    this.esConcluir = this.configuracionPrd.getPermisos("Concluir");
    this.esDispersar = this.configuracionPrd.getPermisos("Dispersar");
    this.esEliminar = this.configuracionPrd.getPermisos("Eliminar");
    this.esTimbrar = this.configuracionPrd.getPermisos("Timbrar");
    this.esDescargar = this.configuracionPrd.getPermisos("Descargar");
  }

  public traerListaNomina() {
    
    this.cargando = true;
    let objenviar =
    {
      clienteId: this.usuariSistemaPrd.getIdEmpresa()
    }
    this.nominaFiniquitoPrd.getListaNominas(objenviar).subscribe(datos => {
      this.cargando = false;
      this.arreglo = datos.datos;
      if (this.arreglo !== undefined) {
        for (let item of this.arreglo) {
          item["inicial"] =  !Boolean(item.nominaLiquidacion.totalNeto);
          item.esCalculada = item.nominaLiquidacion?.estadoActualNomina === 'Calculada';
          item.esPagada = (item.nominaLiquidacion?.estadoActualNomina === 'Pagada' || item.nominaLiquidacion?.estadoActualNomina === 'En proceso pago');
          item.esTimbrada = item.nominaLiquidacion?.estadoActualNomina === 'Timbrada' || item.nominaLiquidacion?.estadoActualNomina === 'En proceso timbrado';
          item.esConcluir = item.nominaLiquidacion?.estadoActualNomina === 'Pagada' && item.nominaLiquidacion?.estadoActualNomina === 'Timbrada';
          item.mensajePensando = item.nominaLiquidacion.estadoProcesoNominaId == 4 ? item.nominaLiquidacion.procesoNominaObservaciones : "";
          item.estadoPensando = item.nominaLiquidacion.estadoProcesoNominaId == 1 || item.nominaLiquidacion.estadoProcesoNominaId == 2 || item.nominaLiquidacion.estadoProcesoNominaId == 4;
          
          if(item.nominaLiquidacion?.estadoActualNomina !==	"Calculada" && item.nominaLiquidacion?.estadoActualNomina !==	"Nueva"){
            item.eliminarBut = false;
          }else{
            item.eliminarBut = true;
          }
        }
      }
    });
  }

  public inicio(){
    this.router.navigate(['/inicio']);
  }

  public agregar() {
    this.ventana.showVentana(this.ventana.nuevanominafiniquitoliquidacion).then(valor => {


      
      if (valor.datos) {
        //  this.arreglo = this.arreglo == undefined ? [] : this.arreglo;
        //  this.arreglo.push({ nominaLiquidacion: { ...valor.datos.datos },inicial:true });
        this.traerListaNomina();
      }
    });
  }


  public calcularNomina(item: any) {

    
      
        this.modalPrd.showMessageDialog(this.modalPrd.loading);

        let objEnviar = {
          nominaXperiodoId: item.nominaLiquidacion.nominaXperiodoId,
          clienteId: this.usuariSistemaPrd.getIdEmpresa()
        }
        this.nominaFiniquitoPrd.calcularNomina(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
          this.mensajePendiente = datos.mensaje;
          if (datos.resultado) {
            this.nominaOrdinariaPrd.verEstatusNominasByEmpresa(this.usuariSistemaPrd.getIdEmpresa(), item.nominaLiquidacion.nominaXperiodoId);
            item.nominaLiquidacion.estadoProcesoNominaId = 1;
            item.nominaLiquidacion.estadoProcesoDescripcion = "Calculando";
            item.mensajePensando = item.nominaLiquidacion.estadoProcesoNominaId == 4 ? item.nominaLiquidacion.procesoNominaObservaciones : "";
            item.estadoPensando = item.nominaLiquidacion.estadoProcesoNominaId == 1 || item.nominaLiquidacion.estadoProcesoNominaId == 2 || item.nominaLiquidacion.estadoProcesoNominaId == 4;
          }
        });


      
    

  }

  public continuar(item: any) {
    this.router.navigate(['/nominas/nomina'], { state: { datos: item } });
  }


  public eliminar(obj: any, indice: number) {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas eliminar la nómina?").then(valor => {
      if (valor) {
        let objEnviar = {
          nominaXperiodoId: obj.nominaXperiodoId,
          usuarioId: this.usuariSistemaPrd.getUsuario().usuarioId
        };
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.nominaFiniquitoPrd.eliminar(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje).then(() => {
            if (datos.resultado) {
              this.arreglo.splice(indice, 1)
              
            }
          });
        });
      }
    });

  }

  public vermensaje(item: any) {
    if (item.nominaLiquidacion.estadoProcesoNominaId == 4) {
      this.modalPrd.showMessageDialog(this.modalPrd.warning, item.mensajePensando, "¿Deseas calcular de nuevo la nómina?").then(valor => {
        if (valor) {
          this.calcularNomina(item);
        }
      });
    } else if (item.nominaLiquidacion.estadoProcesoNominaId == 1) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "El sistema está realizando el cálculo de nómina solicitado");
    }

  }


  ngOnDestroy(): void {
    if (this.suscripcion) {
      this.suscripcion.unsubscribe();
    }
  }

  


}
