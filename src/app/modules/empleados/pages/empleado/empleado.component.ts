import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportesService } from 'src/app/shared/services/reportes/reportes.service';
import { ContratocolaboradorService } from '../../services/contratocolaborador.service';
import { EmpleadosService } from '../../services/empleados.service';


@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.scss']
})
export class EmpleadoComponent implements OnInit {


  public cargandoIcon: boolean = false;

  public empleado: any = {};
  public idEmpleado: number = -1;

  constructor(private routerCan: ActivatedRoute,
    private empleadosPrd: EmpleadosService, private reportesPrd: ReportesService,
    private empledoContratoPrd: ContratocolaboradorService) { }

  ngOnInit(): void {
    this.routerCan.params.subscribe(params => {
      this.idEmpleado = params["id"];
      this.empleadosPrd.getEmpleadoById(this.idEmpleado).subscribe(datos => {
        this.empleado = datos.datos;
      });
    });





  }





  public iniciarDescarga() {
    this.cargandoIcon = true;



    this.empledoContratoPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datos => {


      let fechacontrato = datos.datos?.fechaContrato;
      
         

      


      let objenviar = {
        fechaContrato: fechacontrato,
        "centrocClienteId": {
          "centrocClienteId": datos.datos.centrocClienteId.centrocClienteId
        },
        "personaId": {
          "personaId": datos.datos.personaId.personaId
        }

      }

      console.log(objenviar);

      this.reportesPrd.getReportePerfilPersonal(objenviar).subscribe(datos => {
        this.cargandoIcon = false;
        const linkSource = 'data:application/pdf;base64,' + `${datos.datos}\n`;
        const downloadLink = document.createElement("a");
        const fileName = `${this.empleado.nombre}.pdf`;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      });


    });



  }




}
