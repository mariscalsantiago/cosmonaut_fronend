import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { ConfiguracionesService } from 'src/app/shared/services/configuraciones/configuraciones.service';
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

  public nominaId: string = "";
  public periodo: string = "";
  public fecha: string = "";


  constructor(private nominashistoricasPrd: NominasHistoricasService, private usuarioSistemaPrd: UsuarioSistemaService,
    public configuracionPrd:ConfiguracionesService) { }

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





  public recibirTabla(obj: any) {
    obj.datos.cargandoDetalle = false;
    
    switch (obj.type) {
      case "polizacontable":
          alert("Poliza contable");
        break;
      case "detallenomina":
        alert("detlale nomina");
        break;
      case "nomina":
        alert("nomina");
        break;
      case "fotos":
        alert("fotos");
        break;
      case "reportenomina":
        alert("reporte nomina")
        break;
      case "reportepolizacontable":
        alert("reporte poliza contable");
        break;
      case "recibonominazip":
        alert("recibo nomina zip");
        break;
      case "cancelartimbrado":
        alert("cancelartimbrado");
        break;
    }
  }


  public filtrar() {
    

  }
}
