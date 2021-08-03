import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';

import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { NominaordinariaService } from 'src/app/shared/services/nominas/nominaordinaria.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-nominas-activas',
  templateUrl: './nominas-activas.component.html',
  styleUrls: ['./nominas-activas.component.scss']
})
export class NominasActivasComponent implements OnInit {


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
    private modalPrd: ModalService, private usuariSistemaPrd: UsuarioSistemaService,
    private nominaOrdinariaPrd: NominaordinariaService,public configuracionPrd:ConfiguracionesService) { }




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
    this.nominaOrdinariaPrd.getListaNominas(objenviar).subscribe(datos => {
      this.cargando = false;
      this.arreglo = datos.datos;
      if(this.arreglo){
        for (let item of this.arreglo) {
          item["inicial"] = !Boolean(item.nominaOrdinaria.totalNeto);
          item.nominaOrdinaria.fechaInicio = new DatePipe("es-MX").transform(new Date(new Date(item.nominaOrdinaria.fechaInicio).toUTCString().replace("GMT","")), 'yyyy-MM-dd');
          item.nominaOrdinaria.fechaFin = new DatePipe("es-MX").transform(new Date(new Date(item.nominaOrdinaria.fechaFin).toUTCString().replace("GMT","")), 'yyyy-MM-dd')

        }
      }
    });
  }

  public agregar() {
    this.ventana.showVentana(this.ventana.nuevanomina).then(valor => {

      if (valor.datos) {
        this.traerListaNomina();
      }
    });
  }

  public calcularNomina(item: any) {



    
        this.modalPrd.showMessageDialog(this.modalPrd.loading);
        let objEnviar = {
          nominaXperiodoId: item.nominaOrdinaria.nominaXperiodoId,
          clienteId: this.usuariSistemaPrd.getIdEmpresa(),
          usuarioId: this.usuariSistemaPrd.getUsuario().usuarioId
        }
        this.nominaOrdinariaPrd.calcularNomina(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.modalPrd.showMessageDialog(datos.resultado, datos.mensaje);
          if (datos.resultado) {
            this.router.navigate(['nominas','nomina'], { state: { datos: { nominaOrdinaria: item.nominaOrdinaria } } });
          }
        },e =>{
          if(e?.error?.mensaje.include("No has calculado ")){
              this.modalPrd.showMessageDialog(this.modalPrd.success,"¿Deseas promediar las variables?").then(valor =>{
                if(valor){
                    alert("Se va a redireccionar");
                    this.configuracionPrd.accesoRuta = true;
                    this.router.navigate(['/imss/variabilidad']);


                    setTimeout(() => {
                      if (!this.configuracionPrd.cargandomodulo) {
                        setTimeout(() => {
                          this.configuracionPrd.accesoRuta = false;
                        }, 10);
                      }
                  
                    }, 10);

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
        this.nominaOrdinariaPrd.eliminar(objEnviar).subscribe(datos => {
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
