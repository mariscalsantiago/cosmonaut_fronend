import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { NominasHistoricasService } from 'src/app/shared/services/nominas/nominas-historicas.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';

@Component({
  selector: 'app-nomina-historicas',
  templateUrl: './nomina-historicas.component.html',
  styleUrls: ['./nomina-historicas.component.scss']
})
export class NominaHistoricasComponent implements OnInit {


  public arreglotabla: any =
    {
      columnas: [],
      filas: []
    }

  public cargando: boolean = false;


  constructor(private nominashistoricasPrd: NominasHistoricasService, private usuarioSistemaPrd: UsuarioSistemaService) { }

  ngOnInit(): void {
    let objEnviar = {
      clienteId: this.usuarioSistemaPrd.getIdEmpresa()
    }

    this.cargando = true;

    this.nominashistoricasPrd.getNominasHistoricas(objEnviar).subscribe(datos => {
      let columnas: Array<tabla> = [new tabla("nombreNomina", "Nombre de nómina"),
      new tabla("clavePeriodo", "Clave de periodo"),
      new tabla("anio", "Año"),
      new tabla("fechaInicio", "Fecha")
      ];

      if (datos.datos !== undefined) {
        for (let item of datos.datos) {
          item["anio"] = new DatePipe("es-MX").transform(item.fechaInicio, "yyyy");
        }
      }


      this.arreglotabla = {
        columnas: columnas,
        filas: datos.datos
      }

      this.cargando = false;

    });
  }





  public recibirTabla(obj:any) {
      obj.datos.cargandoDetalle = false;
  }
}
