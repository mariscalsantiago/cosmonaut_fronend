import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { EmpleadosService } from '../../services/empleados.service';


@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent implements OnInit {
  

  public cargandoIcon:boolean = false;

  public empleado: any = {};

  constructor( private routerCan: ActivatedRoute,
    private empleadosPrd: EmpleadosService, private reportesPrd: ReportesService) { }

  ngOnInit(): void {
    this.routerCan.params.subscribe(params => {
      let idEmpleado = params["id"];
      this.empleadosPrd.getEmpleadoById(idEmpleado).subscribe(datos => {
        this.empleado = datos.datos;
      });
    });


  }


 


  public iniciarDescarga() {
    this.cargandoIcon = true;
    this.reportesPrd.getReportePerfilPersonal(this.empleado.personaId).subscribe(datos => {
      this.cargandoIcon = false;
      const linkSource = 'data:application/pdf;base64,' + `${datos.datos}\n`;
      const downloadLink = document.createElement("a");
      const fileName = `${this.empleado.nombre}.pdf`;

      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    });
  }




}
