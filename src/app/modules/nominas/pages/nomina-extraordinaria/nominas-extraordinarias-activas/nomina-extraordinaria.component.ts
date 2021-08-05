import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { NominaaguinaldoService } from 'src/app/shared/services/nominas/nominaaguinaldo.service';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-nomina-extraordinaria',
  templateUrl: './nomina-extraordinaria.component.html',
  styleUrls: ['./nomina-extraordinaria.component.scss']
})
export class NominaExtraordinariaComponent implements OnInit {

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
    private modalPrd: ModalService,
    private empleadoPrd: EmpleadosService, private nominaAguinaldoPrd: NominaaguinaldoService, private usuariSistemaPrd: UsuarioSistemaService,
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

  public traerListaNomina(){
    this.cargando = true;
    let objenviar =
    {
      clienteId: this.usuariSistemaPrd.getIdEmpresa()
    }
    this.nominaAguinaldoPrd.getListaNominas(objenviar).subscribe(datos => {
      this.cargando = false;
      this.arreglo = datos.datos;
      if(this.arreglo){
        for (let item of this.arreglo) {
          item["inicial"] = !Boolean(item.nominaExtraordinaria.totalNeto);
          item.nominaExtraordinaria.fechaInicio = new DatePipe("es-MX").transform(new Date(new Date(item.nominaExtraordinaria.fechaInicio).toUTCString().replace("GMT","")), 'yyyy-MM-dd');
          item.nominaExtraordinaria.fechaFin = new DatePipe("es-MX").transform(new Date(new Date(item.nominaExtraordinaria.fechaFin).toUTCString().replace("GMT","")), 'yyyy-MM-dd')
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

    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas calcular la nómina?").then(valor =>{
      if(valor){
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        let objEnviar = {
          nominaXperiodoId: item.nominaExtraordinaria.nominaXperiodoId,
          clienteId: this.usuariSistemaPrd.getIdEmpresa(),
          usuarioId: this.usuariSistemaPrd.getUsuario().usuarioId
        } 
        this.nominaAguinaldoPrd.calcularNomina(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
          if (datos.resultado) {
            this.router.navigate(['/nominas/nomina'], { state: { datos: { nominaExtraordinaria: item.nominaExtraordinaria } } });
          }
        });
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



}
