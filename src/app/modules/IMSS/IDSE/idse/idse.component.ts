import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { EmpresasService } from 'src/app/modules/empresas/services/empresas.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-idse',
  templateUrl: './idse.component.html',
  styleUrls: ['./idse.component.scss']
})
export class IDSEComponent implements OnInit {

  public empresa: any;
  public arregloEmpresa: any = [];
  public cargando: boolean = false;
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
      new tabla("n", "Nombre"),
      new tabla("", "SBC"),
      new tabla("", "Movimiento"),
      new tabla("", "Fecha de movimiento")
    ];


    this.arreglotabla.columnas = columna;
    this.arreglotabla.filas = [{}, {}, {}, {}, {}, {}, {}, {}];
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
