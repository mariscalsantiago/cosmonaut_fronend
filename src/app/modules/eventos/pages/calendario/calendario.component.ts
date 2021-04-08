import { Component, OnInit } from '@angular/core';
import { tabla } from 'src/app/core/data/tabla';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { VentanaemergenteService } from 'src/app/shared/services/modales/ventanaemergente.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';
import { EventosService } from '../../services/eventos.service';

@Component({
  selector: 'app-calendarioevento',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {

  public apareceListadoEventos: boolean = false;
  public arreglotabla: any = {
    columnas: [],
    filas: []
  }


  public arregloEventos: any = [];
  public arregloAreas: any = [];

  constructor(private ventana: VentanaemergenteService, private eventoPrd: EventosService,
    private areasPrd: SharedAreasService, private catalogos: CatalogosService,
    private usuariosSistemaPrd: UsuarioSistemaService) { }

  ngOnInit(): void {

    this.catalogos.getTipoIncidencia(true).subscribe(datos => {
      this.arregloEventos = datos.datos;
      console.log("Este es el evento", this.arregloEventos);
    });

    this.areasPrd.getAreasByEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => {
      this.arregloAreas = datos.datos;
      console.log("Esta es la area", this.arregloAreas);
    });


    let fechaActual = new Date();
    let inicioMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    let finalMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);




    let obj = {
      clienteId: this.usuariosSistemaPrd.getIdEmpresa(),
      fechaInicio: inicioMes.getTime(),
      fechaFin: finalMes.getTime()
    }


  }

  

}
