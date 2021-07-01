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
      for (let item of this.arreglo) {
        item["inicial"] = item.nominaOrdinaria.total == undefined;
      }
    });
  }

  public agregar() {
    this.ventana.showVentana(this.ventana.nuevanomina).then(valor => {

      if (valor.datos) {
        //this.arreglo = this.arreglo == undefined ? [] : this.arreglo;

        //  this.arreglo.push({ nominaOrdinaria: { ...valor.datos.datos },inicial:true });

        this.traerListaNomina();

      }
    });
  }

  public calcularNomina(item: any) {



    this.modalPrd.showMessageDialog(this.modalPrd.question, "Importante", "No has calculado el promedio de variables para este bimestre. Si continuas, tomaremos el promedio del bimestre anterior.").then((valor) => {
      if (valor) {
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
