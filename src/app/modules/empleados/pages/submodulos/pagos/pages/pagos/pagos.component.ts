import { Component, ElementRef, OnInit } from '@angular/core';
import { GruponominasService } from 'src/app/modules/empresas/pages/submodulos/gruposNomina/services/gruponominas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit {

  public arreglopintar: any = [false, false, false, false, false];

  public metodopagobool:boolean = false;
  public detallecompensacionbool:boolean = false;

  public arregloMetodosPago!:Promise<any>;
  public arreglogrupoNomina!:Promise<any>;
  public arregloCompensacion!:Promise<any>;

  constructor(private modalPrd:ModalService,private catalogosPrd:CatalogosService,
    private gruponominaPrd: GruponominasService,private usuariosSistemaPrd:UsuarioSistemaService) { }

  ngOnInit(): void {

   this.arregloMetodosPago =  this.catalogosPrd.getAllMetodosPago().toPromise();   
   this.arreglogrupoNomina = this.gruponominaPrd.getAll(this.usuariosSistemaPrd.getIdEmpresa()).toPromise();
   this.arregloCompensacion = this.catalogosPrd.getCompensacion().toPromise();

  }


  public cambiarStatus(valor: any) {

    for (let x = 0; x < this.arreglopintar.length; x++) {

      if (x == valor) {
        continue;
      }

      this.arreglopintar[x] = false;

    }
    this.arreglopintar[valor] = !this.arreglopintar[valor];
  }

  public guardandometodoPago(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas actualizar los datos del método de pago?").then(valor =>{
      if(valor){
          setTimeout(() => {
            this.modalPrd.showMessageDialog(this.modalPrd.success,"Operación exitosa").then(()=>{
              this.metodopagobool = false;
            });;
          }, 1000);
      }
    });
  }


  public guardarDetalleCompensacion(){
    this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas actualizar los datos del usuario?").then(valor =>{
      if(valor){
          setTimeout(() => {
            this.modalPrd.showMessageDialog(this.modalPrd.success,"Operación exitosa").then(()=>{
              this.detallecompensacionbool = false;
            });;
          }, 1000);
      }
    });
  }


  public cancelar(){
    this.metodopagobool = false;
    this.detallecompensacionbool = false;
  }
}
