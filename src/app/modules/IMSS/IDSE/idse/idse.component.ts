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
  public cargandoIcon: boolean = false;
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
          new tabla("politica", "Política"),
          new tabla("percepciones", "Percepciones variables"),
          new tabla("patronal", "Registro patronal"),
          new tabla("estatusEmpleado", "Estatus de empleado"),
          new tabla("salario", "Salario diario"),
          new tabla("salarioIntegrado", "Salario diario integrado"),

          
        ];
       

        item.politica = "Estándar";
        item.percepciones = "0",
        item.patronal = "Y23542",
        item.estatusEmpleado = "Activo",
        item.salario = "72",
        item.salarioIntegrado = "762.79"

        this.arreglotablaDesglose.columnas = columnas;
        this.arreglotablaDesglose.filas = item;

        item.cargandoDetalle = false;
        
        break;
    }

  }

}
