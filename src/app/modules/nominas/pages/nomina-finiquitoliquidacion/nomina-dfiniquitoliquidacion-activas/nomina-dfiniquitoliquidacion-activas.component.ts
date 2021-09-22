import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { NominafiniquitoliquidacionService } from 'src/app/shared/services/nominas/nominafiniquitoliquidacion.service';
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

  constructor(private ventana: VentanaemergenteService, private router: Router,
    private modalPrd: ModalService, private nominaFiniquitoPrd: NominafiniquitoliquidacionService, private usuariSistemaPrd: UsuarioSistemaService,
    public configuracionPrd:ConfiguracionesService) { }

  ngOnInit(): void {
    this.traerListaNomina();
    this.establecerPermisos();
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
          item.esCalculada = item.nominaPtu?.estadoActualNomina === 'Calculada';
          item.esPagada = (item.nominaPtu?.estadoActualNomina === 'Pagada' || item.nominaPtu?.estadoActualNomina === 'En proceso pago');
          item.esTimbrada = item.nominaPtu?.estadoActualNomina === 'Timbrada' || item.nominaPtu?.estadoActualNomina === 'En proceso timbrado';
          item.esConcluir = item.nominaPtu?.estadoActualNomina === 'Pagada' && item.nominaPtu?.estadoActualNomina === 'Timbrada';
        
        }
      }
    });
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
          if (datos.resultado) {
            item.nominaLiquidacion.numEmpleados = datos.datos.cantidadEmpleados;
            item.nominaLiquidacion.totalPercepciones = datos.datos.totalPercepcion;
            item.nominaLiquidacion.totalDeducciones = datos.datos.totalDeduccion;
            item.nominaLiquidacion.totalNeto = datos.datos.total;
            this.router.navigate(['/nominas/nomina'], { state: { datos: { nominaLiquidacion: datos.datos } } });
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




}
