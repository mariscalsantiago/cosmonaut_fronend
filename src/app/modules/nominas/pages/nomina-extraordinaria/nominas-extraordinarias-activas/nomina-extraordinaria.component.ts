import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { NominaaguinaldoService } from 'src/app/shared/services/nominas/nominaaguinaldo.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { DatePipe } from '@angular/common';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nomina-extraordinaria',
  templateUrl: './nomina-extraordinaria.component.html',
  styleUrls: ['./nomina-extraordinaria.component.scss']
})
export class NominaExtraordinariaComponent implements OnInit, OnDestroy {

  public cargando: boolean = false;

  public arreglo: any = [];
  public arregloPersonas: any = [];

  public esRegistrar: boolean = false;
  public esCalcular: boolean = false;
  public esConsultar: boolean = false;
  public esConcluir: boolean = false;
  public esDispersar: boolean = false;
  public esEliminar: boolean = false;
  public esTimbrar: boolean = false;
  public esDescargar: boolean = false;

  public modulo: string = "";
  public subModulo: string = "";

  private suscripcion!: Subscription;

  constructor(private ventana: VentanaemergenteService, private router: Router,
    private modalPrd: ModalService,
    private empleadoPrd: EmpleadosService, private nominaAguinaldoPrd: NominaaguinaldoService, private usuariSistemaPrd: UsuarioSistemaService,
    public configuracionPrd: ConfiguracionesService, private nominaOrdinariaPrd: NominaordinariaService) { }

  ngOnInit(): void {

    this.modulo = this.configuracionPrd.breadcrum.nombreModulo?.toUpperCase();
    this.subModulo = this.configuracionPrd.breadcrum.nombreSubmodulo?.toUpperCase();

    this.traerListaNomina();

    this.establecerPermisos();


    this.suscripcion = this.nominaOrdinariaPrd.verificarListaActualizada().subscribe(activo => {
      this.traerListaNomina();
    })


  }


  public establecerPermisos() {
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
    this.nominaAguinaldoPrd.getListaNominas(objenviar).subscribe(datos => {
      this.cargando = false;
      this.arreglo = datos.datos;
      if (this.arreglo) {
        for (let item of this.arreglo) {
          item["inicial"] = !Boolean(item.nominaExtraordinaria.totalNeto);
          item.esCalculada = item.nominaExtraordinaria?.estadoActualNomina === 'Calculada';
          item.esPagada = (item.nominaExtraordinaria?.estadoActualNomina === 'Pagada' || item.nominaExtraordinaria?.estadoActualNomina === 'En proceso pago');
          item.esTimbrada = item.nominaExtraordinaria?.estadoActualNomina === 'Timbrada' || item.nominaExtraordinaria?.estadoActualNomina === 'En proceso timbrado';
          item.esConcluir = item.nominaExtraordinaria?.estadoActualNomina === 'Pagada' && item.nominaExtraordinaria?.estadoActualNomina === 'Timbrada';
          item.mensajePensando = item.nominaExtraordinaria.estadoProcesoNominaId == 4 ? item.nominaExtraordinaria.procesoNominaObservaciones : "";
          item.estadoPensando = item.nominaExtraordinaria.estadoProcesoNominaId == 1 || item.nominaExtraordinaria.estadoProcesoNominaId == 2 || item.nominaExtraordinaria.estadoProcesoNominaId == 4;

          if(item.nominaExtraordinaria?.estadoActualNomina !==	"Calculada" && item.nominaExtraordinaria?.estadoActualNomina !==	"Nueva"){
            item.eliminarBut = false;
          }else{
            item.eliminarBut = true;
          }
        }
      }
    })
  }

  public agregar() {
    this.ventana.showVentana(this.ventana.nuevanominaextraordinaria).then(valor => {


      if (valor.datos) {
        // this.arreglo = this.arreglo == undefined ? [] : this.arreglo;
        //this.arreglo.push({ nominaExtraordinaria: { ...valor.datos.datos }, inicial: true });
        this.traerListaNomina();
      }
    });
  }

  public calcularNomina(item: any) {

    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas calcular la nómina?").then(valor => {
      if (valor) {
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        let objEnviar = {
          nominaXperiodoId: item.nominaExtraordinaria.nominaXperiodoId,
          clienteId: this.usuariSistemaPrd.getIdEmpresa(),
          usuarioId: this.usuariSistemaPrd.getUsuario().usuarioId
        }
        this.nominaAguinaldoPrd.calcularNomina(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
          if (datos.resultado) {
            this.nominaOrdinariaPrd.verEstatusNominasByEmpresa(this.usuariSistemaPrd.getIdEmpresa(), item.nominaExtraordinaria.nominaXperiodoId);
            item.nominaExtraordinaria.estadoProcesoNominaId = 1;
            item.nominaExtraordinaria.estadoProcesoDescripcion = "Pendiente";
            item.mensajePensando = item.nominaExtraordinaria.estadoProcesoNominaId == 4 ? item.nominaExtraordinaria.procesoNominaObservaciones : "";
            item.estadoPensando = item.nominaExtraordinaria.estadoProcesoNominaId == 1 || item.nominaExtraordinaria.estadoProcesoNominaId == 2 || item.nominaExtraordinaria.estadoProcesoNominaId == 4;
          }
        });
      }
    });
  }



  public continuar(item: any) {
    this.router.navigate(['/nominas/nomina'], { state: { datos: item } });
  }

  public inicio(){
    this.router.navigate(['/inicio']);
  }

  public eliminar(obj: any, indice: number) {
    this.modalPrd.showMessageDialog(this.modalPrd.warning, "¿Deseas eliminar la nómina?").then(valor => {
      if (valor) {
        let objEnviar = {
          nominaXperiodoId: obj.nominaXperiodoId,
          usuarioId: this.usuariSistemaPrd.getUsuario().usuarioId
        };
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        this.nominaAguinaldoPrd.eliminar(objEnviar).subscribe(datos => {
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
    if (item.nominaExtraordinaria.estadoProcesoNominaId == 4) {
      this.modalPrd.showMessageDialog(this.modalPrd.warning, item.mensajePensando, "¿Deseas calcular de nuevo la nómina?").then(valor => {
        if (valor) {
          this.calcularNomina(item);
        }
      });
    } else if (item.nominaExtraordinaria.estadoProcesoNominaId == 1) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "La nómina se está procesando, podría tardar varios minutos. Si lo deseas puedes navegar en el sistema y volver a la pantalla de nóminas más tarde");
    }

  }


  ngOnDestroy(): void {
    if (this.suscripcion) {
      this.suscripcion.unsubscribe();
    }
  }

}
