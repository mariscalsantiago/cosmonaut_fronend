import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private ventana: VentanaemergenteService, private router: Router,
    private modalPrd: ModalService, private usuariSistemaPrd: UsuarioSistemaService,
    private nominaOrdinariaPrd: NominaordinariaService) { }

  ngOnInit(): void {
    
    this.traerListaNomina();

  }


  public traerListaNomina(){
  
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
        console.log(valor);
        console.log(valor.datos.datos);
        
        //this.arreglo.push({ nominaOrdinaria: { ...valor.datos.datos },inicial:true });
        //this.agregarNuevaNomina();
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
          usuarioId: this.usuariSistemaPrd.getUsuario().idUsuario
        }
        this.nominaOrdinariaPrd.calcularNomina(objEnviar).subscribe(datos => {
          this.modalPrd.showMessageDialog(this.modalPrd.loadingfinish);
          this.router.navigate(['/nominas/nomina'], { state: { datos: datos } });
        });


      }
    });


  }

  public continuar(item: any) {

    this.router.navigate(['/nominas/nomina'], { state: { datos: item } });
  }




}
