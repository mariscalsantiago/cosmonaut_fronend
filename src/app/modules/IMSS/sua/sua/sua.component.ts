import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-sua',
  templateUrl: './sua.component.html',
  styleUrls: ['./sua.component.scss']
})
export class SuaComponent implements OnInit {

  public empresa: any;
  public arregloEmpresa: any = [];
  public cargando: boolean = false;
  public cargandoIcon: boolean = false;
  public arreglotabla: any = {
    columnas: [],
    filas: []
  }
  public arreglotablaDesglose:any = {
      columnas:[],
      filas:[]
  };



  constructor(private empresasPrd: EmpresasService, private usauriosSistemaPrd: UsuarioSistemaService,
    private modalPrd:ModalService) { }

  ngOnInit(): void {
    this.empresasPrd.getAllEmp(this.usauriosSistemaPrd.getIdEmpresa()).subscribe(datos => {
      this.arregloEmpresa = datos.datos;
    });

    this.traerTabla();
  }

    public traerTabla() {
      const columna: Array<tabla> = [
        new tabla("nombre", "Nombre completo del empleado"),
        new tabla("sbc", "SBC"),
        new tabla("movimiento", "Movimiento"),
        new tabla("fecha", "Fecha de movimiento")
      ];
  
  
      this.arreglotabla.columnas = columna;
      this.arreglotabla.filas = [{
        nombre : "Mayte Delacrúz Nieto",
        sbc : "$323.91",
        movimiento : "Modificación",
        fecha : "18/05/2021"
      }];
    }


  public filtrar() {

  }

  public agregar() {

  }

  public recibirTabla(obj: any) {

    switch (obj.type) {
      case "eliminar":

      this.modalPrd.showMessageDialog(this.modalPrd.warning,"¿Deseas eliminar?").then(valor =>{
          
        if(valor){

        }
      
      });

        break;
      case "desglosar":
        let item = obj.datos;
       


        let columnas: Array<tabla> = [
          new tabla("nombre", "Política"),
          new tabla("razon", "Percepciones variables"),
          new tabla("nombrecuenta", "Registro patronal"),
          new tabla("nombremoneda", "Estatus de empleado"),
          new tabla("periodo", "Salario diario"),
          new tabla("baseperiododescripcion", "Salario diario integrado"),
          new tabla("periodoaguinaldodescripcion", "SBC")
          
        ];
       


        this.arreglotablaDesglose.columnas = columnas;
        this.arreglotablaDesglose.filas = item;

        item.cargandoDetalle = false;
        
        break;
    }

  }
}
