import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { NominaaguinaldoService } from 'src/app/shared/services/nominas/nominaaguinaldo.service';

@Component({
  selector: 'app-nomina-extraordinaria',
  templateUrl: './nomina-extraordinaria.component.html',
  styleUrls: ['./nomina-extraordinaria.component.scss']
})
export class NominaExtraordinariaComponent implements OnInit {

  public cargando: boolean = false;

  public arreglo: any = [];
  public arregloPersonas: any = [];

  constructor(private ventana: VentanaemergenteService, private router: Router,
    private modalPrd: ModalService,
    private empleadoPrd: EmpleadosService, private nominaAguinaldoPrd: NominaaguinaldoService, private usuariSistemaPrd: UsuarioSistemaService) { }

  ngOnInit(): void {

   this.traerListaNomina();

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

      if (this.arreglo != undefined) {
        for (let item of this.arreglo) {
          item["inicial"] = item.nominaExtraordinaria.total == undefined;
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




    this.modalPrd.showMessageDialog(this.modalPrd.question, "Importante", "No has calculado el promedio de variables para este bimestre. Si continuas, tomaremos el promedio del bimestre anterior.").then((valor) => {
      if (valor) {
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
