import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ContratocolaboradorService } from 'src/app/modules/empleados/services/contratocolaborador.service';
import { EmpleadosService } from 'src/app/modules/empleados/services/empleados.service';
import { JornadalaboralService } from 'src/app/modules/empresas/pages/submodulos/jonadaLaboral/services/jornadalaboral.service';
import { SharedAreasService } from 'src/app/shared/services/areasypuestos/shared-areas.service';
import { CatalogosService } from 'src/app/shared/services/catalogos/catalogos.service';
import { ModalService } from 'src/app/shared/services/modales/modal.service';
import { SharedPoliticasService } from 'src/app/shared/services/politicas/shared-politicas.service';
import { SharedSedesService } from 'src/app/shared/services/sedes/shared-sedes.service';
import { UsuarioSistemaService } from 'src/app/shared/services/usuariosistema/usuario-sistema.service';


@Component({
  selector: 'app-empleo',
  templateUrl: './empleo.component.html',
  styleUrls: ['./empleo.component.scss']
})
export class EmpleoComponent implements OnInit {

  public editarcampos: boolean = false;
  public submitEnviado: boolean = false;

  public myForm!: FormGroup;
  public idEmpleado!: number;

  public empleado: any = {};
  public arregloArea: any = [];
  public arregloPuestos: any = [];
  public arregloempleadosreporta: any = [];
  public arregloSedes: any = [];
  public arregloEstados: any = [];
  public arregloJornadas: any = [];
  public arregloPoliticas: any = [];

  constructor(private formBuilder: FormBuilder, private contratoColaboradorPrd: ContratocolaboradorService,
    private router: ActivatedRoute, public catalogosPrd: CatalogosService,
    private areasPrd: SharedAreasService, private usuariosSistemaPrd: UsuarioSistemaService,
    private empleadosPrd: EmpleadosService, private sedesPrd: SharedSedesService, private jornadaPrd: JornadalaboralService, private politicasPrd: SharedPoliticasService,
    private modalPrd: ModalService) { }

  ngOnInit() {




    this.router.params.subscribe(params => {
      this.idEmpleado = params["id"];

      this.contratoColaboradorPrd.getContratoColaboradorById(this.idEmpleado).subscribe(datos => {
        this.empleado = datos.datos;
        this.myForm = this.createForm(this.empleado);
        this.cambiaArea();
        console.log(this.empleado);
      });;
    });


    this.myForm = this.createForm(this.empleado);



    this.areasPrd.getAreasByEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloArea = datos.datos);
    this.empleadosPrd.getEmpleadosCompania(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloempleadosreporta = datos.datos);
    this.sedesPrd.getsedeByEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloSedes = datos.datos);
    this.catalogosPrd.getAllEstados().subscribe(datos => this.arregloEstados = datos.datos);
    this.jornadaPrd.jornadasByEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloJornadas = datos.datos);
    this.politicasPrd.getPoliticasByEmpresa(this.usuariosSistemaPrd.getIdEmpresa()).subscribe(datos => this.arregloPoliticas = datos.datos);


  }



  public createForm(obj: any) {
    let datePipe = new DatePipe("en-MX");






    return this.formBuilder.group({
      areaId: [obj.areaId?.areaId, [Validators.required]],
      puestoId: [{ value: obj.puestoId?.puestoId, disabled: true }, [Validators.required]],
      puesto_id_reporta: obj.puesto_id_reporta,
      sedeId: obj.sedeId?.sedeId,
      estadoId: obj.estadoId?.estadoId,
      fechaAntiguedad: [datePipe.transform(obj.fechaAntiguedad, 'yyyy-MM-dd'), [Validators.required]],
      fechaInicio: [datePipe.transform(obj.fechaInicio, 'yyyy-MM-dd'), [Validators.required]],
      fechaFin: [datePipe.transform(obj.fechaFin, 'yyyy-MM-dd'), [Validators.required]],
      jornadaId: [obj.jornadaId?.jornadaId, [Validators.required]],
      politicaId: [obj.politicaId?.politicaId, [Validators.required]],
      esSindicalizado: [`${obj.esSindicalizado}`]
    });



  }



  public enviarFormulario() {
    this.submitEnviado = true;

    console.log(this.myForm.value);

    if (this.myForm.invalid) {
      this.modalPrd.showMessageDialog(this.modalPrd.error);
      return;
    }

    const titulo =  "¿Deseas actualizar los datos del usuario?";
 
    this.modalPrd.showMessageDialog(this.modalPrd.warning,titulo).then(valor =>{
      if(valor){


        let obj = this.myForm.value;    
        //Se verifica que tipo de jornada se selecciono
        let idTipoJornada = -1;    
        for(let item of this.arregloJornadas){    
          if(obj.jornadaId == item.jornadaId){             
            idTipoJornada = item.tipoJornadaId;
            break;
          }    
        }
        //******************************************* */


        if (obj.fechaAntiguedad != null && obj.fechaAntiguedad != '') {
          const fecha1 = new Date(obj.fechaAntiguedad).toUTCString().replace("GMT", "");
          obj.fechaAntiguedad = `${new Date(fecha1).getTime()}`;
        }

        if (obj.fechaInicio != null && obj.fechaInicio != '') {
          const fecha1 = new Date(obj.fechaInicio).toUTCString().replace("GMT", "");
          obj.fechaInicio = `${new Date(fecha1).getTime()}`;
        }
        if (obj.fechaFin != null && obj.fechaFin != '') {
          const fecha1 = new Date(obj.fechaFin).toUTCString().replace("GMT", "");
          obj.fechaFin = `${new Date(fecha1).getTime()}`;
        }
    
    
  
        let objEnviar = {
          ...this.empleado,          
          areaId:{areaId:obj.areaId},
          puestoId:{puestoId:obj.puestoId},
          sedeId:{sedeId:obj.sedeId},
          estadoId:{estadoId:obj.estadoId},
          fechaAntiguedad:obj.fechaAntiguedad,
          fechaInicio:obj.fechaInicio,
          fechaFin:obj.fechaFin,
          jornadaId:{jornadaId:obj.jornadaId,tipoJornadaId:{tipoJornadaId:idTipoJornada}},
          tipoJornadaId:idTipoJornada,
          politicaId:{politicaId:obj.politicaId},
          esSindicalizado:obj.esSindicalizado          
      }

    
      
      this.contratoColaboradorPrd.update(objEnviar).subscribe(datos =>{
        this.modalPrd.showMessageDialog(datos.resultado,datos.mensaje).then(()=>{
          if(datos.resultado){
            console.log(datos);
            this.empleado = datos.datos;
            this.myForm = this.createForm(this.empleado);           
            this.editarcampos = false;
          }
        });
      });

      
      

      }
    });
  }


  public cambiaArea() {
    this.myForm.controls.puestoId.disable();

    this.arregloPuestos = [];
    this.areasPrd.getPuestoByArea(this.usuariosSistemaPrd.getIdEmpresa(), this.myForm.controls.areaId.value).subscribe(datos => {

      this.arregloPuestos = datos.datos;
      this.myForm.controls.puestoId.enable();
    });
  }


  public get f() {
    return this.myForm.controls;
  }

}
