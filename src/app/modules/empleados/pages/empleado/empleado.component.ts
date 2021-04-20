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
  public porcentaje:any={porcentaje:0};

  constructor(private routerCan: ActivatedRoute,
    private empleadosPrd: EmpleadosService, private reportesPrd: ReportesService,
    private empledoContratoPrd: ContratocolaboradorService) { }

  ngOnInit(): void {
    this.routerCan.params.subscribe(params => {
      this.idEmpleado = params["id"];
      this.empledoContratoPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datos => {

        this.empleado = datos.datos;
        console.log(this.empleado);

      });

      this.empleadosPrd.getPorcentajeavance(this.idEmpleado).subscribe(datos => {
        this.porcentaje = datos;
        console.log("Este es el %",this.porcentaje);
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

      this.reportesPrd.getReportePerfilPersonal(objenviar).subscribe(archivo => {
        this.cargandoIcon = false;
        const linkSource = 'data:application/pdf;base64,' + `${archivo.datos}\n`;
        const downloadLink = document.createElement("a");
        const fileName = `${datos.datos.numEmpleado}-${this.empleado.nombre.toUpperCase()}_${this.empleado.apellidoPaterno.toUpperCase()}.pdf`;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
      });


    });



  }




}
