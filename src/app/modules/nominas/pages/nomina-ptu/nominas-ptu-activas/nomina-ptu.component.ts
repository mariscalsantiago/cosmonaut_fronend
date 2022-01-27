import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { NominaptuService } from 'src/app/shared/services/nominas/nominaptu.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-nomina-ptu',
  templateUrl: './nomina-ptu.component.html',
  styleUrls: ['./nomina-ptu.component.scss']
})
export class NominaPTUComponent implements OnInit {

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

  private suscripcion!: Subscription;

  public modulo: string = "";
  public subModulo: string = "";
  public mensajePendiente:string = "";

  constructor(private ventana: VentanaemergenteService, private router: Router,
    private modalPrd: ModalService, private empleadoPrd: EmpleadosService, private usuariSistemaPrd: UsuarioSistemaService,
    private nominaPtuPrd: NominaptuService, public configuracionPrd: ConfiguracionesService,
    private nominaOrdinariaPrd:NominaordinariaService) { }

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
    this.nominaPtuPrd.getListaNominas(objenviar).subscribe(datos => {
      
      this.cargando = false;
      this.arreglo = datos.datos;
      for (let item of this.arreglo) {
        item["inicial"] = !Boolean(item.nominaPtu.totalNeto);
        item.esCalculada = item.nominaPtu?.estadoActualNomina === 'Calculada';
        item.esPagada = (item.nominaPtu?.estadoActualNomina === 'Pagada' || item.nominaPtu?.estadoActualNomina === 'En proceso pago');
        item.esTimbrada = item.nominaPtu?.estadoActualNomina === 'Timbrada' || item.nominaPtu?.estadoActualNomina === 'En proceso timbrado';
        item.esConcluir = item.nominaPtu?.estadoActualNomina === 'Pagada' && item.nominaPtu?.estadoActualNomina === 'Timbrada';
        item.mensajePensando = item.nominaPtu.estadoProcesoNominaId == 4 ? item.nominaPtu.procesoNominaObservaciones : "";
        item.estadoPensando = item.nominaPtu.estadoProcesoNominaId == 1 || item.nominaPtu.estadoProcesoNominaId == 2 || item.nominaPtu.estadoProcesoNominaId == 4;
        
        if(item.nominaPtu.estadoActualNomina !==	"Calculada" && item.nominaPtu.estadoActualNomina !==	"Nueva"){
          item.eliminarBut = false;
        }else{
          item.eliminarBut = true;
        }
      }
    });
  }

  public agregar() {
    this.ventana.showVentana(this.ventana.nuevanominaptu).then(valor => {

      this.traerListaNomina();
    });
  }

  public inicio(){
    this.router.navigate(['/inicio']);
  }

  public calcularNomina(item: any) {





    this.modalPrd.showMessageDialog(this.modalPrd.loading);
    let objEnviar = {
      nominaXperiodoId: item.nominaPtu.nominaXperiodoId,
      clienteId: this.usuariSistemaPrd.getIdEmpresa(),
      usuarioId: this.usuariSistemaPrd.getUsuario().usuarioId
    }
    this.nominaPtuPrd.calcularNomina(objEnviar).subscribe(datos => {
      this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
      this.mensajePendiente = datos.mensaje;
      if (datos.resultado) {
        this.nominaOrdinariaPrd.verEstatusNominasByEmpresa(this.usuariSistemaPrd.getIdEmpresa(), item.nominaPtu.nominaXperiodoId);
        item.nominaPtu.estadoProcesoNominaId = 1;
        item.nominaPtu.estadoProcesoDescripcion = "Calculando";
        item.mensajePensando = item.nominaPtu.estadoProcesoNominaId == 4 ? item.nominaPtu.procesoNominaObservaciones : "";
        item.estadoPensando = item.nominaPtu.estadoProcesoNominaId == 1 || item.nominaPtu.estadoProcesoNominaId == 2 || item.nominaPtu.estadoProcesoNominaId == 4;
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
        this.nominaPtuPrd.eliminar(objEnviar).subscribe(datos => {
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
    if (item.nominaPtu.estadoProcesoNominaId == 4) {

      const accionador: boolean = item.mensajePensando.includes("No se encontraron empleados a los cuales calcular el PTU.");
      const mensaje: string = accionador ? "¿Deseas agregar empleados?" : "¿Deseas calcular de nuevo la nómina?";

      this.modalPrd.showMessageDialog(this.modalPrd.warning, item.mensajePensando, mensaje).then(valor => {
        if (valor) {
          if (accionador) {
            item.nominaPtu.nominaPeriodoId = item.nominaPtu.nominaXperiodoId;
            this.ventana.showVentana(this.ventana.nuevanominaptu, { datos: { editar: true, datos: item.nominaPtu } }).then(valor => {
              switch(valor.type){
                case "guardar":
                    this.calcularNomina(item);
                  break;
              }
            });
          }else{
            this.calcularNomina(item);
          }
        }
      });
    } else if (item.nominaPtu.estadoProcesoNominaId == 1) {
      this.modalPrd.showMessageDialog(this.modalPrd.error, "El sistema está realizando el cálculo de nómina solicitado");
    }

  }


  ngOnDestroy(): void {
    if (this.suscripcion) {
      this.suscripcion.unsubscribe();
    }
  }


}
